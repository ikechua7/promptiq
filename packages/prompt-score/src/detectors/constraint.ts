import type { DetectionResult } from "../types.js";

const PATTERNS = [
  /\bonly (use|include|consider|allow|output|respond|focus)\b/i,
  /\bdo not\b/i,
  /\bdon't\b/i,
  /\bavoid\b/i,
  /\bnever\b/i,
  /\bexclude\b/i,
  /\bwithout (using|mentioning|including)\b/i,
  /\blimit (to|yourself to|the response to)\b/i,
  /\bfocus (only |specifically )?(on|around)\b/i,
  /\bstrictly\b/i,
  /\bmust (not|only|always|never)\b/i,
  /\bno (more than|longer than|mention of|use of)\b/i,
  /\bconstraint(s)?\s*:/i,
  /\brule(s)?\s*:/i,
];

export function detectConstraint(text: string): DetectionResult {
  const matches: string[] = [];
  for (const pattern of PATTERNS) {
    const match = text.match(pattern);
    if (match) matches.push(match[0]);
  }
  if (matches.length === 0) return { found: false, confidence: 0, evidence: "" };
  const confidence = Math.min(1.0, 0.7 + matches.length * 0.15);
  return { found: true, confidence, evidence: matches[0] };
}
