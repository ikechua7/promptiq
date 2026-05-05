import type { FrameworkDefinition } from "../types.js";
import { detectContext } from "../detectors/context.js";
import { detectTask } from "../detectors/task.js";
import { detectStyle } from "../detectors/style.js";
import { detectAudience } from "../detectors/audience.js";
import { detectFormat } from "../detectors/format.js";

export const COSTAR: FrameworkDefinition = {
  id: "costar",
  name: "COSTAR",
  description: "Context, Objective, Style, Tone, Audience, Response — comprehensive framework for detailed prompts",
  bestFor: ["creative", "general"],
  elements: [
    {
      key: "context",
      label: "Context",
      weight: 1.5,
      detector: detectContext,
      suggestion: "Add background: explain the situation, project, or problem (e.g. \"We are building a SaaS app for...\").",
    },
    {
      key: "objective",
      label: "Objective",
      weight: 2.0,
      detector: detectTask,
      suggestion: "State a clear action verb at the start: Write, Analyze, Create, Summarize, etc.",
    },
    {
      key: "style",
      label: "Style",
      weight: 1.0,
      detector: detectStyle,
      suggestion: "Specify a writing style (e.g. \"Write in a professional tone\" or \"Keep it casual\").",
    },
    {
      key: "tone",
      label: "Tone",
      weight: 1.0,
      detector: detectStyle,
      suggestion: "Add a tone directive: formal, conversational, empathetic, authoritative, etc.",
    },
    {
      key: "audience",
      label: "Audience",
      weight: 1.5,
      detector: detectAudience,
      suggestion: "Specify who this is for (e.g. \"for a non-technical executive\" or \"for a senior developer\").",
    },
    {
      key: "response",
      label: "Response Format",
      weight: 1.5,
      detector: detectFormat,
      suggestion: "Specify the output format: bullet points, numbered list, JSON, a short paragraph, etc.",
    },
  ],
};
