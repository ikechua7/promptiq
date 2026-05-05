import type { HistoryEntry } from "../hooks/useHistory.ts";

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelect: (text: string) => void;
  onClear: () => void;
}

function gradeColor(grade: string): string {
  const map: Record<string, string> = {
    A: "text-green-400",
    B: "text-lime-400",
    C: "text-yellow-400",
    D: "text-orange-400",
    F: "text-red-400",
  };
  return map[grade] ?? "text-gray-400";
}

export function HistoryPanel({ history, onSelect, onClear }: HistoryPanelProps) {
  if (history.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent</h3>
        <button
          onClick={onClear}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Clear
        </button>
      </div>
      <ul className="space-y-1">
        {history.map((entry) => (
          <li key={entry.id}>
            <button
              onClick={() => onSelect(entry.text)}
              className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-800 text-left transition-colors"
            >
              <span className={`text-xs font-bold shrink-0 ${gradeColor(entry.grade)}`}>
                {entry.grade}
              </span>
              <span className="text-xs text-gray-500 truncate flex-1">{entry.text}</span>
              <span className="text-xs text-gray-700 shrink-0 uppercase">{entry.framework}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
