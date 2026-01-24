import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import {
  emitNewMessage,
  emitNewReaction,
  updateConversationAfterCreateMessage,
} from "../utils/MessageHelper.js";
import { io } from "../socket/server.js";
import { storage, ID } from "../lib/appwrite.js";
import { InputFile } from "node-appwrite/file";

export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content, conversationId, replyToMessageId } = req.body;
    const senderId = req.user._id;
    let conversation;
    if (!content && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Nội dung tin nhắn không được để trống",
      });
    }
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }
    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map(),
      });
    }
    const file = req.file;
    let imageUrl = null;
    if (file) {
      try {
        const fileId = ID.unique();
        const uploadedFile = await storage.createFile(
          process.env.APPWRITE_BUCKET_ID,
          fileId,
          InputFile.fromBuffer(file.buffer, file.originalname),
        );
        imageUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
      } catch (uploadError) {
        console.log("Error uploading to Appwrite:", uploadError.message);
      }
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
      imageUrl,
      replyTo: replyToMessageId || null,
    });
    if (replyToMessageId) {
      await message.populate("replyTo", "content senderId imageUrl");
      await message.populate("replyTo.senderId", "fullName profilePicture");
    }
    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();
    emitNewMessage(conversation, message, io);
    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi gửi tin nhắn",
    });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content, replyToMessageId } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;
    if (!content && !req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Không có nội dung để gửi" });
    }
    const file = req.file;
    let imageUrl = null;
    if (file) {
      try {
        const fileId = ID.unique();
        const uploadedFile = await storage.createFile(
          process.env.APPWRITE_BUCKET_ID,
          fileId,
          InputFile.fromBuffer(file.buffer, file.originalname),
        );
        imageUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
      } catch (uploadError) {
        console.log("Error uploading to Appwrite:", uploadError.message);
      }
    }
    //
    // // Tạo message mới
    const newMessage = new Message({
      conversationId,
      content: content || "",
      senderId,
      imageUrl,
      replyTo: replyToMessageId || null,
    });
    await newMessage.save();
    if (replyToMessageId) {
      await newMessage.populate("replyTo", "content senderId imageUrl");
      await newMessage.populate("replyTo.senderId", "fullName profilePicture");
    }
    updateConversationAfterCreateMessage(conversation, newMessage, senderId);
    await conversation.save();
    emitNewMessage(conversation, newMessage, io);
    res.status(201).json({
      success: true,
      message: "Gửi tin nhắn thành công",
      newMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi gửi tin nhắn",
    });
  }
};
export const toggleReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;
    const message = await Message.findById(messageId);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Tin nhắn không tồn tại" });
    }
    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.userId.toString() === userId.toString() && r.emoji === emoji,
    );

    if (existingReactionIndex > -1) {
      message.reactions.splice(existingReactionIndex, 1);
    } else {
      message.reactions.push({
        userId,
        emoji,
        createdAt: new Date(),
      });
    }
    await message.save();
    await message.populate("reactions.userId", "fullName profilePicture");
    emitNewReaction(message, message.reactions, io);
    res.status(200).json({
      success: true,
      reactions: message.reactions,
    });
  } catch (error) {
    console.log("Error in toggleReaction controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xử lý reaction",
    });
  }
};

export const searchMessages = async (req, res) => {
  try {
    const { conversationId, query } = req.query;
    const userId = req.user._id;

    if (!conversationId || !query) {
      return res.status(400).json({
        success: false,
        message: "Thiếu conversationId hoặc query",
      });
    }

    // Check if user is a participant of the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Cuộc trò chuyện không tồn tại",
      });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.userId.toString() === userId.toString(),
    );
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập cuộc trò chuyện này",
      });
    }

    // Search messages using regex (case-insensitive)
    const messages = await Message.find({
      conversationId,
      content: { $regex: query, $options: "i" },
    })
      .sort({ createdAt: 1 })
      .limit(100)
      .populate("senderId", "fullName profilePicture")
      .lean();

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log("Error in searchMessages controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tìm kiếm tin nhắn",
    });
  }
};
