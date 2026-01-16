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
    console.log("Conversations response:", response.data);
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
    imageUrl?: string,
    conversationId?: string
  ): Promise<Message> {
    const response = await privateClient.post("/messages/direct", {
      recipientId: receiverId,
      content,
      imageUrl,
      conversationId,
    });
    return response.data.messages;
  },
  async sendGroupMessage(
    conversationId: string,
    content: string = "",
    imageUrl?: string
  ): Promise<Message> {
    const response = await privateClient.post("/messages/group", {
      conversationId,
      content,
      imageUrl,
    });
    return response.data.messages;
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
};
