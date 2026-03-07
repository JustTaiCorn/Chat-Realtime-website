import ChatHeader from "../chat/ChatHeader.tsx";
import { ChatWindowBody } from "../chat/ChatWindowBody.tsx";
import MessageInput from "../chat/MessageInput.tsx";
import { useChatStore } from "../../zustands/useChatStore.ts";
import { useEffect } from "react";
import { useGetConversations, useMarkAsSeen } from "@/hooks/useChatQuery";
import type { Conversation } from "@/types/chat";

export default function ChatContainer() {
  const { activeConversationId } = useChatStore();
  const { data: conversations } = useGetConversations();
  const { mutate: markAsSeen } = useMarkAsSeen();

  const selectedConversation =
    conversations?.find((c: Conversation) => c._id === activeConversationId) ||
    undefined;
  useEffect(() => {
    if (!selectedConversation) return;
    const markSeen = () => {
      if (!activeConversationId) return;
      try {
        markAsSeen(activeConversationId);
      } catch (e) {
        console.error("Failed to mark messages as seen", e);
      }
    };
    markSeen();
  }, [markAsSeen, selectedConversation]);
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ChatHeader chat={selectedConversation} />
      <ChatWindowBody />
      {selectedConversation && (
        <MessageInput selectedConversation={selectedConversation} />
      )}
    </div>
  );
}
