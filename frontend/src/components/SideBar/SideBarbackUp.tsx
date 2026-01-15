import { Link } from "react-router-dom";
import main from "../../configs/menu.config.tsx";
import { useAuthStore } from "../../zustands/useAuthStore.ts";
import { Menu } from "lucide-react";

interface SideBarProps {
  children: React.ReactNode;
}

export default function SideBar({ children }: SideBarProps) {
  const { authUser } = useAuthStore();

  return (
    <div className="drawer lg:drawer-open overflow-x-hidden">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="fixed top-20 left-2 z-50 lg:hidden">
          <label
            htmlFor="sidebar-drawer"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost bg-base-100 shadow-lg"
          >
            <Menu className="h-6 w-6" />
          </label>
        </div>

        {children}
      </div>

      <div className="drawer-side z-40">
        <label
          htmlFor="sidebar-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="flex flex-col items-center bg-base-100 shadow-xl min-h-full w-32 pt-20 space-y-4">
          <div className="avatar">
            <div className="w-16 rounded-full">
              <img
                src={`${authUser?.profilePicture || "./avatar.png"}`}
                alt="User Avatar"
              />
            </div>
          </div>
          <ul className="menu w-full p-0">
            {main.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center justify-center p-4 rounded-lg hover:bg-primary-content hover:text-white transition-colors"
                >
                  {item.icon}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
