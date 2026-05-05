import type { DetectionResult } from "../types.js";

const PATTERNS = [
  /\bact as\b/i,
  /\byou are (a|an|the)\b/i,
  /\bas an? (expert|specialist|professional|senior|experienced|skilled)\b/i,
  /\bpretend (you are|to be)\b/i,
  /\btake on the role\b/i,
  /\bimagine you('re| are)\b/i,
  /\byour role is\b/i,
  /\bposing as\b/i,
];

export function detectRole(text: string): DetectionResult {
  for (const pattern of PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      // Higher confidence if role is in first 100 chars (frameworks recommend leading with role)
      const position = match.index ?? 0;
      const confidence = position < 100 ? 1.0 : 0.8;
      return { found: true, confidence, evidence: match[0] };
    }
  }
  return { found: false, confidence: 0, evidence: "" };
}
