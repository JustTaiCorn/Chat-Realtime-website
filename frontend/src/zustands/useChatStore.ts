import type { ChatState } from "../types/store.ts";
import { persist } from "zustand/middleware";
import { create } from "zustand";
import { chatService } from "../services/chatService.ts";
import { toast } from "react-toastify";
import { useAuthStore } from "./useAuthStore.ts";

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
      fetchMessages: async (conversationId: string, cursor?: string) => {
        set({ MessageLoading: true });
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
        try {
          const { messages, cursor: nextCursor } =
            await chatService.fetchMessages(conversationId, cursor);
          const processed = messages.map((message) => ({
            ...message,
            isOwn: message.senderId === user?._id,
          }));
          set((state) => {
            const pre = state.messages[convoId]?.messages ?? [];
            const merged = pre.length > 0 ? [...pre, ...processed] : processed;
            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  messages: merged,
                  hasMore: !!nextCursor,
                  nextCursor: nextCursor || null,
                },
              },
            };
          });
        } catch (e) {
          console.error("Lỗi xảy ra khi lấy Message", e);
          toast.error("Co loi xay ra");
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
