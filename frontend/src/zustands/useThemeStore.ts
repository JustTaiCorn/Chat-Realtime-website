import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "coffee",
    setTheme: (theme   : string):void => {
        localStorage.setItem("chat-theme", theme);
        set({ theme });
    },
}));