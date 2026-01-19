import { useFriendStore } from "@/zustands/useFriendsStore";
import FriendRequestItem from "./FriendRequestItem";
import { Send } from "lucide-react";

const SentRequests = () => {
  const { sentList } = useFriendStore();

  if (!sentList || sentList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-base-content/50">
        <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4">
          <Send className="w-10 h-10 opacity-30" />
        </div>
        <p className="text-lg font-medium mb-1">Chưa gửi lời mời nào</p>
        <p className="text-sm">Bạn chưa gửi lời mời kết bạn cho ai</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sentList.map((req) => (
        <FriendRequestItem
          key={req._id}
          requestInfo={req}
          type="sent"
          actions={<p className="badge badge-warning badge-sm p-2">Đang chờ</p>}
        />
      ))}
    </div>
  );
};

export default SentRequests;
