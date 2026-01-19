import type { Conversation, Message } from "../../types/chat.ts";
import { cn, formatMessageTime } from "../../lib/utils.ts";
import { UserAvatar } from "./UserAvatar.tsx";

interface MessageItemProps {
  onlineUsers: string[];
  message: Message;
  index: number;
  messages: Message[];
  selectedConversation: Conversation;
  lastMessageStatus: "delivered" | "seen";
}

export const MessageItem = ({
  onlineUsers,
  message,
  index,
  messages,
  selectedConversation,
  lastMessageStatus,
}: MessageItemProps) => {
  const { content, imgUrl, createdAt, isOwn } = message;
  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;
  const isShowTime =
    index === 0 ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime() >
      300000; // 5 phút

  const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;
  console.log("participant", selectedConversation.participants);
  const participant = selectedConversation.participants.find(
    (p) => p._id?.toString() === message.senderId?.toString()
  );
  return (
    <div className={cn("chat", isOwn ? "chat-end" : "chat-start")}>
      {!isOwn && isGroupBreak && (
        <div className="chat-image avatar">
          <div className="w-10">
            <UserAvatar
              type="chat"
              name={participant?.fullName}
              profilePicture={participant?.profilePicture ?? undefined}
              status={
                onlineUsers.includes(participant?._id || "")
                  ? "online"
                  : "offline"
              }
            />
          </div>
        </div>
      )}

      {!isOwn && isGroupBreak && (
        <div className="chat-header">{participant?.fullName}</div>
      )}

      <div
        className={cn(
          "chat-bubble max-w-xs lg:max-w-md",
          isOwn ? "chat-bubble-primary" : "chat-bubble-secondary"
        )}
      >
        {imgUrl && (
          <img
            src={imgUrl}
            alt="Message attachment"
            className="rounded-lg mb-2"
          />
        )}
        {content && (
          <p className="text-sm leading-relaxed break-words">{content}</p>
        )}
      </div>

      <div className="chat-footer opacity-50 flex items-center gap-1">
        {formatMessageTime(new Date(createdAt))}
        {isOwn && index === messages.length - 1 && (
          <span className="text-[10px] font-medium ml-1">
            • {lastMessageStatus === "seen" ? "Đã xem" : "Đã gửi"}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
