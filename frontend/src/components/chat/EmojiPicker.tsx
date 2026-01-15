import { useThemeStore } from "@/zustands/useThemeStore";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const darkThemes = [
  "dark",
  "halloween",
  "forest",
  "aqua",
  "black",
  "luxury",
  "dracula",
  "business",
  "night",
  "coffee",
  "dim",
  "sunset",
  "synthwave",
];

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { theme } = useThemeStore() as { theme: string };
  const isDark = darkThemes.includes(theme);

  return (
    <div className="dropdown dropdown-top dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle btn-sm"
      >
        <Smile size={20} className="text-base-content/50" />
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-[1] mb-2 shadow-xl rounded-2xl overflow-hidden bg-base-100"
      >
        <Picker
          theme={isDark ? "dark" : "light"}
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          emojiSize={22}
        />
      </div>
    </div>
  );
};

export default EmojiPicker;
