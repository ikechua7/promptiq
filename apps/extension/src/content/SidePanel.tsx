import { useState } from "react";
import { ALL_FRAMEWORKS } from "prompt-score";
import type { PromptScore, ElementScore } from "prompt-score";

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
  getText: () => string;
  onSetText: (text: string) => void;
}

// Placeholder map for every element key across all 8 frameworks
const PLACEHOLDERS: Record<string, { prefix?: string; suffix?: string }> = {
  role:         { prefix: "You are a [role, e.g. senior consultant / expert developer]." },
  capacity:     { prefix: "You are acting as a [capacity, e.g. research analyst / domain expert]." },
  background:   { suffix: "Background: [describe the project, situation, or problem]." },
  context:      { suffix: "Context: [describe the relevant background or situation]." },
  objective:    { suffix: "Objective: [state clearly what you want to achieve]." },
  objectives:   { suffix: "Objectives: [list what you want to achieve]." },
  task:         { suffix: "[Describe the specific task you want done]." },
  action:       { suffix: "Action: [describe the specific action to take]." },
  instructions: { suffix: "Instructions: [provide specific step-by-step instructions]." },
  steps:        { suffix: "Please approach this step by step: First... Then... Finally..." },
  format:       { suffix: "Format the response as [bullet points / numbered list / table / paragraph]." },
  response:     { suffix: "Respond in [format, e.g. a structured report with headings]." },
  style:        { suffix: "Write in a [formal / conversational / technical] style." },
  tone:         { suffix: "Use a [professional / empathetic / authoritative] tone." },
  audience:     { suffix: "This is for [your audience, e.g. a non-technical executive / beginner]." },
  personality:  { suffix: "Adopt the personality of [e.g. a patient teacher / direct advisor]." },
  goal:         { suffix: "The goal is to [describe the desired outcome]." },
  endGoal:      { suffix: "End goal: [what success looks like for this task]." },
  keyResults:   { suffix: "Key results expected: [list measurable outcomes]." },
  purpose:      { suffix: "Purpose: [explain why this is needed and what it will be used for]." },
  insight:      { suffix: "Key insight: [share any relevant domain knowledge or context]." },
  statement:    { suffix: "Problem statement: [clearly define what needs to be solved]." },
  expectation:  { suffix: "Expected output: [describe exactly what you expect to receive]." },
  result:       { suffix: "Desired result: [describe what a successful outcome looks like]." },
  example:      { suffix: "For example: [provide a concrete example of what you mean]." },
  experiment:   { suffix: "Experiment with: [describe variations or approaches to try]." },
  evolve:       { suffix: "To iterate: [describe how you would like this refined over time]." },
  narrowing:    { suffix: "Focus specifically on: [narrow the scope — what to include and exclude]." },
  constraint:   { suffix: "Constraints: [e.g. under 200 words / avoid jargon / no code examples]." },
};

// ── Platform adapters ────────────────────────────────────────────────────────

function getVal(elements: ElementScore[], key: string, placeholder: string): string {
  const el = elements.find((e) => e.key === key);
  return el?.found && el.evidence ? el.evidence : placeholder;
}

function adaptForClaude(text: string, elements: ElementScore[]): string {
  const role     = getVal(elements, "role",     "[your role, e.g. senior analyst]");
  const context  = getVal(elements, "context",  "[background or situation]");
  const audience = getVal(elements, "audience", "[target audience]");
  const format   = getVal(elements, "format",   "[bullet points / report / table]");
  const tone     = getVal(elements, "tone",     "[professional / conversational]");

  return `<role>${role}</role>

<context>
${context}
</context>

<task>
${text.trim()}
</task>

<audience>${audience}</audience>
<format>${format}</format>
<tone>${tone}</tone>`;
}

function adaptForChatGPT(text: string, elements: ElementScore[]): string {
  const role     = getVal(elements, "role",     "[role, e.g. expert consultant]");
  const audience = getVal(elements, "audience", "[target audience]");
  const format   = getVal(elements, "format",   "[bullet points / paragraphs]");
  const tone     = getVal(elements, "tone",     "[professional / casual]");
  const goal     = getVal(elements, "goal",     "[describe the desired outcome]");

  return `Act as a ${role}.

**Task:** ${text.trim()}

**Goal:** ${goal}
**Audience:** ${audience}
**Format:** ${format}
**Tone:** ${tone}`;
}

function adaptForGemini(text: string, elements: ElementScore[]): string {
  const roleEl   = elements.find((e) => e.key === "role");
  const audience = getVal(elements, "audience", "[target audience]");
  const format   = getVal(elements, "format",   "[bullet points / short paragraphs]");
  const tone     = getVal(elements, "tone",     "[professional / conversational]");

  let out = "";
  if (roleEl?.found && roleEl.evidence) out += `You are ${roleEl.evidence}.\n\n`;
  out += `${text.trim()}\n\nPlease ensure:\n- Written for ${audience}\n- Formatted as ${format}\n- Tone: ${tone}`;
  return out;
}

