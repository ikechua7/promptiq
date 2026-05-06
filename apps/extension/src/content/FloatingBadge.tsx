import { useState, useEffect, useRef } from "react";
import { score } from "prompt-score";
import type { PromptScore } from "prompt-score";
import { SidePanel } from "./SidePanel.tsx";
import { getTrialState, isTrialExpired, daysRemaining } from "./trialGate.ts";
import type { LicenceTier } from "./trialGate.ts";

declare const __PRO__: boolean;

interface FloatingBadgeProps {
  getText: () => string;
  setText: (text: string) => void;
}

function gradeColor(s: number): string {
  if (s >= 85) return "#22c55e";
  if (s >= 70) return "#84cc16";
  if (s >= 55) return "#eab308";
  if (s >= 40) return "#f97316";
  return "#ef4444";
}

const BASE_STYLES = `
  * { box-sizing: border-box; }
  .badge {
    pointer-events: all;
    display: flex;
    align-items: center;
    gap: 4px;
    background: #111827;
    border: 1px solid #374151;
    border-radius: 999px;
    padding: 3px 8px 3px 4px;
    cursor: pointer;
    font-family: system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    transition: transform 0.15s;
    user-select: none;
  }
  .badge:hover { transform: scale(1.05); }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .trial-pill {
    pointer-events: all;
    display: flex;
    align-items: center;
    gap: 4px;
    background: #1f2937;
    border: 1px solid #d97706;
    border-radius: 999px;
    padding: 3px 8px;
    cursor: pointer;
    font-family: system-ui, sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #fbbf24;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    user-select: none;
  }
`;

export function FloatingBadge({ getText, setText }: FloatingBadgeProps) {
  const [result, setResult] = useState<PromptScore | null>(null);
  const [open, setOpen] = useState(false);
  const [framework, setFramework] = useState("auto");
  const lastTextRef = useRef<string>("");
  const hasAutoOpenedRef = useRef(false);

  // Pro: trial state
  const [trialExpired, setTrialExpired] = useState(false);
  const [licensed, setLicensed] = useState(false);
  const [trialLoaded, setTrialLoaded] = useState(false);
  const [consentGiven, setConsentGiven] = useState(true);
  const [days, setDays] = useState(3);
  const [tier, setTier] = useState<LicenceTier | null>(null);

  useEffect(() => {
    if (typeof __PRO__ !== "undefined" && __PRO__) {
      getTrialState().then((s) => {
        setLicensed(s.licensed);
        setTrialExpired(isTrialExpired(s.installedAt));
        setDays(daysRemaining(s.installedAt));
        setTier(s.tier);
        chrome.storage.local.get(["consentGiven"], (d) => {
          setConsentGiven(d.consentGiven === true);
          setTrialLoaded(true);
        });
      });
    } else {
      chrome.storage.local.get(["consentGiven"], (d) => {
        setConsentGiven(d.consentGiven === true);
        setTrialLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    function check() {
      const text = getText().trim();
      if (text === lastTextRef.current) return;
      lastTextRef.current = text;
      if (!text) { setResult(null); hasAutoOpenedRef.current = false; return; }
      if (!hasAutoOpenedRef.current) {
        hasAutoOpenedRef.current = true;
        setOpen(true);
      }
      setResult(score(text, framework));
    }

    const interval = setInterval(check, 300);
    document.addEventListener("input", check, true);
    document.addEventListener("keyup", check, true);
    document.addEventListener("paste", () => setTimeout(check, 50), true);
    document.addEventListener("focusin", check, true);

    return () => {
      clearInterval(interval);
      document.removeEventListener("input", check, true);
      document.removeEventListener("keyup", check, true);
      document.removeEventListener("focusin", check, true);
    };
  }, [getText, framework]);

  if (!result || !trialLoaded) return null;

  const color = gradeColor(result.score);
  const paywalled = typeof __PRO__ !== "undefined" && __PRO__ && trialExpired && !licensed;

  return (
    <>
      <style>{BASE_STYLES}</style>

      {/* Badge — always show score; lock icon when paywalled */}
      <div
        className="badge"
        onClick={() => setOpen((o) => !o)}
        title={paywalled ? "Trial ended — click to upgrade" : `Prompt score: ${result.score}/100 (${result.grade}) — ${result.framework.name}`}
      >
        <div className="dot" style={{ background: paywalled ? "#6b7280" : color }} />
        <span style={{ color: paywalled ? "#6b7280" : color }}>
          {paywalled ? "🔒" : result.score}
        </span>
        {!paywalled && <span style={{ color: "#9ca3af" }}>{result.grade}</span>}
      </div>

      {/* Trial days remaining pill */}
      {typeof __PRO__ !== "undefined" && __PRO__ && !trialExpired && !licensed && (
        <div className="trial-pill" style={{ marginTop: 6 }} onClick={() => setOpen(true)}>
          ⏱ {days}d trial
        </div>
      )}

      {open && (
        <SidePanel
          result={result}
          framework={framework}
          onFrameworkChange={setFramework}
          onClose={() => setOpen(false)}
          getText={getText}
          onSetText={setText}
          paywalled={paywalled}
          onLicenceActivated={(t) => { setLicensed(true); setTrialExpired(false); setTier(t); }}
          consentGiven={consentGiven}
          onConsentAccept={() => {
            chrome.storage.local.set({ consentGiven: true });
            setConsentGiven(true);
          }}
          onConsentDecline={() => {
            chrome.storage.local.set({ consentGiven: false });
            setConsentGiven(false);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
