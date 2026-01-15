export const updateConversationAfterCreateMessage = (conversation, message, senderId) => {

    conversation.set({
        seenBy:[],
        lastMessageAt:message.createdAt,
        lastMessage:{
            _id: message._id,
            content: message.content,
            senderId,
            createdAt: message.createdAt,
        }
    });
    conversation.participants.forEach( (p)=> {
        const memberId = p.userId.toString();
        const isSender = memberId === senderId.toString();
        const preCount = conversation.unreadCounts.get(memberId) || 0;
        conversation.unreadCounts.set(memberId,isSender? 0 : preCount + 1);
    })
}

export const emitNewMessage = (conversation, message, io) => {
    io.to(conversation._id.toString()).emit("newMessage", {
        success: true,
        message,
        conversationId: {
            _id: conversation._id,
            lastMessage: conversation.lastMessage,
            lastMessageAt: conversation.lastMessageAt,

        },
        unreadCounts: conversation.unreadCounts,
    });
}