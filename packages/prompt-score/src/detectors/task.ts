import type { DetectionResult } from "../types.js";

const LEADING_VERBS =
  /^(write|create|generate|build|make|draft|design|analyze|analyse|summarize|summarise|explain|describe|compare|review|evaluate|assess|suggest|recommend|list|outline|plan|develop|implement|fix|debug|refactor|translate|convert|extract|identify|find|help|show|provide|give)\b/i;

const INLINE_VERBS =
  /\b(write|create|generate|build|make|draft|design|analyze|analyse|summarize|summarise|explain|describe|compare|review|evaluate|assess|suggest|recommend|list|outline|plan|develop|implement|fix|debug|refactor|translate|convert|extract|identify)\b/i;

export function detectTask(text: string): DetectionResult {
  const trimmed = text.trim();

  const leadMatch = trimmed.match(LEADING_VERBS);
  if (leadMatch) {
    return { found: true, confidence: 1.0, evidence: leadMatch[0] };
  }

  const inlineMatch = trimmed.match(INLINE_VERBS);
  if (inlineMatch) {
    return { found: true, confidence: 0.8, evidence: inlineMatch[0] };
  }

  // Implicit task: question form
  if (/^(what|how|why|when|where|who|which|can you|could you|would you|please)\b/i.test(trimmed)) {
    return { found: true, confidence: 0.6, evidence: trimmed.split(/\s+/).slice(0, 3).join(" ") };
  }

  return { found: false, confidence: 0, evidence: "" };
}
