import { Outlet } from "react-router-dom";
import NavBar from "../common/NavBar";
import BottomNav from "../common/BottomNav";

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-shrink-0 hidden md:block">
        <NavBar />
      </div>
      <div className="flex-1">
        <div className="h-full overflow-y-auto">
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
