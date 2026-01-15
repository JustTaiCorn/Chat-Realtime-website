import type { Conversation, Message } from "./chat.ts";
import type { Socket } from "socket.io-client";

export interface ChatState {
  conversations: Conversation[];
  messages: Record<
    string,
    {
      messages: Message[];
      hasMore: boolean;
      nextCursor?: string | null;
    }
  >;
  activeConversationId: string | null;
  MessageLoading: boolean;
  ConversationLoading: boolean;
  reset: () => void;
  setActiveConversation: (conversationId: string | null) => void;
  fetchConversations: () => void;
  fetchMessages: (conversationId: string, cursor?: string) => void;
  sendDirectMessage: (
    receiverId: string,
    content: string,
    imageUrl?: string,
    conversationId?: string
  ) => Promise<void>;
  sendGroupMessage: (
    conversationId: string,
    content: string,
    imageUrl?: string
  ) => Promise<void>;
  addMessageToConversation: (message: Message) => Promise<void>;
  updateConversation: (conversation: Conversation) => void;
  markAsSeen: () => void;
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}
