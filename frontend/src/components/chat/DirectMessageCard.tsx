import type { Conversation } from "../../types/chat.ts";
import ChatCard from "./CharCard.tsx";
import { useAuthStore } from "../../zustands/useAuthStore.ts";
import { useChatStore } from "../../zustands/useChatStore.ts";
import { cn } from "../../lib/utils.ts";
import { UserAvatar } from "./UserAvatar.tsx";
import { UnreadCountBadge } from "./UnreadCountBadge.tsx";
import { useSocketStore } from "@/zustands/useSocketStore.ts";
export const DirectMessageCard = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  const { authUser } = useAuthStore();
  const { onlineUsers } = useSocketStore();
  const {
    activeConversationId,
    setActiveConversation,
    messages,
    fetchMessages,
  } = useChatStore();
  if (!authUser) {
    return null;
  }
  const otherParticipant = conversation.participants.find(
    (participant) => participant._id !== authUser._id
  );
  if (!otherParticipant) {
    return null;
  }
  const unreadCount = conversation.unreadCounts[authUser._id] || 0;
  const lastMessage = conversation.lastMessage?.content ?? "No messages yet";
  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      fetchMessages(id);
    }
  };
  return (
    <div>
      <ChatCard
        isActive={activeConversationId === conversation._id}
        leftSection={
          <>
            <UserAvatar
              type="sidebar"
              name={otherParticipant.fullName ?? ""}
              profilePicture={otherParticipant.profilePicture ?? undefined}
              status={
                onlineUsers.includes(otherParticipant._id)
                  ? "online"
                  : "offline"
              }
            />
            {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
          </>
        }
        subtitle={
          <p
            className={cn(
              "text-sm truncate",
              unreadCount > 0
                ? "font-medium text-foreground"
                : "text-mute-foreground"
            )}
          >
            {lastMessage}
          </p>
        }
        unreadCount={unreadCount}
        convoId={conversation._id}
        onSelect={handleSelectConversation}
        timestamp={
          conversation.lastMessage?.createdAt
            ? new Date(conversation.lastMessage?.createdAt)
            : undefined
        }
        name={otherParticipant.fullName ?? ""}
      />{" "}
    </div>
  );
};
