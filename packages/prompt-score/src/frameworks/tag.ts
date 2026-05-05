import type { FrameworkDefinition } from "../types.js";
import { detectTask } from "../detectors/task.js";
import { detectContext } from "../detectors/context.js";
import { detectGoal } from "../detectors/goal.js";

export const TAG: FrameworkDefinition = {
  id: "tag",
  name: "TAG",
  description: "Task, Action, Goal — the simplest framework; perfect for short, focused prompts",
  bestFor: ["quick"],
  elements: [
    {
      key: "task",
      label: "Task",
      weight: 2.0,
      detector: detectTask,
      suggestion: "Define the task clearly with an action verb: Write, Summarize, Build, etc.",
    },
    {
      key: "action",
      label: "Action / Context",
      weight: 1.5,
      detector: detectContext,
      suggestion: "Add what the action operates on: the subject, document, codebase, or topic.",
    },
    {
      key: "goal",
      label: "Goal",
      weight: 2.0,
      detector: detectGoal,
      suggestion: "State the goal: \"so that I can...\", \"the result should be...\", \"I need this to...\"",
    },
  ],
};
