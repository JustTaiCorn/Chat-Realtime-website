import { useState, useEffect } from "react";
import { useFriendStore } from "@/zustands/useFriendsStore";
import { useDebounce } from "use-debounce";
import type { User } from "@/zustands/useAuthStore";
import { useAuthStore } from "@/zustands/useAuthStore";
import { X, Search, UserPlus, Mail } from "lucide-react";

export interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFriendModal = ({ isOpen, onClose }: AddFriendModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const { searchUser, sendFriendRequest, loading } = useFriendStore();
  const { authUser } = useAuthStore();
  const [debouncedQuery] = useDebounce(searchQuery, 1000);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      if (debouncedQuery.trim().length < 1) {
        setSearchResults([]);
        return;
      }

      try {
        const users = await searchUser(debouncedQuery);
        setSearchResults(users || []);
      } catch {
        setSearchResults([]);
      }
    };

    fetchUsers();
  }, [debouncedQuery, searchUser, authUser?._id, isOpen]);

  const handleSendFriendRequest = async (userId: string) => {
    try {
      setSendingTo(userId);
      await sendFriendRequest(userId);
      setSearchResults([]);
    } catch (error) {
      console.error(error);
    } finally {
      setSendingTo(null);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl p-0">
        {/* Header */}
        <div className="px-6 py-5 border-b border-base-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Tìm kiếm bạn bè</h3>
              <p className="text-sm text-base-content/60">
                Kết nối với người mới
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-base-300">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input
              type="text"
              className="input input-bordered w-full pl-12 pr-12 h-12"
              placeholder="Nhập tên hoặc email để tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {loading && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 loading loading-spinner loading-sm text-primary" />
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto px-6 py-4">
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-base-200 hover:bg-base-300 transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img
                          src={
                            user.profilePicture ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.fullName
                            )}`
                          }
                          alt={user.fullName}
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold truncate">{user.fullName}</p>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    disabled={sendingTo === user._id}
                    onClick={() => handleSendFriendRequest(user._id)}
                  >
                    {sendingTo === user._id ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Kết bạn
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : debouncedQuery.trim().length >= 1 && !loading ? (
            <div className="text-center text-base-content/50 py-12">
              <p className="font-medium">Không tìm thấy kết quả</p>
              <p className="text-sm">Thử từ khóa khác</p>
            </div>
          ) : (
            <div className="text-center text-base-content/50 py-12">
              <p className="font-medium">Tìm kiếm bạn bè</p>
              <p className="text-sm">Nhập tên hoặc email</p>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop" onClick={handleClose} />
    </div>
  );
};
