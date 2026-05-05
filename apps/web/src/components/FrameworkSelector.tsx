import { ALL_FRAMEWORKS } from "prompt-score";

interface FrameworkSelectorProps {
  value: string;
  autoDetected?: string;
  onChange: (id: string) => void;
}

export function FrameworkSelector({ value, autoDetected, onChange }: FrameworkSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
        Framework
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 border border-gray-700 rounded-md text-sm px-2 py-1 text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="auto">
          Auto-detect{autoDetected ? ` (${autoDetected.toUpperCase()})` : ""}
        </option>
        {ALL_FRAMEWORKS.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name} — {f.description.split(" — ")[0]}
          </option>
        ))}
      </select>
    </div>
  );
}
