import { Outlet } from "react-router-dom";
import NavBar from "../common/NavBar";
import SideBar from "../SideBar/SideBar";
import { useAuthStore } from "../../zustands/useAuthStore";

export const MainLayout = () => {
  const { authUser } = useAuthStore();
  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex-shrink-0">
          <NavBar />
        </div>
        <div className="flex flex-1 overflow-hidden">
          {/* Fixed SideBar */}
          <div className="flex-shrink-0">{authUser && <SideBar />}</div>

          {/* Scrollable Outlet content */}
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
