import type { Reaction } from "@/types/chat";

interface ReactionsListProps {
  reactions: Reaction[];
  onReactionClick: (emoji: string) => void;
}

export const ReactionsList = ({
  reactions,
  onReactionClick,
}: ReactionsListProps) => {
  if (!reactions || reactions.length === 0) return null;

  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, Reaction[]>);

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {Object.entries(groupedReactions).map(([emoji, reactionList]) => (
        <button
          key={emoji}
          onClick={() => onReactionClick(emoji)}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-base-300 hover:bg-base-200 rounded-full text-xs transition-colors"
          title={reactionList
            .map((r) => r.userId.fullName)
            .join(", ")}
        >
          <span>{emoji}</span>
          <span className="font-medium">{reactionList.length}</span>
        </button>
      ))}
    </div>
  );
};