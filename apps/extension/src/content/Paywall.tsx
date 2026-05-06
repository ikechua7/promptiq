import { useState } from "react";
import { activateLicence } from "./trialGate.ts";
import type { LicenceTier } from "./trialGate.ts";

// Replace with real Lemon Squeezy URLs after setup
const CHECKOUT: Record<string, string> = {
  individual_monthly: "https://promptiq.lemonsqueezy.com/buy/individual-monthly",
  individual_yearly:  "https://promptiq.lemonsqueezy.com/buy/individual-yearly",
  team_monthly:       "https://promptiq.lemonsqueezy.com/buy/team-monthly",
  team_yearly:        "https://promptiq.lemonsqueezy.com/buy/team-yearly",
  business_monthly:   "https://promptiq.lemonsqueezy.com/buy/business-monthly",
  business_yearly:    "https://promptiq.lemonsqueezy.com/buy/business-yearly",
};
const ENTERPRISE_EMAIL = "mailto:hello@usepromptiq.com?subject=PromptIQ%20Enterprise";

const PAYWALL_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .paywall { font-family: system-ui, sans-serif; color: #e5e7eb; }
  .pw-header {
    padding: 16px 14px 12px;
    border-bottom: 1px solid #1f2937;
    text-align: center;
  }
  .pw-lock  { font-size: 28px; margin-bottom: 6px; }
  .pw-title { font-size: 16px; font-weight: 800; color: #f9fafb; }
  .pw-body  { font-size: 12px; color: #9ca3af; margin-top: 4px; line-height: 1.4; }

  .pw-tabs {
    display: flex;
    border-bottom: 1px solid #1f2937;
  }
  .pw-tab {
    flex: 1;
    padding: 8px;
    background: none;
    border: none;
    color: #6b7280;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
  }
  .pw-tab.active { color: #a5b4fc; border-bottom-color: #4f46e5; }

  .pw-plans { padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; }

  .pw-plan {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 8px;
    padding: 10px 12px;
    text-decoration: none;
    transition: border-color 0.15s, background 0.15s;
    cursor: pointer;
  }
  .pw-plan:hover { border-color: #4f46e5; background: #1e1b4b22; }
  .pw-plan.highlight { border-color: #4f46e5; }
  .pw-plan-left { display: flex; flex-direction: column; gap: 2px; }
  .pw-plan-name { font-size: 13px; font-weight: 700; color: #f9fafb; }
  .pw-plan-seats { font-size: 11px; color: #6b7280; }
  .pw-plan-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
  .pw-plan-price { font-size: 14px; font-weight: 800; color: #a5b4fc; }
  .pw-plan-save { font-size: 10px; background: #4f46e5; color: #fff; border-radius: 4px; padding: 1px 5px; }
  .pw-plan-contact { font-size: 12px; color: #6b7280; }

  .pw-enterprise {
    margin: 0 12px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #111827;
    border: 1px dashed #374151;
    border-radius: 8px;
    padding: 10px 12px;
    text-decoration: none;
    transition: border-color 0.15s;
  }
  .pw-enterprise:hover { border-color: #6b7280; }

  .pw-divider {
    font-size: 11px; color: #4b5563;
    text-align: center;
    border-top: 1px solid #1f2937;
    padding: 10px 14px 6px;
  }
  .pw-key-row { display: flex; gap: 6px; padding: 0 12px 12px; }
  .pw-key-input {
    flex: 1;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 6px;
    color: #e5e7eb;
    font-size: 11px;
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
  .pw-error   { font-size: 11px; color: #f87171; text-align: center; padding: 0 12px 10px; }
  .pw-success { font-size: 11px; color: #4ade80; text-align: center; padding: 0 12px 10px; font-weight: 600; }
`;

interface PaywallProps {
  onActivated: (tier: LicenceTier) => void;
}

export function Paywall({ onActivated }: PaywallProps) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleActivate() {
    setChecking(true);
    setError("");
    const result = await activateLicence(key);
    if (result.success && result.tier) {
      onActivated(result.tier);
    } else {
      setError(result.error ?? "Invalid key.");
    }
    setChecking(false);
  }

  const plans = [
    {
      key: "individual",
      name: "Individual",
      seats: "1 seat",
      monthly: "US$3.99",
      yearly: "US$29",
      highlight: false,
    },
    {
      key: "team",
      name: "Team",
      seats: "5 seats",
      monthly: "US$29",
      yearly: "US$199",
      highlight: true,
    },
    {
      key: "business",
      name: "Business",
      seats: "20 seats",
      monthly: "US$79",
      yearly: "US$599",
      highlight: false,
    },
  ];

  return (
    <>
      <style>{PAYWALL_STYLES}</style>
      <div className="paywall">

        <div className="pw-header">
          <div className="pw-lock">🔒</div>
          <div className="pw-title">Trial ended</div>
          <div className="pw-body">Upgrade to keep scoring, fixing, and adapting your prompts.</div>
        </div>

        <div className="pw-tabs">
          <button className={`pw-tab ${billing === "monthly" ? "active" : ""}`} onClick={() => setBilling("monthly")}>
            Monthly
          </button>
          <button className={`pw-tab ${billing === "yearly" ? "active" : ""}`} onClick={() => setBilling("yearly")}>
            Yearly — save 40%
          </button>
        </div>

        <div className="pw-plans">
          {plans.map((p) => (
            <a
              key={p.key}
              className={`pw-plan ${p.highlight ? "highlight" : ""}`}
              href={CHECKOUT[`${p.key}_${billing}`]}
              target="_blank"
              rel="noreferrer"
            >
              <div className="pw-plan-left">
                <span className="pw-plan-name">{p.name}</span>
                <span className="pw-plan-seats">{p.seats}</span>
              </div>
              <div className="pw-plan-right">
                <span className="pw-plan-price">
                  {billing === "monthly" ? p.monthly + "/mo" : p.yearly + "/yr"}
                </span>
                {billing === "yearly" && (
                  <span className="pw-plan-save">SAVE 40%</span>
                )}
              </div>
            </a>
          ))}
        </div>

        <a className="pw-enterprise" href={ENTERPRISE_EMAIL} target="_blank" rel="noreferrer">
          <div className="pw-plan-left">
            <span className="pw-plan-name">Enterprise</span>
            <span className="pw-plan-seats">Unlimited seats</span>
          </div>
          <span className="pw-plan-contact">Contact us →</span>
        </a>

        <div className="pw-divider">Already purchased? Enter your licence key</div>
        <div className="pw-key-row">
          <input
            className="pw-key-input"
            placeholder="PIQ-IND-xxxxxxxx-..."
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
