import { MessageSquare, Users, Compass, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/zustands/useChatStore";

const navItems = [
  { icon: MessageSquare, label: "Chat", path: "/" },
  { icon: Users, label: "Bạn bè", path: "/friends" },
  { icon: Settings, label: "Cài đặt", path: "/settings" },
];

export default function BottomNav() {
  const location = useLocation();
  const { activeConversationId } = useChatStore();
  if (activeConversationId && location.pathname === "/") return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-base-100 border-t border-base-300 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-base-content/50 hover:text-base-content/80",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
