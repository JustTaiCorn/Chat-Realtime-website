import { useChatStore } from "../../zustands/useChatStore.ts";
import MessageItem from "./MessageItem.tsx";
import NoChat from "./Nochat.tsx";

export const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
  } = useChatStore();

  const messages = allMessages[activeConversationId || ""]?.messages || [];
  const selectedConversation =
    conversations.find((c) => c._id === activeConversationId) || null;
  if (!selectedConversation) {
    return <NoChat />;
  }
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Chưa có tin nhắn nào cả</p>
      </div>
    );
  }
  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden beautiful-scrollbar">
      <div className="flex flex-col overflow-x-hidden overflow-y-auto ">
        {messages.map((message, index) => (
          <MessageItem
            key={index}
            message={message}
            index={index}
            messages={messages}
            selectedConversation={selectedConversation}
            lastMessageStatus="seen"
          />
        ))}
      </div>
    </div>
  );
};
