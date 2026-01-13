import { MessageSquarePlus, Users, UserPlus } from "lucide-react";
import { GroupChatList } from "../chat/GroupChatList.tsx";
import { DirectMessageList } from "../chat/DirectMessageList.tsx";
import { useState } from "react";

export default function SideBar() {
  const [isNewGroupModalOpen, setNewGroupModalOpen] = useState(false);
  const [isAddFriendModalOpen, setAddFriendModalOpen] = useState(false);

  return (
    <div className="h-[calc(100vh-6rem)] lg:w-80 w-20 flex flex-col bg-base-200 ml-4 mr-2.5 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        <span className="text-lg font-bold hidden lg:block">Tin nhắn</span>
        <button
          className="btn btn-ghost btn-sm btn-circle"
          title="Tạo cuộc trò chuyện mới"
        >
          <MessageSquarePlus className="size-5" />
        </button>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
            Nhóm Chat
          </span>
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => setNewGroupModalOpen(true)}
            title="Tạo nhóm mới"
          >
            <Users className="size-4" />
            <span className="hidden lg:inline">NewGroupChat</span>
          </button>
        </div>
        <GroupChatList />
      </div>

      <div className="divider my-0 px-4"></div>

      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
            Bạn bè
          </span>
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => setAddFriendModalOpen(true)}
            title="Thêm bạn"
          >
            <UserPlus className="size-4" />
            <span className="hidden lg:inline">AddFriendModal</span>
          </button>
        </div>
        <DirectMessageList />
      </div>
    </div>
  );
}
