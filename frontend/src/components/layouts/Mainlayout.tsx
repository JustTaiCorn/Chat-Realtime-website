import { Outlet } from "react-router-dom";
import NavBar from "../common/NavBar";

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-shrink-0">
        <NavBar />
      </div>
      <div className="flex-1 min-h-screen">
        <div className="h-full overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
