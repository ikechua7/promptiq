import type { DetectionResult } from "../types.js";

const PATTERNS = [
  /\bthe goal is\b/i,
  /\bmy goal is\b/i,
  /\bi want (to|the)\b/i,
  /\bi need (to|the|a|an)\b/i,
  /\bthe (result|output|response|answer) should\b/i,
  /\bthe (end|final|desired|expected) (result|outcome|goal|output)\b/i,
  /\bso that\b/i,
  /\bin order to\b/i,
  /\bthe purpose (is|of this)\b/i,
  /\bultimately\b/i,
  /\bby the end\b/i,
  /\bwhat i('m| am) trying to\b/i,
  /\bthe objective is\b/i,
];

export function detectGoal(text: string): DetectionResult {
  const matches: string[] = [];
  for (const pattern of PATTERNS) {
    const match = text.match(pattern);
    if (match) matches.push(match[0]);
  }
  if (matches.length === 0) return { found: false, confidence: 0, evidence: "" };
  const confidence = matches.length >= 2 ? 1.0 : 0.8;
  return { found: true, confidence, evidence: matches[0] };
}
