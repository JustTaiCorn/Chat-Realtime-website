import type { ChatState } from "../types/store.ts";
import { persist } from "zustand/middleware";
import { create } from "zustand";
import type { Message } from "@/types/chat.ts";

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      activeConversationId: null,
      replyToMessage: null,

      setActiveConversation: (conversationId: string | null) =>
        set({ activeConversationId: conversationId, replyToMessage: null }),

      setReplyToMessage: (message: Message | null) =>
        set({ replyToMessage: message }),

      reset: () => {
        set({
          activeConversationId: null,
          replyToMessage: null,
        });
      },
    }),
    {
      name: "chat-ui-storage",
      partialize: (state) => ({
        activeConversationId: state.activeConversationId, // persist only active chat
      }),
    },
  ),
);
