import { cn } from "../../lib/utils.ts";

interface UserAvatarProps {
  type: "chat" | "sidebar" | "profile";
  name?: string;
  profilePicture?: string;
  className?: string;
  status?: "online" | "offline";
}

export const UserAvatar = ({
  type,
  name = "User",
  profilePicture,
  className, status
}: UserAvatarProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn("avatar", profilePicture ? "" : "avatar-placeholder", status
        ? status === "online"
            ? "avatar-online"
            : "avatar-offline"
        : "" )}>
      <div
        className={cn(
          "rounded-full",
          className,
          type === "chat" && "size-8 text-xs",
          type === "sidebar" && "size-12 text-base",
          type === "profile" && "w-24 h-24 text-3xl shadow-md",
          !profilePicture && "bg-neutral text-neutral-content"
        )}
      >
        {profilePicture ? (
          <img src={profilePicture} alt={name} />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
    </div>
  );
};
