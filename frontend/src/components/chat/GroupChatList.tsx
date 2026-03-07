import { GroupChatCard } from "./GroupChatCard.tsx";
import { useGetConversations } from "@/hooks/useChatQuery";

export const GroupChatList = () => {
  const { data: conversations } = useGetConversations();

  const groupchats = conversations?.filter((c) => c.type === "group") || [];

  if (!groupchats || groupchats.length === 0) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {groupchats.map((conversation) => (
        <GroupChatCard conversation={conversation} key={conversation._id} />
      ))}
    </div>
  );
};
