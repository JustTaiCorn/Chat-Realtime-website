import React from "react";
import { useAuthStore } from "../zustands/useAuthStore.ts";
import ProfileUpdateImage from "../components/common/ProfileUpdateImage.tsx";
import { Mail, User } from "lucide-react";

export default function ProfilePage() {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = React.useState<string>("");
  const handleUpdateProfile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) {
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setSelectedImg(result);
      }
    };
    reader.readAsDataURL(file);
    try {
      await updateProfile({file});
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-screen pt-20">
      <div className="max-w-xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold ">Hồ sơ của bạn</h1>
            <p className="mt-2">Thông tin tài khoản của bạn</p>
          </div>
          <ProfileUpdateImage
            handleSubmit={handleUpdateProfile}
            isUpdatingProfile={isUpdatingProfile}
            authUser={authUser || { profilePicture: "" }}
            selectedImg={selectedImg}
          />
        </div>
        <div className="bg-base-300 rounded-xl p-6 space-y-8 mt-2">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-xl text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-xl text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-base-300 rounded-xl p-6 space-y-4 mt-2">
          <h2 className="text-xl font-bold ">Thông tin tài khoản</h2>
          <div className="flex flex-col ">
            <div className="flex justify-between flex-row">
              <span>Member Since</span>
              <span>{authUser?.createdAt?.split("T")[0]}</span>
            </div>
          </div>
          <div className="flex flex-col ">
            <div className="flex justify-between flex-row">
              <span>Trạng thái tài khoản</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
