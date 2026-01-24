import { Search, X, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import type { Conversation, Participant } from "../../types/chat.ts";
import { useChatStore } from "../../zustands/useChatStore.ts";
import { useAuthStore } from "../../zustands/useAuthStore.ts";
import { UserAvatar } from "./UserAvatar.tsx";
import GroupChatAvatar from "./GroupChatAvatar.tsx";
import { useSocketStore } from "@/zustands/useSocketStore.ts";
import { useSearchStore } from "@/zustands/useSearchStore.ts";
import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils.ts";

interface ChatHeaderProps {
  chat?: Conversation;
}

const ChatHeader = ({ chat }: ChatHeaderProps) => {
  const { authUser } = useAuthStore();
  const { onlineUsers } = useSocketStore();
  const { conversations, activeConversationId, setActiveConversation } =
    useChatStore();
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    currentSearchIndex,
    isSearching,
    searchMessages,
    nextResult,
    prevResult,
  } = useSearchStore();

  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const currentChat =
    chat ?? conversations.find((c) => c._id === activeConversationId);

  useEffect(() => {
    if (!activeConversationId || !isSearchOpen) return;

    if (debouncedQuery.trim()) {
      searchMessages(activeConversationId, debouncedQuery);
    }
  }, [debouncedQuery, activeConversationId, isSearchOpen, searchMessages]);

  if (!currentChat) {
    return null;
  }

  let otherParticipant: Participant | null = null;
  if (currentChat.type === "direct") {
    const otherParticipants = currentChat.participants.filter(
      (p) => p._id !== authUser?._id,
    );
    otherParticipant =
      otherParticipants.length > 0 ? otherParticipants[0] : null;

    if (!otherParticipant) {
      return null;
    }
  }

  return (
    <header className="border-b border-base-300 sticky top-0 bg-base-100 z-10">
      {/* Header chính - luôn hiển thị */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {currentChat.type === "direct" ? (
            <UserAvatar
              type={"sidebar"}
              name={otherParticipant?.fullName}
              profilePicture={otherParticipant?.profilePicture || undefined}
              status={
                onlineUsers.includes(otherParticipant?._id || "")
                  ? "online"
                  : "offline"
              }
            />
          ) : (
            <GroupChatAvatar
              participants={currentChat.participants}
              type="sidebar"
            />
          )}
          {/* User info */}
          <div>
            <h3 className="font-semibold text-primary">
              {currentChat.type === "direct"
                ? otherParticipant?.fullName
                : currentChat.group?.name || "Unnamed Group"}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={cn(
              "btn btn-ghost btn-circle",
              isSearchOpen && "btn-active",
            )}
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => setActiveConversation(null)}
            className="btn btn-ghost btn-circle"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      {isSearchOpen && (
        <div className="flex items-center justify-between p-4 border-t gap-2 border-base-300/50">
          <div className="relative flex-1 ">
            <input
              autoFocus
              type="text"
              placeholder="Tìm kiếm tin nhắn..."
              className="input input-sm input-bordered w-full pr-28 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") nextResult();
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {isSearching ? (
                <Loader2 size={16} className="animate-spin mr-1" />
              ) : (
                <span className="text-xs text-base-content/50 mr-1">
                  {searchResults.length > 0
                    ? `${currentSearchIndex + 1}/${searchResults.length}`
                    : searchQuery.trim()
                      ? "0/0"
                      : ""}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <button
                disabled={searchResults.length === 0}
                onClick={prevResult}
                className="btn btn-ghost btn-sm p-2 min-h-0"
              >
                <ChevronUp size={16} />
              </button>
              <button
                disabled={searchResults.length === 0}
                onClick={nextResult}
                className="btn btn-ghost btn-sm p-2   min-h-0"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ChatHeader;
