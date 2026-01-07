import type { User } from "../../zustands/useAuthStore.ts";

export default function List({
  isLoading,
  users,
  setSelectedUser,
  selectedUser,
}: {
  selectedUser: User | null;
  isLoading: boolean;
  users: User[];
  setSelectedUser: (user: User) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-4 h-full">
        <span className="loading loading-ring loading-2xl"></span>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto w-full py-3">
      {users.map((user: User) => (
        <button
          className={`flex gap-3 w-full items-center  p-3 hover:bg-base-200 transition-colors ${
            selectedUser?._id === user._id ? "bg-base-100" : ""
          }`}
          key={user._id}
          onClick={() => setSelectedUser(user)}
        >
          <div className="avatar">
            <div className="w-12 rounded-full ">
              <img
                src={user.profilePicture || "/avatar.png"}
                alt={user.fullName}
              />
            </div>
          </div>
          <div className="text-left hidden md:block">
            <div className="font-medium">{user.fullName}</div>
            <div className="text-sm opacity-50">{user.email}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
