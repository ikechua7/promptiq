import { useState, useEffect, useRef } from "react";
import { score } from "prompt-score";
import type { PromptScore } from "prompt-score";
import { SidePanel } from "./SidePanel.tsx";

interface FloatingBadgeProps {
  getText: () => string;
  setText: (text: string) => void;
}

function gradeColor(s: number): string {
  if (s >= 85) return "#22c55e";
  if (s >= 70) return "#84cc16";
  if (s >= 55) return "#eab308";
  if (s >= 40) return "#f97316";
  return "#ef4444";
}

const BASE_STYLES = `
  * { box-sizing: border-box; }
  .badge {
    pointer-events: all;
    display: flex;
    align-items: center;
    gap: 4px;
    background: #111827;
    border: 1px solid #374151;
    border-radius: 999px;
    padding: 3px 8px 3px 4px;
    cursor: pointer;
    font-family: system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    transition: transform 0.15s;
    user-select: none;
  }
  .badge:hover { transform: scale(1.05); }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

export function FloatingBadge({ getText, setText }: FloatingBadgeProps) {
  const [result, setResult] = useState<PromptScore | null>(null);
  const [open, setOpen] = useState(false);
  const [framework, setFramework] = useState("auto");
  const lastTextRef = useRef<string>("");
  const hasAutoOpenedRef = useRef(false);

  useEffect(() => {
    function check() {
      const text = getText().trim();
      if (text === lastTextRef.current) return;
      lastTextRef.current = text;
      if (!text) { setResult(null); hasAutoOpenedRef.current = false; return; }
      if (!hasAutoOpenedRef.current) {
        hasAutoOpenedRef.current = true;
        setOpen(true);
      }
      setResult(score(text, framework));
    }

    // Poll every 300ms — catches paste, programmatic changes, SPA navigation
    const interval = setInterval(check, 300);

    // Force immediate recheck on these events — no debounce needed
    document.addEventListener("input", check, true);
    document.addEventListener("keyup", check, true);
    document.addEventListener("paste", () => setTimeout(check, 50), true);
    document.addEventListener("focusin", check, true);

    return () => {
      clearInterval(interval);
      document.removeEventListener("input", check, true);
      document.removeEventListener("keyup", check, true);
      document.removeEventListener("focusin", check, true);
    };
  }, [getText, framework]);

  if (!result) return null;

  const color = gradeColor(result.score);

  return (
    <>
      <style>{BASE_STYLES}</style>
      <div
        className="badge"
        onClick={() => setOpen((o) => !o)}
        title={`Prompt score: ${result.score}/100 (${result.grade}) — ${result.framework.name}`}
      >
        <div className="dot" style={{ background: color }} />
        <span style={{ color }}>{result.score}</span>
        <span style={{ color: "#9ca3af" }}>{result.grade}</span>
      </div>
      {open && (
        <SidePanel
          result={result}
          framework={framework}
          onFrameworkChange={setFramework}
          onClose={() => setOpen(false)}
          getText={getText}
          onSetText={setText}
        />
      )}
    </>
  );
}
