import { useState } from "react";
import { ALL_FRAMEWORKS } from "prompt-score";
import type { PromptScore } from "prompt-score";

const TASK_OPTIONS: Array<{ value: string; label: string; framework: string }> = [
  { value: "auto",     label: "Auto-detect",          framework: "auto"   },
  { value: "creative", label: "Content Writing",       framework: "costar" },
  { value: "coding",   label: "Coding & Technical",   framework: "risen"  },
  { value: "research", label: "Research & Analysis",  framework: "crispe" },
  { value: "business", label: "Business & Strategy",  framework: "broke"  },
  { value: "quick",    label: "Quick / One-liner",    framework: "rtf"    },
  { value: "general",  label: "General Purpose",      framework: "costar" },
];

interface SidePanelProps {
  result: PromptScore;
  framework: string;
  onFrameworkChange: (id: string) => void;
  onClose: () => void;
}

function scoreColor(s: number): string {
  if (s >= 85) return "#22c55e";
  if (s >= 70) return "#84cc16";
  if (s >= 55) return "#eab308";
  if (s >= 40) return "#f97316";
  return "#ef4444";
}

const PANEL_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .panel {
    pointer-events: all;
    position: fixed;
    top: 60px;
    right: 16px;
    width: 300px;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    background: #111827;
    border: 1px solid #374151;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    font-family: system-ui, sans-serif;
    font-size: 13px;
    color: #e5e7eb;
    z-index: 99999;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    border-bottom: 1px solid #1f2937;
  }
  .title { font-weight: 700; font-size: 14px; }
  .close-btn {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    padding: 0 4px;
  }
  .close-btn:hover { color: #e5e7eb; }
  .score-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    border-bottom: 1px solid #1f2937;
  }
  .score-num { font-size: 36px; font-weight: 800; }
  .score-meta { display: flex; flex-direction: column; gap: 2px; }
  .grade { font-size: 14px; font-weight: 700; color: #9ca3af; }
  .intent { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
  .framework-desc { font-size: 12px; color: #d1d5db; line-height: 1.5; }
  .section { padding: 12px 14px; border-bottom: 1px solid #1f2937; }
  .section-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6b7280;
    margin-bottom: 8px;
  }
  .el-row { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px; }
  .check { font-size: 13px; margin-top: 1px; flex-shrink: 0; }
  .check.found { color: #22c55e; }
  .check.missing { color: #374151; }
  .el-label { font-size: 13px; font-weight: 500; }
  .el-label.missing { color: #6b7280; }
  .evidence { font-size: 11px; color: #4b5563; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .suggestion-row {
    display: flex;
    gap: 6px;
    background: #1f2937;
    border-radius: 8px;
    padding: 8px 10px;
    margin-bottom: 6px;
  }
  .arrow { color: #818cf8; font-weight: 700; flex-shrink: 0; }
  .suggestion-text { font-size: 12px; color: #d1d5db; line-height: 1.4; }
  .success-box {
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.2);
    border-radius: 8px;
    padding: 10px;
    font-size: 12px;
    color: #4ade80;
    font-weight: 500;
  }
  select {
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 6px;
    color: #e5e7eb;
    font-size: 12px;
    padding: 4px 6px;
    width: 100%;
    margin-top: 4px;
  }
  .task-bar {
    padding: 10px 14px;
    border-bottom: 1px solid #1f2937;
    background: #0f172a;
  }
  .task-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6b7280;
    margin-bottom: 5px;
  }
  .task-select {
    background: #1e293b;
    border: 1px solid #4f46e5;
    border-radius: 6px;
    color: #e5e7eb;
    font-size: 13px;
    font-weight: 600;
    padding: 6px 8px;
    width: 100%;
    cursor: pointer;
  }
`;

export function SidePanel({ result, framework, onFrameworkChange, onClose }: SidePanelProps) {
  const color = scoreColor(result.score);
  const [selectedTask, setSelectedTask] = useState("auto");

  function handleTaskChange(value: string) {
    setSelectedTask(value);
    const opt = TASK_OPTIONS.find((o) => o.value === value);
    if (opt) onFrameworkChange(opt.framework);
  }

  return (
    <>
      <style>{PANEL_STYLES}</style>
      <div className="panel">
        <div className="header">
          <span className="title">Prompt Scorer</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="task-bar">
          <div className="task-label">What are you working on?</div>
          <select
            className="task-select"
            value={selectedTask}
            onChange={(e) => handleTaskChange(e.target.value)}
          >
            {TASK_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="score-row">
          <span className="score-num" style={{ color }}>{result.score}</span>
          <div className="score-meta">
            <span className="grade">{result.grade} · {result.framework.name}</span>
            <span className="intent">intent: {result.intent}</span>
          </div>
        </div>
        <div style={{ padding: "8px 14px 12px", borderBottom: "1px solid #1f2937" }}>
          <span className="framework-desc">{result.framework.description}</span>
        </div>

        <div className="section">
          <div className="section-label">Framework</div>
          <select
            value={framework}
            onChange={(e) => onFrameworkChange(e.target.value)}
          >
            <option value="auto">Auto-detect ({result.framework.name})</option>
            {ALL_FRAMEWORKS.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        <div className="section">
          <div className="section-label">Elements</div>
          {result.elements.map((el) => (
            <div className="el-row" key={el.key}>
              <span className={`check ${el.found ? "found" : "missing"}`}>
                {el.found ? "✓" : "✗"}
              </span>
              <div>
                <div className={`el-label ${el.found ? "" : "missing"}`}>{el.label}</div>
                {el.found && el.evidence && (
                  <div className="evidence">"{el.evidence}"</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="section">
          <div className="section-label">
            {result.suggestions.length === 0 ? "Status" : `Suggestions (${result.suggestions.length})`}
          </div>
          {result.suggestions.length === 0 ? (
            <div className="success-box">Strong prompt — all elements present.</div>
          ) : (
            result.suggestions.map((s, i) => (
              <div className="suggestion-row" key={i}>
                <span className="arrow">→</span>
                <span className="suggestion-text">{s}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
