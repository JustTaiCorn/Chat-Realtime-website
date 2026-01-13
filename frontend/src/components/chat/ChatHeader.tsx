import { X } from "lucide-react";
import type { Conversation, Participant } from "../../types/chat.ts";
import { useChatStore } from "../../zustands/useChatStore.ts";
import { useAuthStore } from "../../zustands/useAuthStore.ts";
import { UserAvatar } from "./UserAvatar.tsx";
import GroupChatAvatar from "./GroupChatAvatar.tsx";

interface ChatHeaderProps {
  chat?: Conversation;
}
const ChatHeader = ({ chat }: ChatHeaderProps) => {
  const { authUser } = useAuthStore();
  const { conversations, activeConversationId, setActiveConversation } =
    useChatStore();
  const currentChat =
    chat ?? conversations.find((c) => c._id === activeConversationId);
  if (!currentChat) {
    return null;
  }
  let otherParticipant: Participant | null = null;
  if (currentChat.type === "direct") {
    const otherParticipants = currentChat.participants.filter(
      (p) => p._id !== authUser?._id
    );
    otherParticipant =
      otherParticipants.length > 0 ? otherParticipants[0] : null;

    if (!otherParticipant) {
      return null;
    }
  }

  return (
    <header className=" border-b border-base-300 sticky top-0 px-4 py-2 bg-base-100 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {chat?.type === "direct" ? (
            <UserAvatar
              type={"sidebar"}
              name={otherParticipant?.fullName}
              profilePicture={otherParticipant?.profilePicture || undefined}
              status="online"
            />
          ) : (
            <GroupChatAvatar
              participants={currentChat.participants}
              type="sidebar"
            />
          )}
          {/* User info */}
          <div>
            <h3 className="font-semibold text-primary-content">
              {chat?.type === "direct"
                ? otherParticipant?.fullName
                : currentChat.group.name}
            </h3>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setActiveConversation(null)}>    
          <X />
        </button>
      </div>
    </header>
  );
};
export default ChatHeader;
