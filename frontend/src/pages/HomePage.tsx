import ChatContainer from "../components/common/ChatContainer.tsx";
import NoChat from "../components/chat/Nochat.tsx";
import SideBar from "../components/common/SideBar.tsx";
import { useChatStore } from "../zustands/useChatStore.ts";
import ChatWindowSkeleton from "../components/skeleton/ChatWindowSkeleton.tsx";

export default function HomePage() {
  const { activeConversationId, MessageLoading, conversations } =
    useChatStore();
  const selectedConversation =
    conversations.find((c) => c._id === activeConversationId) || null;

  return (
    <div className="h-screen bg-base-200 pt-20">
      <div className="flex">
        <SideBar />
        <div className="bg-base-100 rounded-md w-full max-w-6xl h-[calc(100vh-6rem)] shadow-md">
          <div className="flex h-full overflow-hidden">
            {!selectedConversation ? (
              <NoChat />
            ) : MessageLoading ? (
              <ChatWindowSkeleton />
            ) : (
              <ChatContainer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
