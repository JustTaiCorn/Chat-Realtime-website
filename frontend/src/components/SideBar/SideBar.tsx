import { Link } from "react-router-dom";
import main from "../../configs/menu.config.tsx";
import { useAuthStore } from "../../zustands/useAuthStore.ts";

export default function SideBar() {
  const { authUser } = useAuthStore();
  return (
    <div className="h-full w-32 fixed left-0 top-0">
      <div className="flex items-center justify-start pt-20 flex-col bg-base-100 shadow-xl space-y-4 h-full ">
        <div className="avatar">
          <div className="w-16 rounded-full">
            <img
              src={`${authUser?.profilePicture || "./avatar.png"}`}
              alt="User Avatar"
            />
          </div>
        </div>
        {main.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className="w-full flex items-center justify-center p-4 rounded-lg hover:bg-primary-content hover:text-white transition-colors"
          >
            {item.icon}
          </Link>
        ))}
      </div>
    </div>
  );
}
