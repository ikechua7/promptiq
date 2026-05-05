import { useState, useEffect, useRef } from "react";
import { score, scoreAllFrameworks } from "prompt-score";
import type { PromptScore } from "prompt-score";

interface AllFrameworkScore {
  id: string;
  name: string;
  score: number;
  grade: string;
}

interface UsePromptScoreReturn {
  result: PromptScore | null;
  allScores: AllFrameworkScore[];
  selectedFramework: string;
  setSelectedFramework: (id: string) => void;
}

export function usePromptScore(text: string): UsePromptScoreReturn {
  const [result, setResult] = useState<PromptScore | null>(null);
  const [allScores, setAllScores] = useState<AllFrameworkScore[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>("auto");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!text.trim()) {
      setResult(null);
      setAllScores([]);
      return;
    }

    timerRef.current = setTimeout(() => {
      const r = score(text, selectedFramework);
      setResult(r);

      const all = scoreAllFrameworks(text).map(({ framework, score: s, grade }) => ({
        id: framework.id,
        name: framework.name,
        score: s,
        grade,
      }));
      setAllScores(all);
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, selectedFramework]);

  return { result, allScores, selectedFramework, setSelectedFramework };
}
