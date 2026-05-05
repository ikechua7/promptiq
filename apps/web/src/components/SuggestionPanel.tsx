interface SuggestionPanelProps {
  suggestions: string[];
}

export function SuggestionPanel({ suggestions }: SuggestionPanelProps) {
  if (suggestions.length === 0) {
    return (
      <div className="rounded-lg bg-green-900/20 border border-green-800/40 px-4 py-3">
        <p className="text-sm text-green-400 font-medium">Strong prompt — all elements present.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Suggestions ({suggestions.length})
      </h3>
      <ul className="space-y-2">
        {suggestions.map((s, i) => (
          <li key={i} className="flex gap-2 rounded-lg bg-gray-800/60 px-3 py-2.5">
            <span className="text-indigo-400 font-bold text-sm mt-0.5">→</span>
            <p className="text-sm text-gray-300 leading-snug">{s}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
