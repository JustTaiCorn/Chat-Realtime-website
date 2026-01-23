export const updateConversationAfterCreateMessage = (
  conversation,
  message,
  senderId
) => {
  conversation.set({
    seenBy: [],
    lastMessageAt: message.createdAt,
    lastMessage: {
      _id: message._id,
      content: message.content,
      senderId,
      imageUrl: message.imageUrl,
      createdAt: message.createdAt,
    },
  });
  conversation.participants.forEach((p) => {
    const memberId = p.userId.toString();
    const isSender = memberId === senderId.toString();
    const preCount = conversation.unreadCounts.get(memberId) || 0;
    conversation.unreadCounts.set(memberId, isSender ? 0 : preCount + 1);
  });
};

export const emitNewMessage = (conversation, message, io) => {
  io.to(conversation._id.toString()).emit("new-message", {
    success: true,
    message,
    conversation: {
      _id: conversation._id,
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
    },
    unreadCounts: Object.fromEntries(conversation.unreadCounts),
  });
};
export const emitNewReaction = ( message, reactions, io) => {
  io.to(message.conversationId.toString()).emit("new-reaction", {
    success: true,
      messageId: message._id,
    reactions,
  });
}