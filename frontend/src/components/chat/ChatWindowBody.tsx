import { useChatStore } from "../../zustands/useChatStore.ts";
import MessageItem from "./MessageItem.tsx";
import NoChat from "./Nochat.tsx";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {useSocketStore} from "@/zustands/useSocketStore.ts";
export const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
    fetchMessages,
  } = useChatStore();
  const [lastMessageStatus, setLastMessageStatus] = useState<
    "delivered" | "seen"
  >("delivered");
    const { onlineUsers } = useSocketStore();
  const messages = allMessages[activeConversationId || ""]?.items || [];
  const reverseMessages = [...messages].reverse();
  const hasMore = allMessages[activeConversationId || ""]?.hasMore || false;
  const selectedConversation =
    conversations.find((c) => c._id === activeConversationId)
      || null;
  console.log("selectedConversation", selectedConversation);
  const key = `chat_scroll_${activeConversationId}`;
  const messageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const lastMessage = selectedConversation?.lastMessage;
    if (!lastMessage) return;

    const seenBy = selectedConversation.seenBy || [];
    setLastMessageStatus(seenBy.length > 0 ? "seen" : "delivered");
  });

  useLayoutEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, activeConversationId]);
useLayoutEffect(() => {
  if (!containerRef.current) return;

  const savedScroll = sessionStorage.getItem(key);
  if (!savedScroll) return;

  try {
    const { scrollTop } = JSON.parse(savedScroll);
    requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = scrollTop;
      }
    });
  } catch (err) {
    console.error("Failed to parse saved scroll:", err);
  }
}, [messages]);

  const fetchMoreMessages = async () => {
    if (!activeConversationId) {
      return;
    }

    try {
      fetchMessages(activeConversationId);
    } catch (error) {
      console.error("Lỗi xảy ra khi fetch thêm tin", error);
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    sessionStorage.setItem(key, JSON.stringify(containerRef.current.scrollTop));
  };

  if (!selectedConversation) {
    return <NoChat />;
  }
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Chưa có tin nhắn nào cả</p>
      </div>
    );
  }
  return (
    <>
      <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden beautiful-scrollbar">
        <div
          ref={containerRef}
          id="scrollableDiv"
          className="flex flex-col-reverse overflow-x-hidden overflow-y-auto "
        >
          <div ref={messageRef}></div>
          <InfiniteScroll
            next={fetchMoreMessages}
            hasMore={hasMore}
            loader={<p>Đang tải...</p>}
            dataLength={messages.length}
            scrollableTarget="scrollableDiv"
            inverse={true}
            style={{
              overflowX: "visible",
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            {reverseMessages.map((message, index) => (
              <MessageItem
                  onlineUsers={onlineUsers}
                key={message._id || index}
                message={message}
                index={index}
                messages={reverseMessages}
                selectedConversation={selectedConversation}
                lastMessageStatus={lastMessageStatus}
              />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
};