// ── Prompt builder ───────────────────────────────────────────────────────────

function buildImprovedPrompt(originalText: string, missingKeys: string[]): string {
  const prefixes: string[] = [];
  const suffixes: string[] = [];

  for (const key of missingKeys) {
    const p = PLACEHOLDERS[key];
    if (!p) continue;
    if (p.prefix) prefixes.push(p.prefix);
    if (p.suffix) suffixes.push(p.suffix);
  }

  const parts: string[] = [];
  if (prefixes.length) parts.push(prefixes.join("\n"));
  parts.push(originalText.trim());
  if (suffixes.length) parts.push(suffixes.join("\n"));

  return parts.join("\n\n");
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
  .fix-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 10px;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: opacity 0.15s;
  }
  .fix-btn:hover { opacity: 0.9; }
  .fix-btn:active { opacity: 0.8; }
  .fix-done {
    background: rgba(34,197,94,0.12);
    border: 1px solid rgba(34,197,94,0.3);
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 12px;
    color: #4ade80;
    font-weight: 600;
    text-align: center;
  }
  .platform-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 6px;
  }
  .platform-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 4px;
    border: 1px solid #374151;
    border-radius: 8px;
    background: #1f2937;
    color: #e5e7eb;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
    line-height: 1.2;
  }
  .platform-btn:hover { border-color: #6b7280; background: #374151; }
  .platform-btn .pb-icon { font-size: 16px; }
  .platform-btn.claude  { border-color: #d97706; }
  .platform-btn.claude:hover  { background: rgba(217,119,6,0.15); }
  .platform-btn.chatgpt { border-color: #10b981; }
  .platform-btn.chatgpt:hover { background: rgba(16,185,129,0.15); }
  .platform-btn.gemini  { border-color: #3b82f6; }
  .platform-btn.gemini:hover  { background: rgba(59,130,246,0.15); }
  .adapt-done {
    background: rgba(34,197,94,0.12);
    border: 1px solid rgba(34,197,94,0.3);
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 12px;
    color: #4ade80;
    font-weight: 600;
    text-align: center;
  }
`;

export function SidePanel({ result, framework, onFrameworkChange, onClose, getText, onSetText }: SidePanelProps) {
  const color = scoreColor(result.score);
  const [selectedTask, setSelectedTask] = useState("auto");
  const [fixed, setFixed] = useState(false);
  const [adaptedPlatform, setAdaptedPlatform] = useState<string | null>(null);

  function handleAdapt(platform: "claude" | "chatgpt" | "gemini") {
    const original = getText();
    const els = result.elements;
    let adapted = "";
    if (platform === "claude")   adapted = adaptForClaude(original, els);
    if (platform === "chatgpt")  adapted = adaptForChatGPT(original, els);
    if (platform === "gemini")   adapted = adaptForGemini(original, els);
    onSetText(adapted);
    setAdaptedPlatform(platform);
    setTimeout(() => setAdaptedPlatform(null), 3000);
  }

  function handleFix() {
    const original = getText();
    const missingKeys = result.elements.filter((e) => !e.found).map((e) => e.key);
    const improved = buildImprovedPrompt(original, missingKeys);
    onSetText(improved);
    setFixed(true);
    setTimeout(() => setFixed(false), 3000);
  }

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

        {result.score < 85 && result.elements.some((e) => !e.found) && (
          <div className="section">
            {fixed ? (
              <div className="fix-done">✓ Prompt updated — fill in the [brackets]</div>
            ) : (
              <button className="fix-btn" onClick={handleFix}>
                ✦ Fix My Prompt
              </button>
            )}
          </div>
        )}

        <div className="section">
          <div className="section-label">Adapt for Platform</div>
          {adaptedPlatform ? (
            <div className="adapt-done">
              ✓ Adapted for {adaptedPlatform === "chatgpt" ? "ChatGPT" : adaptedPlatform.charAt(0).toUpperCase() + adaptedPlatform.slice(1)} — review &amp; send
            </div>
          ) : (
            <div className="platform-grid">
              <button className="platform-btn claude" onClick={() => handleAdapt("claude")}>
                <span className="pb-icon">🟠</span>Claude
              </button>
              <button className="platform-btn chatgpt" onClick={() => handleAdapt("chatgpt")}>
                <span className="pb-icon">🟢</span>ChatGPT
              </button>
              <button className="platform-btn gemini" onClick={() => handleAdapt("gemini")}>
                <span className="pb-icon">🔵</span>Gemini
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
