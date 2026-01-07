import { Camera } from "lucide-react";

interface ProfileUpdateImageProps {
  handleSubmit: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUpdatingProfile: boolean;
  authUser: { profilePicture?: string };
  selectedImg?: string;
}
export default function ProfileUpdateImage({
  handleSubmit,
  isUpdatingProfile,
  authUser,
  selectedImg,
}: ProfileUpdateImageProps) {

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <img
          src={selectedImg || authUser.profilePicture || "/avatar.png"}
          alt="Profile"
          className="size-32 rounded-full object-cover border-3 "
        />
        <label
          htmlFor="avatar-upload"
          className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-3 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
        >
          <Camera className="z-5 text-base-200" />
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            onChange={handleSubmit}
            disabled={isUpdatingProfile}
          />
        </label>
      </div>
      <p className="text-sm text-zinc-400">
        {isUpdatingProfile
          ? "Uploading..."
          : "Click the camera icon to update your photo"}
      </p>
    </div>
  );
}
