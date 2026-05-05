import type {
  FrameworkDefinition,
  PromptIntent,
  PromptScore,
  ElementScore,
} from "./types.js";
import { ALL_FRAMEWORKS } from "./frameworks/index.js";
import { classifyIntent } from "./classifier.js";

function gradeFromScore(score: number): PromptScore["grade"] {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

function pickFramework(intent: PromptIntent): FrameworkDefinition {
  const map: Record<PromptIntent, string> = {
    coding: "risen",
    creative: "costar",
    business: "broke",
    research: "crispe",
    quick: "rtf",
    general: "costar",
  };
  return ALL_FRAMEWORKS.find((f) => f.id === map[intent]) ?? ALL_FRAMEWORKS[0];
}

export function score(
  text: string,
  frameworkId: string | "auto" = "auto"
): PromptScore {
  const intent = classifyIntent(text);

  const framework =
    frameworkId === "auto"
      ? pickFramework(intent)
      : (ALL_FRAMEWORKS.find((f) => f.id === frameworkId) ?? pickFramework(intent));

  let weightedSum = 0;
  let totalWeight = 0;

  const elements: ElementScore[] = framework.elements.map((el) => {
    const result = el.detector(text);
    weightedSum += result.confidence * el.weight;
    totalWeight += el.weight;
    return {
      key: el.key,
      label: el.label,
      found: result.found,
      confidence: result.confidence,
      evidence: result.evidence,
      suggestion: el.suggestion,
    };
  });

  const rawScore = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
  const finalScore = Math.round(Math.min(100, Math.max(0, rawScore)));

  const suggestions = elements
    .filter((e) => !e.found)
    .sort((a, b) => {
      const wa = framework.elements.find((el) => el.key === a.key)?.weight ?? 1;
      const wb = framework.elements.find((el) => el.key === b.key)?.weight ?? 1;
      return wb - wa;
    })
    .map((e) => e.suggestion);

  return {
    score: finalScore,
    grade: gradeFromScore(finalScore),
    framework,
    intent,
    elements,
    suggestions,
  };
}

export function scoreAllFrameworks(text: string): Array<{ framework: FrameworkDefinition; score: number; grade: PromptScore["grade"] }> {
  return ALL_FRAMEWORKS.map((f) => {
    const result = score(text, f.id);
    return { framework: f, score: result.score, grade: result.grade };
  });
}
