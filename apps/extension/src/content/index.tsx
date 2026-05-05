import { createRoot } from "react-dom/client";
import { FloatingBadge } from "./FloatingBadge.tsx";

// Ordered by specificity — more specific selectors first, generic fallbacks last
const SELECTORS: Array<{ sel: string; site: string }> = [
  { sel: '[data-testid="chat-input"]',          site: "claude" },
  { sel: ".tiptap.ProseMirror",                 site: "claude-fallback" },
  { sel: "#prompt-textarea",                    site: "chatgpt" },
  { sel: 'div[contenteditable="true"][role="textbox"]', site: "generic-rich" },
  { sel: '[contenteditable="true"]',            site: "generic-ce" },
  { sel: "textarea",                            site: "generic-textarea" },
];

// Selectors that are too broad and would match non-input elements
const BLOCKLIST = [
  ".cm-content",        // CodeMirror editor (not a prompt box)
  ".monaco-editor",     // Monaco (VS Code web)
];

let mounted = false;

function isBlocked(el: Element): boolean {
  return BLOCKLIST.some((sel) => el.closest(sel) !== null);
}

function getPromptEl(): Element | null {
  for (const { sel } of SELECTORS) {
    const el = document.querySelector(sel);
    if (el && !isBlocked(el)) return el;
  }
  return null;
}

function getText(el: Element): string {
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    return el.value;
  }
  // ProseMirror / contenteditable — innerText includes all child text nodes
  return (el as HTMLElement).innerText ?? "";
}

function mount() {
  if (mounted) return;
  const target = getPromptEl();
  if (!target) return;
  mounted = true;

  const host = document.createElement("div");
  host.setAttribute("data-prompt-scorer", "1");
  host.style.cssText = "position:fixed;bottom:80px;right:20px;z-index:2147483647;";
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });
  const mountPoint = document.createElement("div");
  shadow.appendChild(mountPoint);

  // Always re-query so selector fallback picks up DOM changes after mount
  function getTextLive(): string {
    const el = getPromptEl();
    return el ? getText(el) : "";
  }

  createRoot(mountPoint).render(<FloatingBadge getText={getTextLive} />);
}

function poll() {
  // Re-check every 2s — handles SPA navigation + late-rendered inputs
  if (!mounted) mount();

  // If DOM changed and our element is gone, allow remount on next poll
  if (mounted && !getPromptEl()) {
    mounted = false;
    document.querySelector("[data-prompt-scorer]")?.remove();
  }

  setTimeout(poll, 2000);
}

poll();
