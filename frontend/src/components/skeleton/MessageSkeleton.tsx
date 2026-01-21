export default function MessageSkeleton() {
  const messageArray = Array(6).fill(null);
  return (
    <div className="flex flex-col overflow-y-auto p-4 space-y-4 h-full">
      {messageArray.map((_, index) => (
        <div
          key={index}
          className={`chat ${index % 2 === 0 ? "chat-start" : "chat-end"}`}
        >
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <div className="skeleton w-full h-full rounded-full"></div>
            </div>
          </div>
          <div className="chat-header">
            <div className="skeleton h-4 w-16"></div>
          </div>
          <div className="chat-bubble">
            <div className="skeleton h-4 w-[200px]"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
