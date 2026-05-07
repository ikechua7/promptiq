# Privacy Policy — PromptIQ Pro

**Effective date:** 7 May 2026  
**Last updated:** 7 May 2026

---

## 1. Who we are

PromptIQ Pro ("we", "us", "our") is a browser extension developed and operated by Isaiah Chua. Contact: hello@redotdigital.com

---

## 2. The short version

**Your prompts never leave your device.** All scoring runs locally in your browser using pattern matching. We do not collect, store, transmit, or sell your prompt text or any personally identifiable information.

---

## 3. What data we process

### 3a. Data that stays on your device (never transmitted)

| Data | Where stored | Why |
|---|---|---|
| Your prompt text | Browser memory only (never written to disk) | Real-time scoring |
| Trial install date | `chrome.storage.local` | 3-day trial window |
| Trial/licence status | `chrome.storage.local` | Feature gating |
| Licence key (if entered) | `chrome.storage.local` | Tier detection |
| Consent preference | `chrome.storage.local` | Remember your choice |
| Last 10 scored prompts | `chrome.storage.local` | History panel (optional) |

None of this data is ever read by our servers.

### 3b. Data collected during payment

When you purchase a subscription through our payment processor (Lemon Squeezy), they collect:

- Name and email address
- Billing address
- Payment card details (handled entirely by Lemon Squeezy — we never see card numbers)

Lemon Squeezy's privacy policy: https://www.lemonsqueezy.com/privacy

We receive from Lemon Squeezy only: your email address, your licence key, and your subscription status. This is used solely to issue and validate your licence key.

### 3c. Website analytics

Our marketing website (redotdigital.com) may use privacy-preserving analytics (no cookies, no fingerprinting). No analytics are run inside the extension itself.

---

## 4. What we do not do

- We do not read, store, or transmit your prompt text.
- We do not inject tracking scripts into Claude, ChatGPT, or Gemini.
- We do not sell any data to third parties.
- We do not use advertising networks.
- We do not fingerprint your browser.
- We do not access any page content outside the AI platform text input fields we score.

---

## 5. Permissions we request and why

| Permission | Why we need it |
|---|---|
| `storage` | Save trial state, consent, and licence key locally |
| `host_permissions` for claude.ai, chatgpt.com, gemini.google.com | Inject the scoring UI into these specific pages only |

We do not request `tabs`, `history`, `bookmarks`, `downloads`, `webRequest`, or any other broad permissions.

---

## 6. Children

PromptIQ Pro is not directed at children under 13. We do not knowingly collect information from children.

---

## 7. Data retention

- **On-device data**: remains until you uninstall the extension or clear extension storage via your browser settings.
- **Payment data**: retained by Lemon Squeezy per their policy. We retain your email and licence status for as long as your subscription is active, plus 90 days after cancellation for support purposes.

---

## 8. Your rights

Depending on your jurisdiction, you may have the right to:

- Access the personal data we hold about you (email + subscription status only)
- Request deletion of your account and associated data
- Object to processing

To exercise any right, email hello@redotdigital.com. We will respond within 30 days.

**To delete all on-device data immediately:** uninstall PromptIQ Pro from your browser. All local storage is removed automatically.

---

## 9. Security

- All scoring logic runs inside a closed Shadow DOM, isolated from the host page.
- No external network requests are made by the extension during scoring.
- Licence key format is validated client-side before storage.
- We do not transmit any data over unencrypted connections.

---

## 10. Changes to this policy

We will update the effective date at the top of this page when changes are made. Significant changes will be communicated via the extension update notes.

---

## 11. Contact

Isaiah Chua  
hello@redotdigital.com  
https://redotdigital.com
