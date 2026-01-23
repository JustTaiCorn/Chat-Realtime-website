import type { Conversation, Message } from "../../types/chat.ts";
import { cn, formatMessageTime } from "../../lib/utils.ts";
import { UserAvatar } from "./UserAvatar.tsx";
import { MessageActions } from "./MessageActions.tsx";
import { ReactionsList } from "./ReactionList.tsx";

interface MessageItemProps {
  onlineUsers: string[];
  message: Message;
  index: number;
  messages: Message[];
  selectedConversation: Conversation;
  lastMessageStatus: "delivered" | "seen";
  onReplyToMessage: (message: Message) => void;
  onReaction: (messageId: string, emoji: string) => void;
}

export const MessageItem = ({
  onlineUsers,
  message,
  index,
  messages,
  selectedConversation,
  lastMessageStatus,
  onReplyToMessage,
  onReaction,
}: MessageItemProps) => {
  const { content, imageUrl, createdAt, isOwn, replyTo, reactions } = message;
  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const isShowTime =
    index === 0 ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime() >
      300000;

  const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;

  const participant = selectedConversation.participants.find(
    (p) => p._id?.toString() === message.senderId?.toString(),
  );

  return (
    <>
      <div className={cn("chat", isOwn ? "chat-end" : "chat-start")}>
        {/* Avatar + tên người gửi */}
        {!isOwn && isGroupBreak && (
          <>
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
            <div className="chat-header">{participant?.fullName}</div>
          </>
        )}

        <div className="relative group flex flex-col items-center">
          <MessageActions
            isOwn={isOwn}
            onReply={() => onReplyToMessage(message)}
            onReact={(emoji: string) => onReaction(message._id, emoji)}
          />

          <div
            className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}
          >
            <div
              className={cn(
                "chat-bubble max-w-xs lg:max-w-md",
                imageUrl
                  ? "bg-transparent p-0 border-none"
                  : isOwn
                    ? "chat-bubble-primary"
                    : "chat-bubble-secondary",
              )}
            >
              {replyTo && (
                <div className="bg-base-100/20 border-l-4 border-base-100/70  p-2 mb-2 rounded text-xs">
                  <div className="font-semibold opacity-70">
                    {replyTo.senderId.fullName}
                  </div>
                  <div className="opacity-60 truncate">
                    {replyTo.imageUrl && "📷 "}
                    {replyTo.content || "Hình ảnh"}
                  </div>
                </div>
              )}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Message attachment"
                  className="rounded-lg mb-2 max-w-full h-auto"
                />
              )}
              {content && (
                <p
                  className={cn(
                    "text-sm leading-relaxed break-words",
                    imageUrl && "p-3 bg-base-300 rounded-lg lg:max-w-md",
                  )}
                >
                  {content}
                </p>
              )}
            </div>
            {reactions && reactions.length > 0 && (
              <ReactionsList
                reactions={reactions}
                onReactionClick={(emoji: string) =>
                  onReaction(message._id, emoji)
                }
              />
            )}
          </div>
        </div>
        {/* <div className="chat-footer opacity-50 flex items-center gap-1">
          {formatMessageTime(new Date(createdAt))}
          {isOwn && index === messages.length - 1 && (
            <span className="text-[10px] font-medium ml-1">
              • {lastMessageStatus === "seen" ? "Đã xem" : "Đã gửi"}
            </span>
          )}
        </div> */}
      </div>

      {isShowTime && (
        <span className="flex justify-center text-xs text-muted-foreground px-1">
          {formatMessageTime(new Date(message.createdAt))}
        </span>
      )}
    </>
  );
};

export default MessageItem;
