import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore.ts";
import type { SocketState } from "@/types/store.ts";
import { useChatStore } from "@/zustands/useChatStore.ts";
import { queryClient } from "@/lib/queryClient.ts";
import type { Conversation, Message } from "@/types/chat.ts";

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
      const activeConversationId = useChatStore.getState().activeConversationId;

      // Update message history cache
      queryClient.setQueryData(
        ["messages", message.conversationId],
        (oldData: any) => {
          if (!oldData) return oldData;
          const newPages = [...oldData.pages];

          // Check if message already exists in the last page to prevent duplicates
          const lastPageIdx = newPages.length - 1;
          const messageExists = newPages[lastPageIdx].messages.some(
            (msg: Message) => msg._id === message._id,
          );

          if (!messageExists) {
            const authUser = useAuthStore.getState().authUser;
            message.isOwn = message.senderId === authUser?._id;
            newPages[lastPageIdx] = {
              ...newPages[lastPageIdx],
              messages: [...newPages[lastPageIdx].messages, message],
            };
          }
          return { ...oldData, pages: newPages };
        },
      );

      // Update conversations cache
      queryClient.setQueryData(
        ["conversations"],
        (oldConversations: Conversation[] | undefined) => {
          if (!oldConversations) return oldConversations;

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

          return oldConversations.map((c) =>
            c._id === conversation._id
              ? {
                  ...c,
                  lastMessage,
                  unreadCounts:
                    activeConversationId === message.conversationId
                      ? {
                          ...c.unreadCounts,
                          [useAuthStore.getState().authUser?._id || ""]: 0,
                        }
                      : unreadCounts,
                }
              : c,
          );
        },
      );

      // If active, invalidate to trigger seen
      if (activeConversationId === message.conversationId) {
        // Normally we'd call markAsSeen API, let the component handle it or trigger refetch
      }
    });

    newSocket.on("read-message", ({ conversation, lastMessage }) => {
      queryClient.setQueryData(
        ["conversations"],
        (oldConversations: Conversation[] | undefined) => {
          if (!oldConversations) return oldConversations;
          return oldConversations.map((c) =>
            c._id === conversation._id
              ? {
                  ...c,
                  lastMessage,
                  lastMessageAt: conversation.lastMessageAt,
                  unreadCounts: conversation.unreadCounts,
                  seenBy: conversation.seenBy,
                }
              : c,
          );
        },
      );
    });

    newSocket.on("new-group", (conversation) => {
      queryClient.setQueryData(
        ["conversations"],
        (oldConversations: Conversation[] | undefined) => {
          if (!oldConversations) return [conversation];
          const exists = oldConversations.some(
            (c) => c._id === conversation._id,
          );
          if (exists) return oldConversations;
          return [conversation, ...oldConversations];
        },
      );
      newSocket.emit("join-conversation", conversation._id);
    });

    newSocket.on("new-reaction", ({ messageId, conversationId, reactions }) => {
      queryClient.setQueryData(["messages", conversationId], (oldData: any) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          messages: page.messages.map((msg: Message) =>
            msg._id === messageId ? { ...msg, reactions } : msg,
          ),
        }));
        return { ...oldData, pages: newPages };
      });
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
