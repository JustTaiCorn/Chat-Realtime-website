import ChatHeader from "../chat/ChatHeader.tsx";
import { ChatWindowBody } from "../chat/ChatWindowBody.tsx";
import MessageInput from "../chat/MessageInput.tsx";
import { useChatStore } from "../../zustands/useChatStore.ts";
import {useEffect} from "react";

export default function ChatContainer() {
  const { activeConversationId, conversations,markAsSeen } = useChatStore();
  const selectedConversation = conversations.find(
    (c) => c._id === activeConversationId
  );
    useEffect((
    ) => {
        if(!selectedConversation) return;
        const markSeen = async () => {
            try {
                markAsSeen();
            }catch (e) {
                console.error("Failed to mark messages as seen", e);
            }
        }
        markSeen();
    }, [markAsSeen, selectedConversation]);
  return (
    <div className="flex flex-1 overflow-auto flex-col">
      <ChatHeader chat={selectedConversation}/>
      <div className="flex flex-1 overflow-y-auto space-y-4 p-4">
        <ChatWindowBody />
      </div>
      {selectedConversation && (
        <MessageInput selectedConversation={selectedConversation} />
      )}
    </div>
  );
}
