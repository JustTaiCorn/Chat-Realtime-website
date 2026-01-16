import { useFriendStore } from "@/zustands/useFriendsStore";
import FriendRequestItem from "./FriendRequestItem";
import { UserCheck, UserX, Users } from "lucide-react";
import { useState } from "react";

const ReceivedRequests = () => {
  const { receivedList, acceptFriendRequest, rejectFriendRequest, loading } =
    useFriendStore();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAccept = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      await acceptFriendRequest(requestId);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      await rejectFriendRequest(requestId);
    } finally {
      setProcessingId(null);
    }
  };

  if (!receivedList || receivedList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-base-content/50">
        <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4">
          <Users className="w-10 h-10 opacity-30" />
        </div>
        <p className="text-lg font-medium mb-1">Không có lời mời nào</p>
        <p className="text-sm">Bạn chưa nhận được lời mời kết bạn</p>
      </div>
    );
  }

  return (
    <div className="tab-content space-y-3">
      {receivedList.map((req) => (
        <FriendRequestItem
          key={req._id}
          requestInfo={req}
          type="received"
          actions={
            <div className="flex gap-2">
              <button
                className="btn btn-success btn-sm gap-2"
                onClick={() => handleAccept(req._id)}
                disabled={loading || processingId === req._id}
              >
                {processingId === req._id ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Chấp nhận</span>
                  </>
                )}
              </button>
              <button
                className="btn btn-error btn-sm gap-2"
                onClick={() => handleDecline(req._id)}
                disabled={loading || processingId === req._id}
              >
                {processingId === req._id ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <>
                    <UserX className="w-4 h-4" />
                    <span className="hidden sm:inline">Từ chối</span>
                  </>
                )}
              </button>
            </div>
          }
        />
      ))}
    </div>
  );
};

export default ReceivedRequests;
