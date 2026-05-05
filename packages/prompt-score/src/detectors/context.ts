import type { DetectionResult } from "../types.js";

const PATTERNS = [
  /\bgiven that\b/i,
  /\bbackground\s*:/i,
  /\bin this (scenario|situation|context|case)\b/i,
  /\bthe context is\b/i,
  /\bfor context\b/i,
  /\bhere('s| is) (the |some )?(context|background|situation)\b/i,
  /\bwe('re| are) (working on|building|developing|creating)\b/i,
  /\bour (company|team|project|app|system|product)\b/i,
  /\bcurrently\b.{0,60}(working|using|building|running)/i,
  /\bthe (problem|challenge|issue|goal) (is|we have)\b/i,
];

export function detectContext(text: string): DetectionResult {
  const matches: string[] = [];
  for (const pattern of PATTERNS) {
    const match = text.match(pattern);
    if (match) matches.push(match[0]);
  }
  if (matches.length === 0) return { found: false, confidence: 0, evidence: "" };
  const confidence = Math.min(1.0, 0.7 + matches.length * 0.1);
  return { found: true, confidence, evidence: matches[0] };
}
