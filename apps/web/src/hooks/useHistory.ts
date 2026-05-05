import { useState, useCallback } from "react";

export interface HistoryEntry {
  id: string;
  text: string;
  score: number;
  grade: string;
  framework: string;
  timestamp: number;
}

const STORAGE_KEY = "prompt-scorer-history";
const MAX_ENTRIES = 10;

function load(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(entries: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(load);

  const addEntry = useCallback((entry: Omit<HistoryEntry, "id" | "timestamp">) => {
    setHistory((prev) => {
      const next = [
        { ...entry, id: crypto.randomUUID(), timestamp: Date.now() },
        ...prev,
      ].slice(0, MAX_ENTRIES);
      save(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addEntry, clearHistory };
}
