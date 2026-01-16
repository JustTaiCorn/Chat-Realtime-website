import type { ReactNode } from "react";
import type { FriendRequest } from "@/types/friend";
import { UserAvatar } from "@/components/chat/UserAvatar.tsx";

interface FriendRequestItemProps {
  requestInfo: FriendRequest;
  actions: ReactNode;
  type: "sent" | "received";
}

const FriendRequestItem = ({
  requestInfo,
  actions,
  type,
}: FriendRequestItemProps) => {
  if (!requestInfo) return null;
  const userInfo = type === "sent" ? requestInfo.to : requestInfo.from;

  if (!userInfo) return null;

  return (
    <div className="flex items-center justify-between rounded-xl bg-base-200/50 hover:bg-base-200 transition-all border border-transparent hover:border-primary/20 p-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <UserAvatar type="sidebar" name={userInfo.fullName} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-base truncate">
            {userInfo.fullName}
          </p>
          {type === "received" && (
            <p className="text-sm text-base-content/60">Muốn kết bạn với bạn</p>
          )}
          {type === "sent" && (
            <p className="text-sm text-base-content/60">Đang chờ phản hồi...</p>
          )}
        </div>
      </div>
      <div className="shrink-0 ml-4">{actions}</div>
    </div>
  );
};

export default FriendRequestItem;
