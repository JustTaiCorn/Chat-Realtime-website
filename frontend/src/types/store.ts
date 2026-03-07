import type { User } from "@/zustands/useAuthStore.ts";
import type { Conversation, Message } from "./chat.ts";
import type { Socket } from "socket.io-client";

export interface ChatState {
  conversations: Conversation[];
  messages: Record<
    string,
    {
      items: Message[];
      hasMore: boolean;
      nextCursor?: string | null;
    }
  >;
  activeConversationId: string | null;
  MessageLoading: boolean;
  ConversationLoading: boolean;
  loading: boolean;
  replyToMessage: Message | null;
  reset: () => void;
  setActiveConversation: (conversationId: string | null) => void;
  setReplyToMessage: (message: Message | null) => void;
  fetchConversations: () => void;
  fetchMessages: (conversationId: string, cursor?: string) => void;
  sendDirectMessage: (
    receiverId: string,
    content: string,
    image?: File,
    conversationId?: string,
    replyToMessageId?: string,
  ) => Promise<void>;
  sendGroupMessage: (
    conversationId: string,
    content: string,
    image?: File,
    replyToMessageId?: string,
  ) => Promise<void>;
  addMessageToConversation: (message: Message) => Promise<void>;
  updateConversation: (conversation: unknown) => void;
  markAsSeen: () => void;
  addConversation: (conversation: Conversation) => void;
  createConversation: (
    type: "direct" | "group",
    memberIds: string[],
    name: string,
  ) => Promise<void>;
  handleReaction: (messageId: string, emoji: string) => Promise<void>;
  updateMessageReaction: (
    messageId: string,
    reactions: any[],
    conversationId: string,
  ) => void;
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}
export interface FriendState {
  loading: boolean;
  searchUser: (query: string) => Promise<User[] | null>;
}
