import ChatHeader from "../chat/ChatHeader.tsx";
import { ChatWindowBody } from "../chat/ChatWindowBody.tsx";
import MessageInput from "../chat/MessageInput.tsx";

export default function ChatContainer() {
  return (
    <div className="flex flex-1 overflow-auto flex-col">
      <ChatHeader />
      <div className="flex flex-1 overflow-y-auto space-y-4 p-4">
        <ChatWindowBody />
      </div>
      <MessageInput />
    </div>
  );
}
