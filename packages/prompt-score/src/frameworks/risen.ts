import type { FrameworkDefinition } from "../types.js";
import { detectRole } from "../detectors/role.js";
import { detectTask } from "../detectors/task.js";
import { detectSteps } from "../detectors/steps.js";
import { detectGoal } from "../detectors/goal.js";
import { detectConstraint } from "../detectors/constraint.js";

export const RISEN: FrameworkDefinition = {
  id: "risen",
  name: "RISEN",
  description: "Role, Instructions, Steps, End goal, Narrowing — ideal for coding and technical tasks",
  bestFor: ["coding"],
  elements: [
    {
      key: "role",
      label: "Role",
      weight: 1.5,
      detector: detectRole,
      suggestion: "Assign a role: \"Act as a senior software engineer\" or \"You are a DevOps expert\".",
    },
    {
      key: "instructions",
      label: "Instructions",
      weight: 2.0,
      detector: detectTask,
      suggestion: "Give explicit instructions with an action verb: Implement, Refactor, Debug, Write, etc.",
    },
    {
      key: "steps",
      label: "Steps",
      weight: 1.5,
      detector: detectSteps,
      suggestion: "Break the task into numbered steps: \"1. First... 2. Then... 3. Finally...\"",
    },
    {
      key: "endGoal",
      label: "End Goal",
      weight: 2.0,
      detector: detectGoal,
      suggestion: "State the desired outcome: \"The goal is...\", \"So that...\", \"The result should be...\"",
    },
    {
      key: "narrowing",
      label: "Narrowing",
      weight: 1.5,
      detector: detectConstraint,
      suggestion: "Add constraints: \"Only use Python 3.11\", \"Do not use external libraries\", \"Focus only on...\"",
    },
  ],
};
