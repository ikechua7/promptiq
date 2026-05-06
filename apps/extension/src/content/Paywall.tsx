import { useState } from "react";
import { activateLicence } from "./trialGate.ts";

// Replace with your real Lemon Squeezy checkout URLs once set up
const LS_MONTHLY = "https://promptiq.lemonsqueezy.com/buy/monthly";
const LS_YEARLY  = "https://promptiq.lemonsqueezy.com/buy/yearly";

const PAYWALL_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .paywall {
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    font-family: system-ui, sans-serif;
    color: #e5e7eb;
  }
  .pw-lock { font-size: 32px; }
  .pw-title { font-size: 18px; font-weight: 800; color: #f9fafb; }
  .pw-body  { font-size: 13px; color: #9ca3af; text-align: center; line-height: 1.5; }
  .pw-btn {
    display: block;
    width: 100%;
    padding: 11px 14px;
    border-radius: 8px;
    border: none;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    transition: opacity 0.15s;
  }
  .pw-btn:hover { opacity: 0.88; }
  .pw-monthly { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; }
  .pw-yearly  { background: #1f2937; border: 1px solid #4f46e5; color: #a5b4fc; }
  .pw-best    { font-size: 10px; background: #4f46e5; color: #fff; border-radius: 4px; padding: 1px 5px; margin-left: 6px; vertical-align: middle; }
  .pw-divider { font-size: 11px; color: #4b5563; width: 100%; text-align: center; border-top: 1px solid #1f2937; padding-top: 12px; margin-top: 2px; }
  .pw-key-row { display: flex; gap: 6px; width: 100%; }
  .pw-key-input {
    flex: 1;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 6px;
    color: #e5e7eb;
    font-size: 12px;
    padding: 7px 8px;
  }
  .pw-key-input::placeholder { color: #4b5563; }
  .pw-key-input:focus { outline: none; border-color: #4f46e5; }
  .pw-activate {
    background: #374151;
    border: none;
    border-radius: 6px;
    color: #e5e7eb;
    font-size: 12px;
    font-weight: 600;
    padding: 7px 12px;
    cursor: pointer;
    white-space: nowrap;
  }
  .pw-activate:disabled { opacity: 0.4; cursor: default; }
  .pw-activate:not(:disabled):hover { background: #4b5563; }
  .pw-error   { font-size: 11px; color: #f87171; text-align: center; }
`;

interface PaywallProps {
  onActivated: () => void;
}

export function Paywall({ onActivated }: PaywallProps) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleActivate() {
    setChecking(true);
    setError("");
    const ok = await activateLicence(key);
    if (ok) {
      onActivated();
    } else {
      setError("Invalid key — check your purchase confirmation email.");
    }
    setChecking(false);
  }

  return (
    <>
      <style>{PAYWALL_STYLES}</style>
      <div className="paywall">
        <div className="pw-lock">🔒</div>
        <div className="pw-title">Your trial has ended</div>
        <div className="pw-body">
          Upgrade to keep scoring, fixing, and adapting your prompts across Claude, ChatGPT, and Gemini.
        </div>

        <a className="pw-btn pw-monthly" href={LS_MONTHLY} target="_blank" rel="noreferrer">
          S$4.99 / month
        </a>
        <a className="pw-btn pw-yearly" href={LS_YEARLY} target="_blank" rel="noreferrer">
          S$39 / year <span className="pw-best">SAVE 35%</span>
        </a>

        <div className="pw-divider">Already purchased?</div>

        <div className="pw-key-row">
          <input
            className="pw-key-input"
            placeholder="Paste licence key"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && key && handleActivate()}
          />
          <button
            className="pw-activate"
            onClick={handleActivate}
            disabled={!key.trim() || checking}
          >
            {checking ? "…" : "Activate"}
          </button>
        </div>

        {error && <div className="pw-error">{error}</div>}
      </div>
    </>
  );
}
