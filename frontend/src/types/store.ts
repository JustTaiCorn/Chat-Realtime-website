import type { User } from "@/zustands/useAuthStore.ts";
import type { Conversation, Message } from "./chat.ts";
import type { Socket } from "socket.io-client";
import type { FriendRequest, UserInfo } from "./friend.ts";

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
  updateConversation: (conversation: unknown) => void;
  markAsSeen: () => void;
  addConversation: (conversation: Conversation) => void;
  createConversation: (
    type: "direct" | "group",
    memberIds: string[],
    name: string
  ) => Promise<void>;
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}
export interface FriendState {
  friends: UserInfo[];
  loading: boolean;
  receivedList: FriendRequest[];
  sentList: FriendRequest[];
  searchUser: (query: string) => Promise<User[] | null>;
  sendFriendRequest: (to: string, message?: string) => Promise<void>;
  acceptFriendRequest: (requestID: string) => Promise<void>;
  rejectFriendRequest: (requestID: string) => Promise<void>;
  getAllFriendRequest: () => Promise<void>;
  getFriends: () => Promise<void>;
}
