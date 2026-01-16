import Conversation from "../models/conversation.model.js";
import Friend from "../models/friends.model.js";

const pair = (a, b) => {
  return a < b ? [a, b] : [b, a];
};

export const checkFriend = async (req, res, next) => {
  try {
    const me = req.user._id.toString();
    const recipientId = req.body?.recipientId ?? null;
    const memberIds = req.body?.memberIds ?? [];
    if (!recipientId && (!Array.isArray(memberIds) || memberIds.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy người nhận, cuộc trò chuyện không hợp lệ",
      });
    }
    if (recipientId) {
      const [userA, userB] = pair(me, recipientId);
      const friend = await Friend.findOne({ userA, userB });
      if (!friend) {
        return res.status(403).json({
          success: false,
          message: "Chỉ có thể nhắn tin với bạn bè",
        });
      }
      return next();
    }
    if (memberIds.length > 0) {
      const checkPromises = memberIds.map(async (memberId) => {
        const [userA, userB] = pair(me, memberId);
        const friend = await Friend.findOne({ userA, userB });
        return friend ? null : memberId;
      });

      const results = await Promise.all(checkPromises);
      const notFriends = results.filter(Boolean);

      if (notFriends.length > 0) {
        return res.status(403).json({
          success: false,
          message: "Chỉ có thể nhắn tin với bạn bè",
          notFriends,
        });
      }
      return next();
    }

    next();
  } catch (error) {
    console.log("checkFriend error:", error);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};
export const checkGroupShip = async (req, res, next) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user._id;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, message: "Cuộc trò chuyện không tồn tại" });
    }
    const isMember = conversation.participants.some(
      (participant) => participant.userId.toString() === userId.toString()
    );
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Bạn không phải là thành viên của cuộc trò chuyện này",
      });
    }
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};
