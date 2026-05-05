interface AllFrameworksBarProps {
  scores: Array<{ id: string; name: string; score: number; grade: string }>;
  activeId: string;
  onSelect: (id: string) => void;
}

function barColor(score: number): string {
  if (score >= 85) return "bg-green-500";
  if (score >= 70) return "bg-lime-500";
  if (score >= 55) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}

export function AllFrameworksBar({ scores, activeId, onSelect }: AllFrameworksBarProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">All Frameworks</h3>
      <div className="space-y-1.5">
        {scores.map(({ id, name, score, grade }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors ${
              activeId === id ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
          >
            <span className="text-xs text-gray-400 w-14 shrink-0">{name}</span>
            <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${barColor(score)}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-8 text-right shrink-0">{grade} {score}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
