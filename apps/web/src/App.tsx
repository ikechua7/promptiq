import { useState, useCallback } from "react";
import { usePromptScore } from "./hooks/usePromptScore.ts";
import { useHistory } from "./hooks/useHistory.ts";
import { ScoreRing, scoreColor } from "./components/ScoreRing.tsx";
import { FrameworkSelector } from "./components/FrameworkSelector.tsx";
import { ElementChecklist } from "./components/ElementChecklist.tsx";
import { SuggestionPanel } from "./components/SuggestionPanel.tsx";
import { AllFrameworksBar } from "./components/AllFrameworksBar.tsx";
import { HistoryPanel } from "./components/HistoryPanel.tsx";

export default function App() {
  const [text, setText] = useState("");
  const { result, allScores, selectedFramework, setSelectedFramework } = usePromptScore(text);
  const { history, addEntry, clearHistory } = useHistory();

  const handleSave = useCallback(() => {
    if (!result || !text.trim()) return;
    addEntry({
      text: text.slice(0, 120),
      score: result.score,
      grade: result.grade,
      framework: result.framework.id,
    });
  }, [result, text, addEntry]);

  const handleSelect = useCallback((t: string) => {
    setText(t);
  }, []);

  const activeFrameworkId = result?.framework.id ?? selectedFramework;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-100">Prompt Scorer</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Score your prompts against 8 frameworks before submitting
          </p>
        </div>
        <FrameworkSelector
          value={selectedFramework}
          autoDetected={result?.framework.id}
          onChange={setSelectedFramework}
        />
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden lg:flex-row flex-col">
        {/* Left: Input */}
        <div className="flex flex-col flex-1 p-6 gap-4 lg:border-r border-gray-800">
          <textarea
            className="flex-1 min-h-[240px] bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-100 text-sm leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-600"
            placeholder="Paste or type your prompt here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
          />
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{text.length} characters · {text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
            {result && (
              <button
                onClick={handleSave}
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Save to history
              </button>
            )}
          </div>

          {/* History */}
          <HistoryPanel
            history={history}
            onSelect={handleSelect}
            onClear={clearHistory}
          />
        </div>

        {/* Right: Score panel */}
        <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-6 p-6 overflow-y-auto">
          {!result ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center py-12">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center">
                <span className="text-3xl text-gray-700">?</span>
              </div>
              <p className="text-sm text-gray-600">Type a prompt to see your score</p>
            </div>
          ) : (
            <>
              {/* Score ring */}
              <div className="flex flex-col items-center gap-1">
                <div className="relative flex items-center justify-center">
                  <ScoreRing score={result.score} size={120} />
                  <div className="absolute flex flex-col items-center pointer-events-none">
                    <span className="text-3xl font-bold" style={{ color: scoreColor(result.score) }}>
                      {result.score}
                    </span>
                    <span className="text-sm font-semibold text-gray-400">{result.grade}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  {result.framework.name} · intent: {result.intent}
                </p>
              </div>

              <div className="w-full border-t border-gray-800" />

              {/* Element checklist */}
              <ElementChecklist elements={result.elements} />

              <div className="w-full border-t border-gray-800" />

              {/* Suggestions */}
              <SuggestionPanel suggestions={result.suggestions} />

              {allScores.length > 0 && (
                <>
                  <div className="w-full border-t border-gray-800" />
                  <AllFrameworksBar
                    scores={allScores}
                    activeId={activeFrameworkId}
                    onSelect={(id) => setSelectedFramework(id)}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
