import type { PromptIntent } from "./types.js";

const CODE_KEYWORDS = /\b(code|function|class|bug|error|debug|refactor|api|database|sql|python|javascript|typescript|react|node|algorithm|implement|deploy|git|test|unittest)\b/i;
const CREATIVE_KEYWORDS = /\b(write|poem|story|essay|blog|creative|fiction|narrative|character|plot|novel|script|song|lyrics|art|design|creative writing)\b/i;
const BUSINESS_KEYWORDS = /\b(business|strategy|marketing|sales|revenue|stakeholder|executive|investor|report|proposal|roadmap|okr|kpi|quarterly|budget|product|launch)\b/i;
const RESEARCH_KEYWORDS = /\b(research|analyze|analyse|study|compare|literature|review|academic|paper|findings|data|survey|evidence|hypothesis)\b/i;

export function classifyIntent(text: string): PromptIntent {
  const lower = text.toLowerCase();
  const wordCount = lower.split(/\s+/).length;

  if (wordCount < 15) return "quick";

  const scores: Record<PromptIntent, number> = {
    coding: (lower.match(CODE_KEYWORDS) || []).length,
    creative: (lower.match(CREATIVE_KEYWORDS) || []).length,
    business: (lower.match(BUSINESS_KEYWORDS) || []).length,
    research: (lower.match(RESEARCH_KEYWORDS) || []).length,
    quick: 0,
    general: 0,
  };

  const top = (Object.entries(scores) as [PromptIntent, number][])
    .filter(([k]) => k !== "quick" && k !== "general")
    .sort(([, a], [, b]) => b - a)[0];

  return top && top[1] > 0 ? top[0] : "general";
}
