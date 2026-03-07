import ChatContainer from "../components/common/ChatContainer.tsx";
import NoChat from "../components/chat/Nochat.tsx";
import SideBar from "../components/common/SideBar.tsx";
import { useChatStore } from "../zustands/useChatStore.ts";
import { useGetConversations } from "@/hooks/useChatQuery";
import type { Conversation } from "@/types/chat";

export default function HomePage() {
  const { activeConversationId } = useChatStore();
  const { data: conversations } = useGetConversations();

  const selectedConversation =
    conversations?.find((c: Conversation) => c._id === activeConversationId) ||
    null;

  return (
    <div className="h-screen bg-base-200 pt-0 md:pt-20">
      <div className="flex h-full md:h-auto">
        <div
          className={`${
            activeConversationId ? "hidden" : "flex"
          } md:flex flex-col w-full md:w-auto`}
        >
          <SideBar />
        </div>

        <div
          className={`${
            activeConversationId ? "flex" : "hidden"
          } md:flex bg-base-100 rounded-none md:rounded-md w-full md:mx-4 h-screen md:h-[calc(100vh-6rem)] md:shadow-md flex-col`}
        >
          <div className="flex h-full overflow-hidden">
            {!selectedConversation ? <NoChat /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}
