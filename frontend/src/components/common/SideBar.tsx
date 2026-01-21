import { MessageSquarePlus, Users, UserPlus } from "lucide-react";
import { GroupChatList } from "../chat/GroupChatList.tsx";
import { DirectMessageList } from "../chat/DirectMessageList.tsx";
import { useState } from "react";
import { AddFriendModal } from "@/components/chat/AddFriendModal.tsx";
import FriendListModal from "@/components/createNewChat/FriendListModal.tsx";
import { NewGroupChatModal } from "../createNewChat/NewGroupChatModal.tsx";
import { useChatStore } from "@/zustands/useChatStore.ts";
import { ConversationSkeleton } from "../skeleton/Conversationskeleton.tsx";

export default function SideBar() {
  const { ConversationLoading } = useChatStore();
  const [activeModal, setActiveModal] = useState<
    null | "addFriend" | "friendList" | "newGroup"
  >(null);

  return (
    <div className="h-[calc(100vh-6rem)] lg:w-80 w-20 flex flex-col bg-base-200 ml-4 mr-2.5 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        <span className="text-lg font-bold hidden lg:block">Tin nhắn</span>
        <button
          className="btn btn-ghost btn-sm btn-circle"
          title="Tạo cuộc trò chuyện mới"
          onClick={() => setActiveModal("friendList")}
        >
          <MessageSquarePlus className="size-5" />
        </button>
      </div>

      {/* Group chat section */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
            Nhóm Chat
          </span>
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => setActiveModal("newGroup")}
            title="Tạo nhóm mới"
          >
            <Users className="size-4" />
          </button>
        </div>
        {ConversationLoading ? <ConversationSkeleton /> : <GroupChatList />}
      </div>
      {/* Friends section */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
            Bạn bè
          </span>
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => setActiveModal("addFriend")}
            title="Thêm bạn"
          >
            <UserPlus className="size-4" />
          </button>
        </div>
        {ConversationLoading ? <ConversationSkeleton /> : <DirectMessageList />}
      </div>

      {/* Modals */}
      <AddFriendModal
        isOpen={activeModal === "addFriend"}
        onClose={() => setActiveModal(null)}
      />
      <FriendListModal
        isOpen={activeModal === "friendList"}
        onClose={() => setActiveModal(null)}
      />
      <NewGroupChatModal
        isOpen={activeModal === "newGroup"}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
