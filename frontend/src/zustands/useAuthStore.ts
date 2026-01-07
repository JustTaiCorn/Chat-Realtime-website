import { create } from "zustand";
import privateClient from "../lib/axios";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  createdAt?: string;
}
interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  file: File;
}

interface AuthStore {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await privateClient.get("/auth/check-auth");
      set({
        authUser: res.data?.user,
        isCheckingAuth: false,
      });
    } catch (error) {
      console.log("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data: SignUpData) => {
    set({ isSigningUp: true });
    try {
      const res = await privateClient.post("/auth/signup", data);
      set({ authUser: res.data.user, isSigningUp: false });
      toast.success("Đăng ký thành công");
    } catch (error: unknown) {
      set({ isSigningUp: false });
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Đã xảy ra lỗi khi đăng ký";

      console.log("Lỗi khi đăng ký:", errorMessage);
      toast.error(errorMessage);

      // Throw error để component có thể handle
      throw error;
    }
  },
  logout: async () => {
    try {
      await privateClient.post("/auth/logout");
      set({ authUser: null });
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  },
  login: async (data: LoginData) => {
    set({ isLoggingIn: true });
    try {
      const res = await privateClient.post("/auth/login", data);
      console.log("✅ Login thành công, response:", res);
      set({ authUser: res.data.user, isLoggingIn: false });
      toast.success("Đăng nhập thành công");
    } catch (error: unknown) {
      set({ isLoggingIn: false });
      const axiosError = error as AxiosError<{ message: string }>;

      const errorMessage =
        axiosError?.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập";

      console.log("❌ Error message:", errorMessage);
      toast.error(errorMessage);
      throw error as AxiosError;
    }
  },
  loginWithGoogle: async () => {
    try {
      window.location.href =
        "http://localhost:3000/api/v1/auth/google/callback";
    } catch (error) {
      console.log("Error logging in with Google:", error);
    }
  },

  updateProfile: async ({ file }: UpdateProfileData) => {
    set({ isUpdatingProfile: true });
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      const res = await privateClient.put("/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
      set({ authUser: res.data.user, isUpdatingProfile: false });

      toast.success("Update ProfilePicture Successfully");
    } catch (error) {
      set({ isUpdatingProfile: false });
      console.log("Đã có lỗi xảy ra");
      toast.error((error as Error).message);
    }
  },
}));
