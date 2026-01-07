import type { ReactElement } from "react";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import SignUpPage from "../pages/SignUpPage";

import { Navigate } from "react-router-dom";
import { useAuthStore } from "../zustands/useAuthStore";
import MessagesPage from "../pages/MessagesPage.tsx";

interface Route {
  index?: boolean;
  path?: string;
  element: ReactElement;
}
interface ProtectedRouteProps {
  children: ReactElement;
}
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { authUser } = useAuthStore();
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
const RedirectAuthenticatedUser = ({ children }: ProtectedRouteProps) => {
  const { authUser } = useAuthStore();
  if (authUser) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const routes: Route[] = [
  {
    index: true,
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <RedirectAuthenticatedUser>
        <SignUpPage />
      </RedirectAuthenticatedUser>
    ),
  },
  {
    path: "/login",
    element: (
      <RedirectAuthenticatedUser>
        <LoginPage />
      </RedirectAuthenticatedUser>
    ),
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path:"/messages" ,
    element:(
        <ProtectedRoute>
          <MessagesPage/>
        </ProtectedRoute>
    )

  }
];

export default routes;
