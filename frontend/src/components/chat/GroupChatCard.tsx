import type { Conversation } from "../../types/chat.ts";
import { useAuthStore } from "../../zustands/useAuthStore.ts";
import { useChatStore } from "../../zustands/useChatStore.ts";
import ChatCard from "./CharCard.tsx";
import GroupChatAvatar from "./GroupChatAvatar.tsx";
import { UnreadCountBadge } from "./UnreadCountBadge.tsx";

export const GroupChatCard = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  const { authUser } = useAuthStore();
  const {
    activeConversationId,
    setActiveConversation,
    messages,
    fetchMessages,
  } = useChatStore();
  if (!authUser) {
    return null;
  }
  const unreadCount = conversation.unreadCounts?.[authUser._id] || 0;
  const name = conversation.group?.name || "Unnamed Group";
  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await fetchMessages(id);
    }
  };
  return (
    <div>
      <ChatCard
        convoId={conversation._id}
        name={name}
        unreadCount={unreadCount}
        timestamp={
          conversation.lastMessage?.createdAt
            ? new Date(conversation.lastMessage?.createdAt)
            : undefined
        }
        isActive={activeConversationId === conversation._id}
        onSelect={handleSelectConversation}
        subtitle={
          <p className="text-sm truncate text-mute-foreground ">
            {conversation.participants.length} thành viên
          </p>
        }
        leftSection={
          <>
            <GroupChatAvatar
              participants={conversation.participants}
              type="sidebar"
            />
            {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
          </>
        }
      />
    </div>
  );
};
