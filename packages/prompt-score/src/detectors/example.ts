import type { DetectionResult } from "../types.js";

const PATTERNS = [
  /\bfor example\b/i,
  /\bhere'?s? an? example\b/i,
  /\bfor instance\b/i,
  /\bsuch as\b/i,
  /\be\.g\./i,
  /\blike this\b/i,
  /\bsample (input|output|data|text|code)\b/i,
  /\bexample (input|output|prompt|response|usage)\b/i,
  /\binput\s*:\s*\S/i,
  /\boutput\s*:\s*\S/i,
];

const CODE_FENCE = /```[\s\S]{5,}/;

export function detectExample(text: string): DetectionResult {
  if (CODE_FENCE.test(text)) {
    return { found: true, confidence: 1.0, evidence: "code block" };
  }
  for (const pattern of PATTERNS) {
    const match = text.match(pattern);
    if (match) return { found: true, confidence: 0.9, evidence: match[0] };
  }
  return { found: false, confidence: 0, evidence: "" };
}
