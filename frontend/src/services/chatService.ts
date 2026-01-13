import type {ConversationResponse, Message} from "../types/chat.ts";
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
};
