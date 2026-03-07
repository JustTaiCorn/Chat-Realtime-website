import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { chatService } from "@/services/chatService";
import { toast } from "react-toastify";
import { useAuthStore } from "@/zustands/useAuthStore";

export const useGetConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const data = await chatService.fetchConversations();
      return data.conversations || [];
    },
  });
};

export const useGetMessages = (conversationId: string | null) => {
  const user = useAuthStore.getState().authUser;
  return useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: async ({ pageParam }) => {
      if (!conversationId) return { messages: [], cursor: null };
      const { messages, cursor } = await chatService.fetchMessages(
        conversationId,
        pageParam as string | undefined,
      );

      const processed = messages.map((message) => ({
        ...message,
        isOwn: message.senderId === user?._id,
      }));

      return { messages: processed, cursor: cursor || null };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
    enabled: !!conversationId,
  });
};

export const useSendDirectMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      receiverId,
      content,
      image,
      conversationId,
      replyToMessageId,
    }: {
      receiverId: string;
      content: string;
      image?: File;
      conversationId?: string;
      replyToMessageId?: string;
    }) => {
      return await chatService.sendDirectMessage(
        receiverId,
        content,
        image,
        conversationId,
        replyToMessageId,
      );
    },
    onSuccess: (newMessage) => {
      if (newMessage.conversationId) {
        queryClient.invalidateQueries({
          queryKey: ["messages", newMessage.conversationId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Không thể gửi tin nhắn");
    },
  });
};

export const useSendGroupMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
      image,
      replyToMessageId,
    }: {
      conversationId: string;
      content: string;
      image?: File;
      replyToMessageId?: string;
    }) => {
      return await chatService.sendGroupMessage(
        conversationId,
        content,
        image,
        replyToMessageId,
      );
    },
    onSuccess: (newMessage) => {
      if (newMessage.conversationId) {
        queryClient.invalidateQueries({
          queryKey: ["messages", newMessage.conversationId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Không thể gửi tin nhắn nhóm");
    },
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      type,
      memberIds,
      name,
    }: {
      type: "direct" | "group";
      memberIds: string[];
      name?: string;
    }) => {
      return await chatService.createConversation(type, memberIds, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Không thể tạo cuộc trò chuyện");
    },
  });
};

export const useMarkAsSeen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      return await chatService.markAsSeen(conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useToggleReaction = () => {
  return useMutation({
    mutationFn: async ({
      messageId,
      emoji,
    }: {
      messageId: string;
      emoji: string;
    }) => {
      return await chatService.toggleReaction(messageId, emoji);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Không thể thêm phản hồi");
    },
  });
};
