import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore.ts";
import type { SocketState } from "@/types/store.ts";
import { useChatStore } from "@/zustands/useChatStore.ts";

const baseURl = import.meta.env.VITE_SOCKET_URL;
export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const token = useAuthStore.getState().accessToken;
    const exsitingSocket = get().socket;
    if (exsitingSocket) {
      return;
    }
    const newSocket: Socket = io(baseURl, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ["websocket"],
    });
    set({ socket: newSocket });
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });
    newSocket.on("onlineUsers", (users) => {
      set({ onlineUsers: users });
    });
    newSocket.on("new-message", ({ message, conversation, unreadCounts }) => {
      useChatStore.getState().addMessageToConversation(message);
      const lastMessage = {
        _id: conversation.lastMessage._id,
        content: conversation.lastMessage.content,
        createdAt: conversation.lastMessage.createdAt,
        sender: {
          _id: conversation.lastMessage.senderId,
          displayName: "",
          avatarUrl: null,
        },
      };
      const updatedConversation = {
        ...conversation,
        lastMessage,
        unreadCounts,
      };
      if (
        useChatStore.getState().activeConversationId === message.conversationId
      ) {
        useChatStore.getState().markAsSeen();
      }
      useChatStore.getState().updateConversation(updatedConversation);
    });

    newSocket.on("read-message", ({ conversation, lastMessage }) => {
      const updated = {
        _id: conversation._id,
        ...conversation,
        lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCounts: conversation.unreadCounts,
        seenBy: conversation.seenBy,
      };

      useChatStore.getState().updateConversation(updated);
    });
    newSocket.on("new-group", (conversation) => {
        useChatStore.getState().addConversation(conversation);
        newSocket.emit("join-conversation", conversation._id);
    });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
      console.log("Socket disconnected");
    }
  },
}));
