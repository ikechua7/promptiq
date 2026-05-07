import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ALL_FRAMEWORKS } from "prompt-score";

const SITES = [
  { id: "claude", label: "Claude.ai", host: "claude.ai" },
  { id: "chatgpt", label: "ChatGPT", host: "chatgpt.com" },
  { id: "gemini", label: "Gemini", host: "gemini.google.com" },
];

interface Settings {
  defaultFramework: string;
  enabledSites: string[];
}

const DEFAULT_SETTINGS: Settings = {
  defaultFramework: "auto",
  enabledSites: ["claude", "chatgpt", "gemini"],
};

function Popup() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("settings", (data) => {
      if (data.settings) {
        const s = data.settings;
        const validFrameworks = new Set(["auto", ...ALL_FRAMEWORKS.map((f: { id: string }) => f.id)]);
        const validSites = new Set(["claude", "chatgpt", "gemini"]);
        setSettings({
          defaultFramework: validFrameworks.has(s.defaultFramework) ? s.defaultFramework : "auto",
          enabledSites: Array.isArray(s.enabledSites)
            ? s.enabledSites.filter((x: unknown) => validSites.has(x as string))
            : DEFAULT_SETTINGS.enabledSites,
        });
      }
    });
  }, []);

  function save(next: Settings) {
    setSettings(next);
    chrome.storage.local.set({ settings: next });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function toggleSite(id: string) {
    const next = settings.enabledSites.includes(id)
      ? settings.enabledSites.filter((s) => s !== id)
      : [...settings.enabledSites, id];
    save({ ...settings, enabledSites: next });
  }

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Prompt Scorer</div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>Score prompts before you send</div>
        </div>
        {saved && <span style={{ fontSize: 11, color: "#22c55e" }}>Saved</span>}
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b7280", marginBottom: 8 }}>
          Default Framework
        </div>
        <select
          value={settings.defaultFramework}
          onChange={(e) => save({ ...settings, defaultFramework: e.target.value })}
          style={{ width: "100%", background: "#1f2937", border: "1px solid #374151", borderRadius: 6, color: "#e5e7eb", fontSize: 12, padding: "5px 8px" }}
        >
          <option value="auto">Auto-detect</option>
          {ALL_FRAMEWORKS.map((f) => (
            <option key={f.id} value={f.id}>{f.name} — {f.description.split("—")[0].trim()}</option>
          ))}
        </select>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b7280", marginBottom: 8 }}>
          Active Sites
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {SITES.map((site) => {
            const on = settings.enabledSites.includes(site.id);
            return (
              <label key={site.id} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggleSite(site.id)}
                  style={{ accentColor: "#6366f1" }}
                />
                <span style={{ fontSize: 13, color: on ? "#e5e7eb" : "#6b7280" }}>{site.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <a
        href="https://redotdigital.com"
        target="_blank"
        rel="noreferrer"
        style={{ fontSize: 12, color: "#6366f1", textDecoration: "none", textAlign: "center", paddingTop: 4 }}
      >
        Open full scorer ↗
      </a>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Popup />
  </StrictMode>
);
