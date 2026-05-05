# Changelog

## [0.0.2] — 2026-05-05

### Added
- **Task-type dropdown** at the top of the score panel — "What are you working on?" lets users declare their intent (Content Writing, Coding & Technical, Research & Analysis, Business & Strategy, Quick / One-liner, General Purpose) and automatically switches to the most appropriate scoring framework.
- **Framework description** shown below the score — a plain-English one-liner explaining what each framework is best for, so users understand why it was selected.

### Changed
- **Auto-open score panel** — the full panel now opens automatically the first time text is detected in the prompt box. No longer requires clicking the badge to see feedback. Panel resets when the box is cleared, so it auto-opens again on the next typing session.
- **Framework description visibility** — increased font size and contrast (from dim gray 11px italic to near-white 12px) for better legibility.

---

## [0.0.1] — 2026-05-03 (Initial Beta)

### Added
- Real-time prompt scoring against 8 frameworks: COSTAR, RTF, RISEN, CRISPE, APE, CARE, TAG, BROKE.
- Auto-detection of prompt intent (coding, creative, business, research, quick, general) to select the best-fit framework automatically.
- Floating score badge (e.g. `● 78 B`) injected into Claude.ai, ChatGPT, and Gemini — no page reload required.
- Side panel with score ring, per-element checklist (✓/✗ with evidence), suggestions for missing elements, and manual framework selector.
- Shadow DOM isolation so extension styles never conflict with host page styles.
- 6-tier selector cascade with blocklist — resilient to DOM changes on Claude.ai, ChatGPT, and Gemini.
- Polling (300ms) + multi-event listeners (input, keyup, paste, focusin) for reliable text detection across all editor types (ProseMirror, Quill, plain textarea).
- SPA-aware mounting — remounts automatically after navigation within Claude.ai or ChatGPT.
- Zero data leaves the browser — all scoring runs locally, no API key or account required.
- INSTALL.txt with step-by-step unpacked extension setup guide.
