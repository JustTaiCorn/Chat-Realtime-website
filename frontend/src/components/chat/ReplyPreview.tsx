
import type { Message } from "@/types/chat";
import { Reply, X } from "lucide-react";
interface ReplyPreviewProps {
  replyTo: Message;
  onCancel: () => void;
}

export const ReplyPreview = ({ replyTo, onCancel }: ReplyPreviewProps) => {
  return (
      <div className="bg-base-200 border-l-4 border-primary p-3 rounded-lg mb-2 flex items-start justify-between gap-2">
          <Reply className="w-4 h-4" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-base-content/70 truncate">
          {replyTo.imageUrl && "📷 "}
          {replyTo.content || "Hình ảnh"}
        </div>
      </div>
      <button
        onClick={onCancel}
        className="btn btn-ghost btn-xs btn-circle"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};