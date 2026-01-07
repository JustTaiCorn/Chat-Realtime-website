import { LogOut, MessageSquareDashed, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../zustands/useAuthStore";

export default function NavBar() {
  const { authUser, logout } = useAuthStore();
  return (
    <header className="bg-base-100 border-b border-base-300 fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-lg ">
      <div className="container mx-auto px-4 h-16 ">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquareDashed className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-lg">Social App</h1>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/settings" className="btn btn-sm gap-2 transition-colors btn-outline  ">
              <Settings className="w-5 h-5" />
              <span className="hidden sm:block ">Settings</span>
            </Link>
            {authUser && (
              <>
                <div className="navbar"></div>
                <div className="dropdown dropdown-end mt-0.75">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS Navbar component"
                        src={authUser.profilePicture || "/avatar.png" }
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                  >
                    <li>
                      <Link to="/profile" className="justify-start">
                        <User className="w-5 h-5" />
                        <span className="hidden sm:block">Profile</span>
                      </Link>
                    </li>

                    <li>
                      <button onClick={logout} className="justify-start">
                        <LogOut className="w-5 h-5" />
                        <span className="hidden sm:block">Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
