export const UnreadCountBadge=({unreadCount}:{unreadCount :number})=>{
    return <div className="absolute z-20 -bottom-1 -right-1">
        <div className="badge size-4 text-xs  badge-primary">
            {unreadCount > 9 ? "9+" : unreadCount}</div>
        </div>;
}