import { create } from "zustand";
import type { User } from "./useAuthStore.ts";
import privateClient from "../lib/axios.ts";
import { toast } from "react-toastify";

export interface Message {
  _id: string; // ID MongoDB
  content?: string; // có thể không có nếu chỉ gửi ảnh/file
  sender: string; // ObjectId dưới dạng string
  receiver: string; // ObjectId dưới dạng string
  image?: string; // URL ảnh nếu có
  file?: {
    url: string;
    name: string;
    type: string;
    size: number;
  };
  createdAt: string;
  updatedAt: string;
}
interface ChatStore {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getMessages: ({ userId }: { userId: string }) => Promise<void>;
  getUsers: () => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await privateClient.get("/message/users");
      set({ users: res.data.users });
      return res.data.users;
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async ({ userId }: { userId: string }) => {
    set({ isMessagesLoading: true });
    try {
      const res = await privateClient.get(`/message/${userId}`);
      set({ messages: res.data.messages });
    } catch (error: any) {
      console.log(error);
      toast.error("Có lỗi xảy ra" + (error?.response?.data?.message || ""));
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),
}));
