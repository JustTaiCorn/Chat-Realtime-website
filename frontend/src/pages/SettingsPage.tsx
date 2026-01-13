import { useThemeStore } from "../zustands/useThemeStore.ts";
import { Send } from "lucide-react";
export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
    "caramellatte",
    "abyss",
    "silk",
  ];
  const PREVIEW_MESSAGES = [
    { id: 1, content: "Hey! Khỏe không cu?", isSent: false },
    {
      id: 2,
      content: "Tớ ủn.",
      isSent: true,
    },
  ];

  return (
    <div
      className="h-full container mx-auto gap-2 max-w-[1366px]  px-4 pt-20 overflow-auto "
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="font-bold text-2xl">Chủ đề</div>
          <div className=" font-medium ">Mời lựa chọn chủ đề bạn yêu thích</div>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {themes.map((themes, i) => (
            <button
              key={themes}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors 
                ${theme === themes ? "bg-base-300" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(themes)}
            >
              <div className="h-8   relative w-full ">
                <div
                  data-theme={themes}
                  className="absolute inset-0 grid grid-cols-4 gap-1 p-1 rounded-md"
                >
                  <div className=" rounded-md bg-accent"></div>
                  <div className=" rounded-md bg-primary"></div>
                  <div className=" rounded-md bg-neutral"></div>
                  <div className=" rounded-md bg-secondary"></div>
                </div>
              </div>
              <div className="font-light text-sm ">{`Theme ${i + 1}`}</div>
            </button>
          ))}
        </div>
      </div>
      <h3 className="font-bold mt-5 text-xl uppercase">Demo Chủ đề</h3>
      <div className=" mt-3  rounded-lg md:border md:border-base-300  bg-none md:bg-base-300 mb-5">
        <div className="pt-2 bg-base-200 max-w-xl mx-auto rounded-3xl my-5">
          {/*header title*/}
          <div className="flex justify-start gap-1 px-4 mt-4">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
              </div>
            </div>
            <div className="flex flex-col px-4">
              <h4 className="font-bold">Tai Corn</h4>
              <h5 className="text-base-content/60">Online</h5>
            </div>
          </div>
          {/*message*/}
          <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto ">
            {PREVIEW_MESSAGES.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isSent ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-md p-2 sm:p-4  ${
                    message.isSent ? " bg-primary " : "bg-secondary"
                  }`}
                >
                  <p
                    className={`${
                      message.isSent
                        ? "text-primary-content"
                        : "text-secondary-content"
                    }`}
                  >
                    {message.content}
                  </p>
                  <p
                    className={`items-start text-sm text-base-content/60 ${
                      message.isSent
                        ? "text-primary-content"
                        : "text-secondary-content"
                    }`}
                  >
                    12.pm
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-base-300 bg-base-100 rounded-b-3xl">
            <div className="flex gap-2">
              <input
                type="text"
                className="input input-bordered flex-1 text-sm h-10"
                placeholder="Type a message..."
                value="This is a preview"
                readOnly
              />
              <button className="btn btn-primary h-10 min-h-0">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
