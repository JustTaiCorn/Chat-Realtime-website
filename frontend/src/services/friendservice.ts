import privateClient from "@/lib/axios";

export const friendService = {
  async searchUser(query: string) {
    const res = await privateClient.get("/auth/search", {
      params: { query },
    });
    return res.data.users;
  },

  async sendFriendRequest(to: string, message?: string) {
    const res = await privateClient.post("/friends/requests", {
      to,
      message,
    });
    return res.data.message;
  },
  async getAllFriendRequest() {
    try {
      const res = await privateClient.get("/friends/requests");
      const { sent, received } = res.data;
      return { sent, received };
    } catch (error) {
      console.log(error);
    }
  },

  async acceptFriendRequest(requestID: string) {
    try {
      const res = await privateClient.post(
        `/friends/requests/${requestID}/accept`
      );
      return res.data.newFriend;
    } catch (error) {
      console.log(error);
    }
  },
  async rejectFriendRequest(requestID: string) {
    try {
      await privateClient.post(`/friends/requests/${requestID}/decline`);
    } catch (error) {
      console.log(error);
    }
  },
  async getAllFriend() {
    const res = await privateClient.get("/friends");
    console.log(res.data);
    return res.data.friends;
  },
};
