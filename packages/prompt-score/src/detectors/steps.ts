import type { DetectionResult } from "../types.js";

const NUMBERED_LIST = /^\s*\d+[\.\)]\s+\S/m;
const SEQUENTIAL_WORDS = /\b(first|second|third|then|next|after that|finally|lastly|step \d+)\b/i;
const STEP_LABEL = /\bstep[- ]?\d+\b|\bphase \d+\b/i;
const PROCESS_WORDS = /\b(process|workflow|procedure|steps?|instructions?)\b/i;

export function detectSteps(text: string): DetectionResult {
  if (NUMBERED_LIST.test(text)) {
    return { found: true, confidence: 1.0, evidence: "numbered list" };
  }

  const seqMatch = text.match(SEQUENTIAL_WORDS);
  if (seqMatch) {
    const stepMatch = text.match(STEP_LABEL);
    const confidence = stepMatch ? 1.0 : 0.8;
    return { found: true, confidence, evidence: seqMatch[0] };
  }

  const procMatch = text.match(PROCESS_WORDS);
  if (procMatch) {
    return { found: true, confidence: 0.6, evidence: procMatch[0] };
  }

  return { found: false, confidence: 0, evidence: "" };
}
