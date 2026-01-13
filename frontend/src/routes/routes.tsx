import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import SignUpPage from "../pages/SignUpPage";
import HomePage from "../pages/HomePage.tsx";

import { Navigate } from "react-router-dom";
import { useAuthStore } from "../zustands/useAuthStore";

interface Route {
  index?: boolean;
  path?: string;
  element: ReactElement;
  state?: string;
}

interface ProtectedRouteProps {
  children: ReactElement;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { authUser, accessToken, loading, refresh } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!accessToken && !authUser) {
        try {
          await refresh();
        } catch (error) {
          console.log("Failed to refresh token on init");
        }
      }
      setIsInitializing(false);
    };

    init();
  }, []);

  if (isInitializing || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!authUser && !accessToken) {
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
  // {
  //   element: (
  //     <ProtectedRoute>
  //       <HomePage />
  //     </ProtectedRoute>
  //   ),
  // },
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
    index: true,
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
];

export default routes;
