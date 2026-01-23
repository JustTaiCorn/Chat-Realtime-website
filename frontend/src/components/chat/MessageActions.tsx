import { Reply, MoreVertical } from "lucide-react";
import { cn } from "../../lib/utils.ts";

interface MessageActionsProps {
  onReply: () => void;
  onReact: (emoji: string) => void;
  isOwn?: boolean;
}

const emojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export const MessageActions = ({
  onReply,
  onReact,
  isOwn,
}: MessageActionsProps) => {
  return (
    <div
      className={cn(
        "absolute top-1/2 -translate-y-1/2 duration-200 z-20 flex items-center",
        isOwn ? "right-full mr-2" : "left-full ml-2",
      )}
    >
      <div
        className={cn(
          "dropdown   ",
          isOwn ? "dropdown-left" : "dropdown-right",
        )}
      >
        <label
          tabIndex={0}
          className="btn btn-ghost btn-xs btn-circle hover:bg-base-300 opacity-50"
        >
          <MoreVertical className="w-4 h-4" />
        </label>

        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] p-1 shadow-lg text-sm min-w-[120px]"
        >
          <li>
            <button
              onClick={(e) => {
                onReply();
                (
                  e.currentTarget.parentElement?.parentElement as HTMLElement
                ).blur();
              }}
              className="flex items-center gap-2 hover:bg-base-300"
            >
              <Reply className="w-4 h-4" />
              <span>Trả lời</span>
            </button>
          </li>

          <div className="divider my-0"></div>
          <div className="flex gap-1">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => {
                  onReact(emoji);
                  (
                    e.currentTarget.parentElement?.parentElement as HTMLElement
                  ).blur();
                }}
                className="btn btn-ghost px-0.5 btn-sm text-lg hover:scale-105 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </ul>
      </div>
    </div>
  );
};
