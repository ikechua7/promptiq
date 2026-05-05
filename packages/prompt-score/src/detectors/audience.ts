import type { DetectionResult } from "../types.js";

const PATTERNS = [
  /\bfor (a |an )?(beginner|novice|junior|senior|expert|professional|developer|designer|manager|executive|student|child|non-technical|technical)\b/i,
  /\bfor (my |our )?(team|company|client|audience|users?|readers?|stakeholders?|boss|manager)\b/i,
  // role-based audiences (founder, CTO, PM, etc.)
  /\bfor (a |an )?(founder|cto|ceo|vp|director|product manager|product leader|engineer|marketer|investor|recruiter)\b/i,
  // "suitable for X" / "appropriate for X"
  /\b(suitable|appropriate|tailored|written) for\b/i,
  // "X audience" — any word before "audience"
  /\b\w+ audience\b/i,
  /\bfamiliar with\b/i,
  /\bwho (knows?|understand?s?|has?|doesn'?t know)\b/i,
  /\btargeted? (at|to|for|toward)\b/i,
  /\bintended for\b/i,
  /\baudience (is|are|includes?|consists? of)\b/i,
  /\bsomeone who\b/i,
  /\bassum(e|ing) (the reader|they|the user|my audience)\b/i,
  // "hand to X" / "share with X" — implies audience
  /\bhand (it |this )?(to|directly to)\b/i,
  /\b(share|present|deliver|send) (it |this )?(to|with)\b/i,
];

export function detectAudience(text: string): DetectionResult {
  for (const pattern of PATTERNS) {
    const match = text.match(pattern);
    if (match) return { found: true, confidence: 1.0, evidence: match[0] };
  }
  return { found: false, confidence: 0, evidence: "" };
}
