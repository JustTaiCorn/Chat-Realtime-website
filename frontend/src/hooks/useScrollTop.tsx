import { useEffect } from "react";
import type { ReactNode } from "react";

interface ScrollToTopProps {
  children: ReactNode;
}

export const ScrollToTop = ({ children }: ScrollToTopProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return children;
};
