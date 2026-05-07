# Changelog

## [1.4.0] — 2026-05-07

### Added
- **Chrome Web Store listing** (`store-assets/STORE_LISTING.md`) — full store copy: short description (97 chars), complete feature description, framework comparison table, privacy statement, pricing tiers, and image asset checklist.
- **Privacy Policy** (`store-assets/PRIVACY_POLICY.md`) — full policy for hosting at `usepromptiq.com/privacy`. Covers on-device processing, Lemon Squeezy payment data handling, permissions rationale, data retention periods, and user rights (GDPR/CCPA). Required before Chrome Web Store submission.
- **Store screenshot** (`store-assets/screenshot-1280x800.png`) — extension screenshot resized to Chrome Web Store specification (1280×800).

---

## [1.3.0] — 2026-05-07

### Added
- **Safari Pro build infrastructure** — `manifest.safari.pro.json` with narrowed host permissions matching Chrome Pro build. `scripts/convert-safari.sh` automates the full pipeline: builds `dist-safari-pro/` then runs `xcrun safari-web-extension-converter` to generate an Xcode project ready for Mac App Store submission. Requires full Xcode (not Command Line Tools alone).
- `build:safari-pro` npm script (`VITE_PRO=true VITE_SAFARI=true vite build`).
- `dist-safari-pro/` output directory wired into `vite.config.ts`.

### Notes
- Safari submission requires Apple Developer account (US$99/year) and full Xcode 15+.

---

## [1.2.0] — 2026-05-07

### Added
- **Firefox Pro build** — `manifest.ff.pro.json` with `browser_specific_settings.gecko` (extension ID `promptiq-pro@usepromptiq.com`, `strict_min_version: "109.0"` — first Firefox MV3 stable release). Packaged as `promptiq-pro-FF.zip`.
- `build:ff-pro` npm script (`VITE_PRO=true VITE_FF=true vite build`).
- `dist-ff-pro/` output directory.

### Security
- Firefox build carries all security hardening from v1.1.0 (closed Shadow DOM, CSP, narrowed host permissions, sanitised DOM writes, type-validated storage reads).

---

## [1.1.0] — 2026-05-06

### Added
- **Pro build** (`manifest.pro.json`, `build:pro` script) — separate paid-tier build distinct from the free extension, output to `dist-pro/`.
- **3-day free trial** — trial window tracked via `installedAt` timestamp in `chrome.storage.local`. Trial expires after 72 hours regardless of day-of-week.
- **Paywall** (`Paywall.tsx`) — shown when trial expires or no valid licence. Monthly/yearly pricing toggle. Three plan cards: Individual (US$3.99/mo, US$29/yr), Team (US$29/mo, US$199/yr), Business (US$79/mo, US$599/yr). Enterprise "Contact us" mailto. Licence key input with format validation.
- **Licence system** (`trialGate.ts`) — key format `PIQ-{IND|TEM|BIZ|ENT}-{UUID4}`. `activateLicence()` validates format and stores tier. `getTrialState()` type-validates all storage reads before use. `daysRemaining()` helper.
- **Corporate tiers** — Individual, Team (5 seats), Business (20 seats), Enterprise. Tier detected from licence key prefix.
- **Consent notice** (`ConsentNotice.tsx`) — first-run privacy notice explaining local-only processing. User must accept before scoring begins. Choice persisted in `chrome.storage.local`.
- **Platform adapter** (`SidePanel.tsx`) — rewrites prompt in the optimal style for each AI platform: Claude (XML tags: `<context>`, `<task>`, `<format>`), ChatGPT ("Act as" opener + bold markdown structure), Gemini (clean natural language). Three coloured buttons in side panel.
- **Fix My Prompt** — one-click prompt rewrite. Prepends role prefix if missing, appends bracketed placeholders for every missing framework element (e.g. `[Add the format: specify how you want the response structured]`). Writes back to live AI platform input using `document.execCommand` wrapped in `sanitisePlainText()`.
- Lemon Squeezy payment integration (placeholder checkout URLs — replace with real product URLs after account setup).

### Security (full audit pass)
- **C-1/C-2 mitigated client-side**: `licensed` initialises to `false`; `trialLoaded` gate prevents UI flash before async storage read completes.
- **C-3 XSS fixed**: all DOM writes via `execCommand` now pass through `sanitisePlainText()` — strips HTML tags, decodes entities.
- **C-4 Shadow DOM hardened**: switched from `open` to `closed` mode. Shadow root reference stored in module-level `_shadow` variable, inaccessible from host page.
- **C-5 storage hardened**: `getTrialState()` type-validates every field before use — corrupted or tampered storage values fall back to safe defaults.
- **H-1 CSP added**: `"extension_pages": "script-src 'self'; object-src 'none';"` in all manifests.
- **H-2 `activeTab` removed**: no longer requested in any manifest.
- **H-3 host permissions narrowed**: broad `<all_urls>` replaced with explicit paths (`https://claude.ai/`, `https://claude.ai/chat/*`, `https://claude.ai/new`, `https://claude.ai/project/*`, `https://chatgpt.com/`, `https://chatgpt.com/c/*`, `https://chat.openai.com/`, `https://chat.openai.com/c/*`, `https://gemini.google.com/app/*`).
- **H-4 textarea selector hardened**: password fields excluded (`textarea:not([type="password"]):not([autocomplete="current-password"]):not([autocomplete="new-password"])`).
- **H-5 popup settings validated**: framework ID checked against known set on load; invalid values rejected.
- Note: C-1 (server-side licence validation) and C-2 (server-side trial tracking) require backend API — deferred to Phase 2.

---

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
