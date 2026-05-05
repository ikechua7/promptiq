import type { FrameworkDefinition } from "../types.js";
import { detectTask } from "../detectors/task.js";
import { detectGoal } from "../detectors/goal.js";
import { detectFormat } from "../detectors/format.js";

export const APE: FrameworkDefinition = {
  id: "ape",
  name: "APE",
  description: "Action, Purpose, Expectation — streamlined framework for analysis and explanation prompts",
  bestFor: ["research", "quick"],
  elements: [
    {
      key: "action",
      label: "Action",
      weight: 2.0,
      detector: detectTask,
      suggestion: "Lead with a clear action verb: Analyze, Explain, Compare, Evaluate, Describe.",
    },
    {
      key: "purpose",
      label: "Purpose",
      weight: 2.0,
      detector: detectGoal,
      suggestion: "State the purpose: \"so that...\", \"in order to...\", \"the goal is to...\"",
    },
    {
      key: "expectation",
      label: "Expectation",
      weight: 1.5,
      detector: detectFormat,
      suggestion: "Set expectations for the output: length, format, depth of detail.",
    },
  ],
};
