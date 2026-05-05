import type { FrameworkDefinition } from "../types.js";
import { detectContext } from "../detectors/context.js";
import { detectTask } from "../detectors/task.js";
import { detectGoal } from "../detectors/goal.js";
import { detectExample } from "../detectors/example.js";

export const CARE: FrameworkDefinition = {
  id: "care",
  name: "CARE",
  description: "Context, Action, Result, Example — great for business and outcome-driven prompts",
  bestFor: ["business"],
  elements: [
    {
      key: "context",
      label: "Context",
      weight: 1.5,
      detector: detectContext,
      suggestion: "Set the scene: describe the situation, project, or background information.",
    },
    {
      key: "action",
      label: "Action",
      weight: 2.0,
      detector: detectTask,
      suggestion: "Specify the action with a clear verb: Write, Create, Draft, Analyze, etc.",
    },
    {
      key: "result",
      label: "Result",
      weight: 2.0,
      detector: detectGoal,
      suggestion: "Define the desired result: \"The result should be...\", \"I want to achieve...\"",
    },
    {
      key: "example",
      label: "Example",
      weight: 1.0,
      detector: detectExample,
      suggestion: "Provide an example to anchor expectations: \"For example...\" or a sample input/output.",
    },
  ],
};
