import { useFriendStore } from "@/zustands/useFriendsStore";
import { MessageCircleMore, Users, X } from "lucide-react";
import { UserAvatar } from "@/components/chat/UserAvatar";
import { useChatStore } from "@/zustands/useChatStore";
import { useEffect } from "react";

interface FriendListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FriendListModal = ({ isOpen, onClose }: FriendListModalProps) => {
  const { friends, getFriends, loading } = useFriendStore();
  const { createConversation } = useChatStore();

  useEffect(() => {
    if (isOpen) {
      getFriends();
    }
  }, [isOpen, getFriends]);

  const handleCreateConversation = async (friendId: string) => {
    await createConversation("direct", [friendId], "");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open z-[100]">
      <div className="modal-box max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircleMore className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Bắt đầu hội thoại mới</h3>
              <p className="text-sm text-base-content/60">
                Chọn bạn bè để nhắn tin
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Friends List */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-3">
            Danh sách bạn bè
          </h4>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg text-primary" />
              </div>
            ) : friends && friends.length > 0 ? (
              friends.map((f) => (
                <div
                  key={f?._id}
                  onClick={() => handleCreateConversation(f?._id)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-base-200/50hover:bg-base-200 cursor-pointer transition-all border border-transparent hover:border-primary/20 group"
                >
                  <UserAvatar type="sidebar" name={f?.fullName} />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-sm truncate">
                      {f?.fullName}
                    </h2>
                  </div>
                  <div className="">
                    <MessageCircleMore className="w-5 h-5 mr-5 text-primary" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-base-content/50">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Chưa có bạn bè</p>
                <p className="text-sm">Thêm bạn để bắt đầu trò chuyện!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop bg-black/50" onClick={onClose} />
    </div>
  );
};

export default FriendListModal;
