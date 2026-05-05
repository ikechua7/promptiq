import type { ElementScore } from "prompt-score";

interface ElementChecklistProps {
  elements: ElementScore[];
}

export function ElementChecklist({ elements }: ElementChecklistProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Elements</h3>
      <ul className="space-y-1.5">
        {elements.map((el) => (
          <li key={el.key} className="flex items-start gap-2">
            <span className={`mt-0.5 text-base leading-none ${el.found ? "text-green-400" : "text-gray-600"}`}>
              {el.found ? "✓" : "✗"}
            </span>
            <div className="flex-1 min-w-0">
              <span className={`text-sm font-medium ${el.found ? "text-gray-200" : "text-gray-500"}`}>
                {el.label}
              </span>
              {el.found && el.evidence && (
                <p className="text-xs text-gray-600 truncate mt-0.5" title={el.evidence}>
                  "{el.evidence}"
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
