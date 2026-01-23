import type { ConversationResponse, Message } from "../types/chat.ts";
import privateClient from "../lib/axios.ts";

interface MessagesPResponse {
  messages: Message[];
  cursor?: string;
}
const LIMIT = 50;
export const chatService = {
  async fetchConversations(): Promise<ConversationResponse> {
    const response = await privateClient.get("/conversations");
    return response.data;
  },
  async fetchMessages(
    conversationId: string,
    cursor?: string
  ): Promise<MessagesPResponse> {
    const response = await privateClient.get(
      `/conversations/${conversationId}/messages?limit=${LIMIT}&cursor=${cursor}`
    );
    return {
      messages: response.data.messages,
      cursor: response.data.nextCursor,
    };
  },
  async sendDirectMessage(
    receiverId: string,
    content: string = "",
    image?: File,
    conversationId?: string,
    replyToMessageId?: string
  ): Promise<Message> {
    const formData = new FormData();
    formData.append("recipientId", receiverId);
    formData.append("content", content);
    if (image) formData.append("image", image);
    if (conversationId) formData.append("conversationId", conversationId);
    if(replyToMessageId) formData.append("replyToMessageId", replyToMessageId);
    const response = await privateClient.post("/messages/direct", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.message;
  },
  async sendGroupMessage(
    conversationId: string,
    content: string = "",
    image?: File,
    replyToMessageId?: string
  ): Promise<Message> {
    const formData = new FormData();
    formData.append("conversationId", conversationId);
    formData.append("content", content);
    if (image) formData.append("image", image);
    if(replyToMessageId) formData.append("replyToMessageId", replyToMessageId);
    const response = await privateClient.post("/messages/group", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.newMessage;
  },
  async markAsSeen(conversationId: string): Promise<void> {
    const res = await privateClient.post(
      `/conversations/${conversationId}/seen`
    );
    return res.data;
  },

  async createConversation(
    type: "direct" | "group",
    memberIds: string[],
    name?: string
  ) {
    const res = await privateClient.post("/conversations", {
      type,
      memberIds,
      name,
    });
    return res.data.conversation;
  },
   async toggleReaction(
    messageId: string,
    emoji: string
  ): Promise<void> {
    const res = await privateClient.post(
      `/messages/${messageId}/reactions`,
      {
        emoji
      }
    );
    return res.data.reactions;
  }
};
