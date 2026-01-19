import type { ChatState } from "../types/store.ts";
import { persist } from "zustand/middleware";
import { create } from "zustand";
import { chatService } from "../services/chatService.ts";
import { toast } from "react-toastify";
import { useAuthStore } from "./useAuthStore.ts";
import type { Conversation, Message } from "@/types/chat.ts";
import { useSocketStore } from "./useSocketStore.ts";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      ConversationLoading: false,
      MessageLoading: false,

      setActiveConversation: (conversationId: string | null) =>
        set({ activeConversationId: conversationId }),
      fetchConversations: async () => {
        try {
          set({ ConversationLoading: true });
          const { conversations } = await chatService.fetchConversations();
          set({ conversations });
        } catch (e) {
          console.error(e);
          toast.error("Co loi xay ra ");
        } finally {
          set({ ConversationLoading: false });
        }
      },
      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          ConversationLoading: false,
          MessageLoading: false,
        });
      },
      fetchMessages: async (conversationId: string) => {
        const { activeConversationId, messages } = get();
        const user = useAuthStore.getState().authUser;
        const convoId = activeConversationId || conversationId;
        if (!convoId) {
          return null;
        }
        const current = messages?.[convoId];
        const nextCursor =
          current?.nextCursor === undefined ? "" : current?.nextCursor;
        if (nextCursor === null) {
          return;
        }
        set({ MessageLoading: true });
        try {
          const { messages, cursor } = await chatService.fetchMessages(
            convoId,
            nextCursor
          );
          const processed = messages.map((message) => ({
            ...message,
            isOwn: message.senderId === user?._id,
          }));
          set((state) => {
            const pre = state.messages[convoId]?.items ?? [];
            const merged = pre.length > 0 ? [...pre, ...processed] : processed;

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: merged,
                  hasMore: !!cursor,
                  nextCursor: cursor || null,
                },
              },
            };
          });
        } catch (e: unknown) {
          console.error("Lỗi xảy ra khi lấy Message", e);
          toast.error("Co loi xay ra,");
        } finally {
          set({ MessageLoading: false });
        }
      },
      sendDirectMessage: async (
        receiverId: string,
        content: string,
        imageUrl?: string
      ) => {
        try {
          const { activeConversationId } = get();
          await chatService.sendDirectMessage(
            receiverId,
            content,
            imageUrl,
            activeConversationId || ""
          );
          set((state) => ({
            conversations: state.conversations.map((conversation) => {
              return conversation._id === activeConversationId
                ? {
                    ...conversation,
                    seenBy: [],
                  }
                : conversation;
            }),
          }));
        } catch (error) {
          console.error("Lỗi khi gửi tin nhắn:", error);
          toast.error("Không thể gửi tin nhắn");
          throw error;
        }
      },
      sendGroupMessage: async (
        conversationId: string,
        content: string,
        imageUrl
      ) => {
        try {
          await chatService.sendGroupMessage(conversationId, content, imageUrl);
          set((state) => ({
            conversations: state.conversations.map((conversation) => {
              return conversation._id === get().activeConversationId
                ? {
                    ...conversation,
                    seenBy: [],
                  }
                : conversation;
            }),
          }));
        } catch (error) {
          console.error("Lỗi khi gửi tin nhắn nhóm:", error);
          toast.error("Không thể gửi tin nhắn nhóm");
          throw error;
        }
      },

      addMessageToConversation: async (message: Message) => {
        try {
          const { authUser } = useAuthStore.getState();
          const fetchMessages = get().fetchMessages;
          message.isOwn = message.senderId === authUser?._id;
          const convoId = message.conversationId;
          let preMessages = get().messages[convoId].items || [];
          if (preMessages.length === 0) {
            fetchMessages(message.conversationId);
            preMessages = get().messages[convoId].items || [];
          }

          set((state) => {
            if (preMessages.some((msg) => msg._id === message._id)) {
              return state;
            }
            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: [...preMessages, message],
                  hasMore: state.messages[convoId]?.hasMore,
                  nextCursor: state.messages[convoId]?.nextCursor,
                },
              },
            };
          });
        } catch (error) {
          console.error("Lỗi khi thêm tin nhắn vào cuộc trò chuyện:", error);
          toast.error("Không thể thêm tin nhắn vào cuộc trò chuyện");
          throw error;
        }
      },
      addConversation: (conversation: Conversation) => {
        set((state) => {
          const exists = state.conversations.find(
            (c) => c._id === conversation._id
          );
          return {
            conversations: exists
              ? state.conversations
              : [conversation, ...state.conversations],
            activeConversationId: conversation._id,
          };
        });
      },
      createConversation: async (type, memberIds, name) => {
        try {
          const conversation = await chatService.createConversation(
            type,
            memberIds,
            name
          );
          get().addConversation(conversation);
          useSocketStore
            .getState()
            .socket?.emit("join-conversation", conversation._id);
        } catch (error) {
          console.error("Lỗi khi tạo cuộc trò chuyện:", error);
          toast.error("Không thể tạo cuộc trò chuyện");
          throw error;
        }
      },
      updateConversation: (conversation) => {
       
          set((state) => ({
          conversations: state.conversations.map((conv) =>
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              conv._id === conversation._id ? { ...conv, ...conversation } : conv
          ),
        }));
      },

      markAsSeen: async () => {
        try {
          const { authUser } = useAuthStore.getState();
          const { activeConversationId, conversations } = get();
          if (!authUser || !activeConversationId) return;
          const convo = conversations.find(
            (c) => c._id === activeConversationId
          );

          if (!convo) return;

          if ((convo.unreadCounts[authUser._id] ?? 0) === 0) return;

          await chatService.markAsSeen(activeConversationId);
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId && c.lastMessage
                ? {
                    ...c,
                    unreadCounts: {
                      ...c.unreadCounts,
                      [authUser._id]: 0,
                    },
                  }
                : c
            ),
          }));
        } catch (e) {
          console.error("Lỗi khi đánh dấu đã xem tin nhắn:", e);
        }
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        conversations: state.conversations,
      }),
    }
  )
);
