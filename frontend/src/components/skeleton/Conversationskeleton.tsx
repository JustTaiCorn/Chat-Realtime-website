export const ConversationSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="card border-none p-3 glass">
          <div className="flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="skeleton size-10 rounded-full" />

            {/* Info skeleton */}
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-3 w-3/4 rounded" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
