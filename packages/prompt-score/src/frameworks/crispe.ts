import type { FrameworkDefinition } from "../types.js";
import { detectRole } from "../detectors/role.js";
import { detectContext } from "../detectors/context.js";
import { detectTask } from "../detectors/task.js";
import { detectStyle } from "../detectors/style.js";
import { detectExample } from "../detectors/example.js";

export const CRISPE: FrameworkDefinition = {
  id: "crispe",
  name: "CRISPE",
  description: "Capacity/Role, Insight, Statement, Personality, Experiment — thorough framework for research and analysis",
  bestFor: ["research"],
  elements: [
    {
      key: "capacity",
      label: "Capacity / Role",
      weight: 1.5,
      detector: detectRole,
      suggestion: "Define the AI's capacity: \"You are an expert in [domain]\" or \"Act as a [specialist]\".",
    },
    {
      key: "insight",
      label: "Insight / Context",
      weight: 1.5,
      detector: detectContext,
      suggestion: "Provide insight/context: background information the AI needs to answer well.",
    },
    {
      key: "statement",
      label: "Statement / Task",
      weight: 2.0,
      detector: detectTask,
      suggestion: "Make a clear statement of what you want: the exact task or question.",
    },
    {
      key: "personality",
      label: "Personality / Style",
      weight: 1.0,
      detector: detectStyle,
      suggestion: "Specify personality/style: \"in a concise, academic tone\" or \"as a friendly explainer\".",
    },
    {
      key: "experiment",
      label: "Experiment / Example",
      weight: 1.0,
      detector: detectExample,
      suggestion: "Add an example or ask for variations: \"For example...\" or \"Give me 3 different approaches\".",
    },
  ],
};
