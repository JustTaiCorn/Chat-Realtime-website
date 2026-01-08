import privateClient from "../lib/axios";

export const authService = {
  signup: async (fullName: string, email: string, password: string) => {
    const res = await privateClient.post("/auth/signup", {
      fullName,
      email,
      password,
    });
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await privateClient.post("/auth/login", { email, password });
    return res.data;
  },

  logout: async () => {
    return privateClient.post("/auth/logout");
  },

  refresh: async () => {
    const res = await privateClient.post("/auth/refresh");
    return res.data.accessToken;
  },

  checkAuth: async () => {
    const res = await privateClient.get("/auth/check-auth");
    return res.data.user;
  },

  updateProfile: async (formData: FormData) => {
    const res = await privateClient.put("/auth/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
};
