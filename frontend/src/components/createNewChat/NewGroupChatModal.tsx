import { useFriendStore } from "@/zustands/useFriendsStore";
import { Search, UserPlus, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { UserAvatar } from "../chat/UserAvatar";
import { useChatStore } from "@/zustands/useChatStore";
import type { UserInfo } from "@/types/friend";
import { toast } from "react-toastify";

interface NewGroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewGroupChatModal = ({
  isOpen,
  onClose,
}: NewGroupChatModalProps) => {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<UserInfo[]>([]);
  const { createConversation, loading } = useChatStore();
  const { friends, getFriends } = useFriendStore();

  useEffect(() => {
    if (isOpen) {
      getFriends();
    }
  }, [isOpen, getFriends]);

  // Filter friends based on search and exclude already invited
  const filteredFriends = friends.filter(
    (friend) =>
      friend.fullName.toLowerCase().includes(search.toLowerCase()) &&
      !invitedUsers.some((u) => u._id === friend._id)
  );

  const handleSelectFriend = (friend: UserInfo) => {
    setInvitedUsers([...invitedUsers, friend]);
    setSearch("");
  };

  const handleRemoveFriend = (friend: UserInfo) => {
    setInvitedUsers(invitedUsers.filter((u) => u._id !== friend._id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!groupName.trim()) {
        toast.warning("Vui lòng nhập tên nhóm");
        return;
      }
      if (invitedUsers.length === 0) {
        toast.warning("Bạn phải mời ít nhất 1 thành viên vào nhóm");
        return;
      }

      await createConversation(
        "group",
        invitedUsers.map((u) => u._id),
        groupName
      );

      // Reset form
      setGroupName("");
      setSearch("");
      setInvitedUsers([]);
      onClose();
    } catch (error) {
      console.error("Lỗi xảy ra khi tạo nhóm:", error);
    }
  };

  const handleClose = () => {
    setGroupName("");
    setSearch("");
    setInvitedUsers([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open z-[100]">
      <div className="modal-box max-w-xl p-0">
        {/* Header */}
        <div className="px-6 py-5 border-b border-base-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Tạo nhóm chat mới</h3>
              <p className="text-sm text-base-content/60">
                Mời bạn bè vào nhóm
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Group Name Input */}
          <div className="px-6 py-4 border-b border-base-300">
            <label className="text-sm font-semibold text-base-content/80 mb-2 block">
              Tên nhóm
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Nhập tên nhóm..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Search Friends */}
          <div className="px-6 py-4 border-b border-base-300">
            <label className="text-sm font-semibold text-base-content/80 mb-2 block">
              Mời thành viên
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="text"
                className="input input-bordered w-full pl-12"
                placeholder="Tìm theo tên bạn bè..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Selected Users */}
            {invitedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {invitedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="badge badge-primary gap-2 py-3"
                  >
                    {user.fullName}
                    <button
                      type="button"
                      onClick={() => handleRemoveFriend(user)}
                      className="hover:text-error"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Friends List */}
          <div className="px-6 py-4 max-h-60 overflow-y-auto">
            <h4 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-3">
              {search ? "Kết quả tìm kiếm" : "Danh sách bạn bè"}
            </h4>

            <div className="space-y-2">
              {loading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-lg text-primary" />
                </div>
              ) : filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => (
                  <div
                    key={friend._id}
                    onClick={() => handleSelectFriend(friend)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-base-200/50 hover:bg-base-200 cursor-pointer transition-all border border-transparent hover:border-primary/20"
                  >
                    <UserAvatar
                      type="sidebar"
                      name={friend.fullName}
                      profilePicture={friend.profilePicture ?? undefined}
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-sm truncate">
                        {friend.fullName}
                      </h2>
                    </div>
                    <UserPlus className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-base-content/50">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">
                    {search ? "Không tìm thấy bạn bè" : "Chưa có bạn bè"}
                  </p>
                  <p className="text-sm">
                    {search
                      ? "Thử từ khóa khác"
                      : "Thêm bạn để bắt đầu trò chuyện!"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-base-300">
            <button
              type="submit"
              disabled={
                loading || invitedUsers.length === 0 || !groupName.trim()
              }
              className="btn btn-primary w-full"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Tạo nhóm ({invitedUsers.length} thành viên)
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop bg-black/50" onClick={handleClose} />
    </div>
  );
};
