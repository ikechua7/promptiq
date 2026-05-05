import type { FrameworkDefinition } from "../types.js";
import { detectRole } from "../detectors/role.js";
import { detectTask } from "../detectors/task.js";
import { detectFormat } from "../detectors/format.js";

export const RTF: FrameworkDefinition = {
  id: "rtf",
  name: "RTF",
  description: "Role, Task, Format — minimal framework for clear, quick prompts",
  bestFor: ["quick", "general"],
  elements: [
    {
      key: "role",
      label: "Role",
      weight: 1.5,
      detector: detectRole,
      suggestion: "Assign a role: \"Act as a [expert/professional]\" or \"You are a [role]\".",
    },
    {
      key: "task",
      label: "Task",
      weight: 2.0,
      detector: detectTask,
      suggestion: "State the task with an action verb: Write, Create, Analyze, Summarize, etc.",
    },
    {
      key: "format",
      label: "Format",
      weight: 1.5,
      detector: detectFormat,
      suggestion: "Specify the output format: bullet list, paragraph, JSON, numbered steps, etc.",
    },
  ],
};
