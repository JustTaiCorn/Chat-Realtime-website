import type { User } from "@/zustands/useAuthStore.ts";
import type { Conversation, Message } from "./chat.ts";
import type { Socket } from "socket.io-client";

export interface ChatState {
  activeConversationId: string | null;
  replyToMessage: Message | null;
  reset: () => void;
  setActiveConversation: (conversationId: string | null) => void;
  setReplyToMessage: (message: Message | null) => void;
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
