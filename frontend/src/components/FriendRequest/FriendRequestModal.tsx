import { X, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useFriendStore } from "@/zustands/useFriendsStore";
import ReceivedRequests from "./ReceivedRequest";
import SentRequests from "./SentRequest";

export interface FriendRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FriendRequestModal = ({
  isOpen,
  onClose,
}: FriendRequestModalProps) => {
  const { receivedList, sentList, getAllFriendRequest, loading } =
    useFriendStore();
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  useEffect(() => {
    if (isOpen) {
      getAllFriendRequest();
    }
  }, [isOpen, getAllFriendRequest]);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open z-[100]">
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Lời mời kết bạn</h3>
              <p className="text-sm text-base-content/60">
                Quản lý lời mời kết bạn
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div role="tablist" className="tabs tabs-boxed  mt-4 ">
          <button
            role="tab"
            className={`tab ${activeTab === "received" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("received")}
          >
            Đã nhận ({receivedList?.length || 0})
          </button>
          <button
            role="tab"
            className={`tab ${activeTab === "sent" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("sent")}
          >
            Đã gửi ({sentList?.length || 0})
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 max-h-[50vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary mb-4" />
              <p className="text-base-content/60">Đang tải...</p>
            </div>
          ) : activeTab === "received" ? (
            <ReceivedRequests />
          ) : (
            <SentRequests />
          )}
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop bg-black/50" onClick={onClose} />
    </div>
  );
};
