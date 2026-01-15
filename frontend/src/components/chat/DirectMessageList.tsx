import { useChatStore } from "../../zustands/useChatStore.ts";
import { DirectMessageCard } from "./DirectMessageCard.tsx";

export const DirectMessageList = () => {
  const { conversations } = useChatStore();
  if (!conversations) {
    return null;
  }
  const directConversations = conversations.filter(
    (conversation) => conversation.type === "direct"
  );
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {directConversations.map((conversation) => (
        <DirectMessageCard conversation={conversation} key={conversation._id} />
      ))}
    </div>
  );
};
