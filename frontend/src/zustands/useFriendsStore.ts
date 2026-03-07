import { create } from "zustand";
import { friendService } from "../services/friendservice";
import type { FriendState } from "@/types/store";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const useFriendStore = create<FriendState>((set) => ({
  loading: false,
  searchUser: async (query: string) => {
    try {
      set({ loading: true });
      const users = await friendService.searchUser(query);
      return users;
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Đã xảy ra lỗi khi tìm kiếm người dùng";
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
