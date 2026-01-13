
import React from "react";
import { MoreHorizontal } from "lucide-react";
import { cn, formatOnlineTime } from "../../lib/utils.ts";

interface ChatCardProps {
  convoId: string;
  name: string;
  timestamp?: Date;
  isActive: boolean;
  onSelect: (id: string) => void;
  unreadCount?: number;
  leftSection: React.ReactNode;
  subtitle: React.ReactNode;
}

const ChatCard = ({
  convoId,
  name,
  timestamp,
  isActive,
  onSelect,
  unreadCount,
  leftSection,
  subtitle,
}: ChatCardProps) => {
  return (
    <div
      key={convoId}
      className={cn(
        "card card-sm bg-base-100 cursor-pointer transition-all duration-200 hover:bg-base-200",
        isActive &&
          "ring-2 ring-primary/50 bg-gradient-to-tr from-primary/10 to-base-100"
      )}
      onClick={() => onSelect(convoId)}
    >
      <div className="card-body p-3">
        <div className="flex items-center gap-3">
          <div className="relative">{leftSection}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3
                className={cn(
                  "font-semibold text-sm truncate",
                  unreadCount && unreadCount > 0 && "text-base-content"
                )}
              >
                {name}
              </h3>

              <span className="text-xs text-base-content/60">
                {timestamp ? formatOnlineTime(timestamp) : ""}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                {subtitle}
              </div>
              <MoreHorizontal className="size-4 text-base-content/60 opacity-0 group-hover:opacity-100 hover:size-5 transition-all duration-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
