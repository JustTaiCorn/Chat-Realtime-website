import type { Conversation, Message } from "../../types/chat.ts";
import { cn, formatMessageTime } from "../../lib/utils.ts";
import { UserAvatar } from "./UserAvatar.tsx";

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConversation: Conversation;
  lastMessageStatus: "delivered" | "seen";
}

export const MessageItem = ({
  message,
  index,
  messages,
  selectedConversation,
  lastMessageStatus,
}: MessageItemProps) => {
  const { content, imgUrl, createdAt, isOwn, senderId } = message;
  const pre =index + 1 <messages.length ? messages[index + 1] :undefined ;
  const isGroupBreak =
    index === 0 ||
    senderId !== pre?.senderId ||
    new Date(createdAt).getTime() - new Date(pre.createdAt).getTime() >
      60 * 60 * 1000;
  const participant = selectedConversation.participants.find(
    (p) => p._id.toString() === senderId.toString()
  );
  return (
    <div className={cn("flex gap-2", isOwn ? "justify-end" : "justify-start")}>
      {!isOwn && isGroupBreak && (
        <div className="w-8">
          <UserAvatar
            type="chat"
            name={participant?.fullName}
            profilePicture={participant?.profilePicture ?? undefined}
          />
        </div>
      )}
      <div
        className={`max-w-xs lg:max-w-md space-y-1 flex flex-col rounded-xl  chat p-3 ${
          isOwn ? "bg-primary" : "bg-secondary"
        }`}
      >
        {content && (
          <p
            className={`chat-bubble text-sm leading-relax break-words ${
              isOwn ? "chat-bubble-primary" : "chat-bubble-secondary"
            }`}
          >
            {content}
          </p>
        )}
        <div className="chat-footer opacity-50 flex items-center gap-1">
          {formatMessageTime(new Date(createdAt))}
          {isOwn && index === messages.length - 1 && (
            <span className="text-[10px] font-medium ml-1">
              • {lastMessageStatus === "seen" ? "Đã xem" : "Đã gửi"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
