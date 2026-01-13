import { create } from "zustand";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { authService } from "../services/authService";
import { persist } from "zustand/middleware";
import {useChatStore} from "./useChatStore.ts";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
  bio?: string;
  phone?: string;
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
  accessToken: string | null;
  loading: boolean;
  setAccessToken: (token: string | null) => void;
  clearState: () => void;
  signup: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  refresh: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      authUser: null,
      accessToken: null,
      loading: false,

      setAccessToken: (accessToken) => set({ accessToken }),

      clearState: () => {
        set({ authUser: null, accessToken: null, loading: false }),
          localStorage.clear();
      },

      signup: async (data: SignUpData) => {
        try {
          set({ loading: true });
          const res = await authService.signup(
            data.fullName,
            data.email,
            data.password
          );
          set({ authUser: res.user, accessToken: res.accessToken });
          toast.success("Đăng ký thành công");
        } catch (error: unknown) {
          const errorMessage =
            (error as AxiosError<{ message: string }>)?.response?.data
              ?.message || "Đã xảy ra lỗi khi đăng ký";
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      login: async (data: LoginData) => {
        try {
          set({ loading: true });
          localStorage.clear();
          useChatStore.getState().reset();
          const res = await authService.login(data.email, data.password);
          set({ authUser: res.user, accessToken: res.accessToken });
          useChatStore.getState().fetchConversations();
          toast.success("Đăng nhập thành công");
        } catch (error: unknown) {
          const errorMessage =
            (error as AxiosError<{ message: string }>)?.response?.data
              ?.message || "Đã xảy ra lỗi khi đăng nhập";
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        try {
          await authService.logout();
          get().clearState();
          toast.success("Đăng xuất thành công");
        } catch (error) {
          console.error("Error logging out:", error);
        }
      },

      loginWithGoogle: async () => {
        try {
          window.location.href = "http://localhost:3001/api/v1/auth/google";
        } catch (error) {
          console.error("Error logging in with Google:", error);
        }
      },

      updateProfile: async ({ file }: UpdateProfileData) => {
        try {
          set({ loading: true });
          const formData = new FormData();
          formData.append("profilePicture", file);
          const res = await authService.updateProfile(formData);
          set({ authUser: res.user });
          toast.success("Cập nhật ảnh đại diện thành công");
        } catch (error) {
          toast.error((error as Error).message);
        } finally {
          set({ loading: false });
        }
      },

      fetchMe: async () => {
        try {
          set({ loading: true });
          const user = await authService.checkAuth();
          set({ authUser: user });
        } catch (error) {
          console.error("Error fetching user:", error);
          set({ authUser: null, accessToken: null });
        } finally {
          set({ loading: false });
        }
      },

      refresh: async () => {
        try {
          set({ loading: true });
          const accessToken = await authService.refresh();
          set({ accessToken });

          if (!get().authUser) {
            await get().fetchMe();
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          get().clearState();
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth",
      partialize: (state) => ({
        authUser: state.authUser,
      }),
    }
  )
);
