import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { io } from "../socket/server.js";

export const createConversation = async (req, res) => {
  try {
    const { type, memberIds, name } = req.body;
    const userId = req.user._id;

    if (
      !type ||
      (type === "group" && !name) ||
      !Array.isArray(memberIds) ||
      memberIds.length === 0 ||
      !memberIds
    ) {
      return res.status(400).send("Tên nhóm và thành viên không được để trống");
    }
    let conversation;
    if (type === "direct") {
      const participantId = memberIds[0];
      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [userId, participantId] },
      });
      if (!conversation) {
        conversation = await Conversation.create({
          type: "direct",
          participants: [
            { userId: userId, joinedAt: new Date() },
            { userId: participantId, joinedAt: new Date() },
          ],
          lastMessageAt: new Date(),
        });
      }
    } else if (type === "group") {
      conversation = await Conversation.create({
        type: "group",
        name,
        participants: [
          { userId },
          ...memberIds.map((id) => ({ userId: id, joinedAt: new Date() })),
        ],
        group: {
          name,
          createdBy: userId,
        },
      });
    }

    if (!conversation) {
      return res.status(400).send("Conversation khong hop le");
    }

    await conversation.populate([
      { path: "participants.userId", select: " fullName profilePicture" },
      { path: "lastMessage.senderId", select: " fullName profilePicture" },
      { path: "seenBy", select: " fullName profilePicture" },
    ]);
    const participants = conversation.participants.map((p) => {
      return {
        _id: p.userId._id,
        fullName: p.userId.fullName,
        profilePicture: p.userId.profilePicture,
      };
    });
    const formatConversation = {
      ...conversation.toObject(),
      participants,
    };
    if(type === "group"){
        memberIds.forEach((memberId) => {
          io.to(memberId).emit("new-group", formatConversation);
        },);
    }
    res.status(201).json({ success: true, conversation: formatConversation });
  } catch (err) {
    console.log("Lỗi tạo cuộc trò chuyện:", err);
    res.status(500).send("Lỗi hệ thống");
  }
};

export const getConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      "participants.userId": userId,
    })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate([
        { path: "participants.userId", select: " fullName profilePicture" },
        { path: "lastMessage.senderId", select: " fullName profilePicture" },
        { path: "seenBy", select: " fullName profilePicture" },
      ]);
    const format = conversations.map((conversation) => {
      const participants = conversation.participants.map((p) => {
        return {
          _id: p.userId._id,
          fullName: p.userId.fullName,
          profilePicture: p.userId.profilePicture,
        };
      });
      return {
        ...conversation.toObject(),
        unreadCounts: conversation.unreadCounts || 0,
        participants,
      };
    });
    return res.status(200).json({ success: true, conversations: format });
  } catch (e) {
    console.log("Lỗi xảy ra khi lấy conversation", e);
    res.status(500).send("Lỗi hệ thống");
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 10, cursor } = req.query;
    const query = { conversationId };
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }
    let messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) + 1)
        .populate("replyTo", "content senderId imageUrl")
        .populate("replyTo.senderId", "fullName profilePicture")
        .populate("reactions.userId", "fullName profilePicture");;
    let nextCursor = null;
    if (messages.length > Number(limit)) {
      const nextMessage = messages[messages.length - 1];
      nextCursor = nextMessage.createdAt.toISOString();
      messages.pop();
    }
    messages.reverse();
    return res.status(200).json({ success: true, messages, nextCursor });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Lỗi hệ thống", e });
  }
};

export const getConversationForSocketIo = async (userId) => {
  try {
    const conversations = await Conversation.find(
      {
        "participants.userId": userId,
      },
      { _id: 1 }
    );
    return conversations.map((c) => c._id.toString());
  } catch (e) {
    console.error("Loi khi fetch convo", e);
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;
    const conversation = await Conversation.findById(conversationId).lean();
    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, message: "Cuộc trò chuyện không tồn tại" });
    }
    const last = conversation.lastMessage;
    if (!last) {
      return res
        .status(400)
        .json({ success: false, message: "Cuộc trò chuyện không có tin nhắn" });
    }
    if (last.senderId.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Không thể đánh dấu tin nhắn của chính mình là đã xem",
      });
    }

    const updated = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $addToSet: { seenBy: userId },
        $set: { [`unreadCounts.${userId.toString()}`]: 0 },
      },
      { new: true }
    );
    io.to(conversationId).emit("read-message", {
      conversation: updated,
      lastMessage: {
        _id: updated?.lastMessage._id,
        content: updated?.lastMessage.content,
        senderId: updated?.lastMessage.senderId,
        createdAt: updated?.lastMessage.createdAt,
      },
    });

    return res.status(200).json({
      success: true,
      conversation: updated,
      message: "Đã đánh dấu tin nhắn là đã xem",
      unreadCounts: updated.unreadCounts[userId] || 0,
    });
  } catch (e) {
    console.log("Lỗi khi đánh dấu tin nhắn là đã xem", e);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};
