import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import {
  emitNewMessage,
  updateConversationAfterCreateMessage,
} from "../utils/MessageHelper.js";
import { io } from "../socket/server.js";

// export const getUsersForChat = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;
//     const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
//       "-password"
//     );
//     res.status(200).json({
//       success: true,
//       users,
//     });
//   } catch (error) {
//     console.log("Error in getUsersForChat controller:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
//
// export const getMessages = async (req, res) => {
//   try {
//     const { id: userToChatWith } = req.params;
//     const myId = req.user._id;
//
//     const messages = await Message.find({
//       $or: [
//         { sender: myId, receiver: userToChatWith },
//         { sender: userToChatWith, receiver: myId },
//       ],
//     });
//     res.status(200).json({ success: true, messages });
//   } catch (error) {
//     console.log("Error in getMessages controller:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user._id;
    let conversation;
    if (!content) {
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
    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
      receiver: recipientId,
    });
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
    const { conversationId, content } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;
    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Không có nội dung để gửi" });
    }
    //
    // // Upload image nếu có
    // if (imageFile) {
    //     const imageId = ID.unique();
    //     const uploadedImage = await storage.createFile(
    //         process.env.APPWRITE_BUCKET_ID,
    //         imageId,
    //         imageFile.buffer,
    //         imageFile.originalname
    //     );
    //     imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${uploadedImage.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
    // }
    //
    // // Upload file nếu có
    // if (attachmentFile) {
    //     const fileId = ID.unique();
    //     const uploadedFile = await storage.createFile(
    //         process.env.APPWRITE_BUCKET_ID,
    //         fileId,
    //         attachmentFile.buffer,
    //         attachmentFile.originalname
    //     );
    //     const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
    //
    //     fileData = {
    //         url: fileUrl,
    //         name: uploadedFile.name,
    //         type: uploadedFile.mimeType,
    //         size: uploadedFile.sizeOriginal,
    //     };
    // }
    //
    // // Tạo message mới
    const newMessage = new Message({
      conversationId,
      content: content || "",
      senderId,
    });
    await newMessage.save();
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

export default {
  sendGroupMessage,
  sendDirectMessage,
};
