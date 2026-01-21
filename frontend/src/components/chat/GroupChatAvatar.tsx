import type { Participant } from "../../types/chat";
import { UserAvatar } from "./UserAvatar";
import { Ellipsis } from "lucide-react";

interface GroupChatAvatarProps {
  participants: Participant[];
  type: "chat" | "sidebar";
}

const GroupChatAvatar = ({ participants, type }: GroupChatAvatarProps) => {
  const limit = Math.min(participants.length, 4);

  return (
    <div className="avatar-group -space-x-5 rtl:space-x-reverse">
      {participants.slice(0, limit).map((member, i) => (
        <UserAvatar
          key={i}
          type={type}
          name={member.fullName}
          profilePicture={member.profilePicture ?? undefined}
        />
      ))}
      {participants.length > limit && (
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full size-8">
            <Ellipsis className="size-4" />
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChatAvatar;
