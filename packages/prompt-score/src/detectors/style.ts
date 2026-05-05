import type { DetectionResult } from "../types.js";

const PATTERNS = [
  /\bwrite in (a |an )?(formal|informal|casual|professional|conversational|academic|technical|friendly|humorous|serious|persuasive|authoritative)\b/i,
  /\btone\s*:/i,
  /\bstyle\s*:/i,
  /\bin (a |an )?(formal|informal|casual|professional|conversational|friendly|humorous|serious|technical|academic) (tone|style|voice|manner|way)\b/i,
  /\bsound (like|as if)\b/i,
  /\bin the style of\b/i,
  /\bwith (a |an )?(warm|confident|empathetic|authoritative|playful|witty|direct|engaging) (tone|voice)\b/i,
  /\bkeep (it|the tone) (upbeat|positive|neutral|serious|light)\b/i,
];

export function detectStyle(text: string): DetectionResult {
  for (const pattern of PATTERNS) {
    const match = text.match(pattern);
    if (match) return { found: true, confidence: 1.0, evidence: match[0] };
  }
  return { found: false, confidence: 0, evidence: "" };
}
