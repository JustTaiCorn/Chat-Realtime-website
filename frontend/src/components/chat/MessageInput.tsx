import { useState, useRef } from "react";
import { Image, Send } from "lucide-react";
import { useAuthStore } from "@/zustands/useAuthStore";
import { useChatStore } from "@/zustands/useChatStore";
import type { Conversation } from "@/types/chat";
import { toast } from "react-toastify";
import EmojiPicker from "./EmojiPicker";

const MessageInput = ({
  selectedConversation,
}: {
  selectedConversation: Conversation;
}) => {
  const { authUser } = useAuthStore();
  const { sendDirectMessage, sendGroupMessage } = useChatStore();
  const [value, setValue] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!authUser) return null;

  const sendMessage = async () => {
    if (!value.trim() && !imagePreview) return;
    const currValue = value;
    setValue("");
    setImagePreview(null);

    try {
      if (selectedConversation.type === "direct") {
        const otherUser = selectedConversation.participants.find(
          (p) => p._id !== authUser._id
        );
        if (otherUser) {
          await sendDirectMessage(otherUser._id, currValue);
        }
      } else {
        await sendGroupMessage(selectedConversation._id, currValue);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xảy ra khi gửi tin nhắn. Bạn hãy thử lại!");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 w-full bg-base-100 border-t border-base-300">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-base-300"
            />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-base-300 rounded-full flex items-center justify-center hover:bg-base-content hover:text-base-100 transition-colors"
            >
              <span className="text-xs">×</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 space-x-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`btn btn-circle btn-ghost btn-sm ${
            imagePreview ? "text-primary" : "text-base-content/50"
          }`}
        >
          <Image size={20} />
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            className="input input-bordered w-full pr-12 rounded-xl input-md focus:outline-primary"
            placeholder="Soạn tin nhắn..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <div className="absolute right-2 flex items-center">
            <EmojiPicker
              onChange={(emoji) => setValue((prev) => prev + emoji)}
            />
          </div>
        </div>

        <button
          onClick={sendMessage}
          disabled={!value.trim() && !imagePreview}
          className="btn btn-primary btn-circle"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
