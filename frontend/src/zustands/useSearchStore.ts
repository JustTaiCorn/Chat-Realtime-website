import { create } from "zustand";
import type { Message } from "@/types/chat";
import { chatService } from "@/services/chatService";

interface SearchState {
  isSearchOpen: boolean;
  searchQuery: string;
  searchResults: Message[];
  currentSearchIndex: number;
  isSearching: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
  searchMessages: (conversationId: string, query: string) => Promise<void>;
  nextResult: () => void;
  prevResult: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  isSearchOpen: false,
  searchQuery: "",
  searchResults: [],
  currentSearchIndex: -1,
  isSearching: false,
  setIsSearchOpen: (isOpen) =>
    set({
      isSearchOpen: isOpen,
      ...(isOpen
        ? {}
        : { searchQuery: "", searchResults: [], currentSearchIndex: -1 }),
    }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchMessages: async (conversationId, query) => {
    if (!query.trim()) {
      set({ searchResults: [], currentSearchIndex: -1 });
      return;
    }

    set({ isSearching: true });
    try {
      const messages = await chatService.searchMessages(conversationId, query);
      set({
        searchResults: messages,
        currentSearchIndex: messages.length > 0 ? messages.length - 1 : -1,
        isSearching: false,
      });
    } catch (error) {
      console.error("Error searching messages:", error);
      set({ isSearching: false });
    }
  },

  nextResult: () => {
    const { currentSearchIndex, searchResults } = get();
    if (searchResults.length === 0) return;
    const nextIndex =
      currentSearchIndex >= searchResults.length - 1
        ? 0
        : currentSearchIndex + 1;
    set({ currentSearchIndex: nextIndex });
  },

  prevResult: () => {
    const { currentSearchIndex, searchResults } = get();
    if (searchResults.length === 0) return;
    const prevIndex =
      currentSearchIndex <= 0
        ? searchResults.length - 1
        : currentSearchIndex - 1;
    set({ currentSearchIndex: prevIndex });
  },
}));
