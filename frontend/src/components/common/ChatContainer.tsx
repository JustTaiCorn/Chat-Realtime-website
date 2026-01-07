import {useChatStore} from "../../zustands/userStore.ts";
import ChatHeader from "./ChatHeader.tsx";
import {useRef} from "react";
import MessageInput from "./MessageInput.tsx";

export default function ChatContainer() {
  const{messages, getMessages,isMessagesLoading,selectedUser} = useChatStore();
  const messageEndRef = useRef(null);
  return <div className='flex flex-1 overflow-auto flex-col'>
    <ChatHeader/>
    <div
    className="flex flex-1 overflow-y-auto space-y-4 p-4">

    </div>
    <MessageInput/>
  </div>;
}
