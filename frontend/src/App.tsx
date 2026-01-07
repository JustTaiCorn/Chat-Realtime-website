import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/layouts/Mainlayout";
import { Suspense, useEffect } from "react";
import Loading from "./components/common/Loading";
import { ToastContainer } from "react-toastify";
import routes from "./routes/routes";
import { ScrollToTop } from "./hooks/useScrollTop.tsx";
import { useAuthStore } from "./zustands/useAuthStore";
import {useThemeStore} from "./zustands/useThemeStore.ts";

const queryClient = new QueryClient();

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth && !authUser) {
    return <Loading />;
  }
  return (
    <>
      <div data-theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
        />
        <Suspense fallback={<Loading />}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                {routes.map((route, index) =>
                  route.index ? (
                    <Route
                      index
                      key={index}
                      element={<ScrollToTop>{route.element}</ScrollToTop>}
                    />
                  ) : (
                    <Route
                      path={route.path}
                      key={index}
                      element={<ScrollToTop>{route.element}</ScrollToTop>}
                    />
                  )
                )}
              </Route>
            </Routes>
          </BrowserRouter>
        </Suspense>
      </QueryClientProvider>
      </div>
    </>
  );
}

export default App;
