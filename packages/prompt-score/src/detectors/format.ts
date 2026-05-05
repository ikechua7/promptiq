import type { DetectionResult } from "../types.js";

const PATTERNS = [
  /\brespond in\b/i,
  /\bformat (as|it as|your response as|the output as)\b/i,
  /\buse (bullet points?|numbered list|markdown|json|xml|csv|table|headers?)\b/i,
  /\breturn (json|xml|csv|a list|an array|a table|markdown)\b/i,
  /\boutput (as|in|should be)\b/i,
  /\bin (json|xml|markdown|plain text|html|yaml) format\b/i,
  /\bstructure (your|the) (response|output|answer)\b/i,
  /\bprovide (a|your) (list|table|summary|outline|report|breakdown)\b/i,
  /\bkeep (it|your response|the output) (short|concise|brief|under \d+)\b/i,
  /\bno more than \d+ (words?|sentences?|paragraphs?|lines?|items?)\b/i,
  /\bin \d+ (words?|sentences?|bullet points?|steps?)\b/i,
];

export function detectFormat(text: string): DetectionResult {
  for (const pattern of PATTERNS) {
    const match = text.match(pattern);
    if (match) return { found: true, confidence: 1.0, evidence: match[0] };
  }
  return { found: false, confidence: 0, evidence: "" };
}
