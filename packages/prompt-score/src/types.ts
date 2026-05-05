export type PromptIntent =
  | "coding"
  | "creative"
  | "business"
  | "research"
  | "quick"
  | "general";

export interface DetectionResult {
  found: boolean;
  confidence: number; // 0.0–1.0
  evidence: string;   // matched substring(s) for highlighting
}

export interface FrameworkElement {
  key: string;
  label: string;
  weight: number;
  detector: (text: string) => DetectionResult;
  suggestion: string; // shown when element is missing
}

export interface FrameworkDefinition {
  id: string;
  name: string;
  description: string;
  bestFor: PromptIntent[];
  elements: FrameworkElement[];
}

export interface ElementScore {
  key: string;
  label: string;
  found: boolean;
  confidence: number;
  evidence: string;
  suggestion: string;
}

export interface PromptScore {
  score: number;        // 0–100
  grade: "A" | "B" | "C" | "D" | "F";
  framework: FrameworkDefinition;
  intent: PromptIntent;
  elements: ElementScore[];
  suggestions: string[]; // ordered by impact (highest weight missing first)
}
