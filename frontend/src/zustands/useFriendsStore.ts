import { create } from "zustand";
import { friendService } from "../services/friendservice";
import type { FriendState } from "@/types/store";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const useFriendStore = create<FriendState>((set, get) => ({
  loading: false,
  friends: [],
  receivedList: [],
  sentList: [],
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
  sendFriendRequest: async (to: string, message?: string) => {
    try {
      set({ loading: true });
      const res = await friendService.sendFriendRequest(to, message);
      toast.success("Đã gửi yêu cầu kết bạn");
      return res;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Đã xảy ra lỗi khi gửi yêu cầu kết bạn";
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  acceptFriendRequest: async (requestID: string) => {
    try {
      set({ loading: true });
      const res = await friendService.acceptFriendRequest(requestID);
      toast.success("Đã chấp nhận yêu cầu kết bạn");
      set((state) => ({
        receivedList: state.receivedList.filter(
          (request) => request._id !== requestID
        ),
      }));
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Đã xảy ra lỗi khi chấp nhận yêu cầu kết bạn";
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  rejectFriendRequest: async (requestID: string) => {
    try {
      set({ loading: true });
      await friendService.rejectFriendRequest(requestID);
      toast.success("Đã từ chối yêu cầu kết bạn");
      set((state) => ({
        receivedList: state.receivedList.filter(
          (request) => request._id !== requestID
        ),
      }));
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Đã xảy ra lỗi khi từ chối yêu cầu kết bạn";
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getAllFriendRequest: async () => {
    try {
      set({ loading: true });
      const res = await friendService.getAllFriendRequest();
      if (!res) return;
      set({ receivedList: res.received, sentList: res.sent });
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Đã xảy ra lỗi khi lấy yêu cầu kết bạn";
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getFriends: async () => {
    try {
      set({ loading: true });
      const friends = await friendService.getAllFriend();
      set({ friends: friends });
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Đã xảy ra lỗi khi lấy danh sách bạn bè";
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
