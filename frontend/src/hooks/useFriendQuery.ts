import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { friendService } from "@/services/friendservice";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const useGetFriendRequests = () => {
  return useQuery({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      const data = await friendService.getAllFriendRequest();
      return data || { sent: [], received: [] };
    },
  });
};

export const useGetFriends = () => {
  return useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const data = await friendService.getAllFriend();
      return data || [];
    },
  });
};

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ to, message }: { to: string; message?: string }) => {
      return await friendService.sendFriendRequest(to, message);
    },
    onSuccess: () => {
      toast.success("Đã gửi yêu cầu kết bạn");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Đã xảy ra lỗi khi gửi yêu cầu kết bạn";
      toast.error(errorMessage);
    },
  });
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestID: string) => {
      return await friendService.acceptFriendRequest(requestID);
    },
    onSuccess: () => {
      toast.success("Đã chấp nhận yêu cầu kết bạn");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Đã xảy ra lỗi khi chấp nhận yêu cầu kết bạn";
      toast.error(errorMessage);
    },
  });
};

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestID: string) => {
      return await friendService.rejectFriendRequest(requestID);
    },
    onSuccess: () => {
      toast.success("Đã từ chối yêu cầu kết bạn");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Đã xảy ra lỗi khi từ chối yêu cầu kết bạn";
      toast.error(errorMessage);
    },
  });
};
