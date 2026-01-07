import ChatContainer from "../components/common/ChatContainer.tsx";
import NoChat from "../components/common/Nochat.tsx";
import UserList from "../components/common/UserList.tsx";
import { useChatStore } from "../zustands/userStore.ts";

export default function MessagesPage() {
  const { selectedUser } = useChatStore();
  return (
    <div className="h-screen bg-base-200 ">
      <div className="flex pt-20 px-4 ">
        <UserList />
        <div className="bg-base-100 rounded-3xl w-full max-w-6xl  h-[calc(100vh-6rem)]">
          <div className="flex h-full overflow-hidden ">
            {!selectedUser ? <NoChat /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}
