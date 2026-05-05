import type { FrameworkDefinition } from "../types.js";
import { detectContext } from "../detectors/context.js";
import { detectRole } from "../detectors/role.js";
import { detectGoal } from "../detectors/goal.js";
import { detectConstraint } from "../detectors/constraint.js";
import { detectTask } from "../detectors/task.js";

export const BROKE: FrameworkDefinition = {
  id: "broke",
  name: "BROKE",
  description: "Background, Role, Objectives, Key results, Evolve — ideal for strategy and business prompts",
  bestFor: ["business"],
  elements: [
    {
      key: "background",
      label: "Background",
      weight: 1.5,
      detector: detectContext,
      suggestion: "Provide background: company/project context, current situation, relevant history.",
    },
    {
      key: "role",
      label: "Role",
      weight: 1.5,
      detector: detectRole,
      suggestion: "Assign a role: \"Act as a strategic consultant\" or \"You are a product manager\".",
    },
    {
      key: "objectives",
      label: "Objectives",
      weight: 2.0,
      detector: detectTask,
      suggestion: "State the objectives clearly: what needs to be accomplished and by when.",
    },
    {
      key: "keyResults",
      label: "Key Results",
      weight: 2.0,
      detector: detectGoal,
      suggestion: "Define key results: measurable outcomes that indicate success (\"The result should show...\").",
    },
    {
      key: "evolve",
      label: "Evolve / Constraints",
      weight: 1.0,
      detector: detectConstraint,
      suggestion: "Add constraints or evolution instructions: what to avoid, iterate on, or refine.",
    },
  ],
};
