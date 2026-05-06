const CONSENT_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .consent {
    padding: 16px 14px;
    font-family: system-ui, sans-serif;
    color: #e5e7eb;
  }
  .consent-title {
    font-size: 14px;
    font-weight: 800;
    color: #f9fafb;
    margin-bottom: 8px;
  }
  .consent-body {
    font-size: 12px;
    color: #9ca3af;
    line-height: 1.6;
    margin-bottom: 14px;
  }
  .consent-body strong { color: #d1d5db; }
  .consent-btn {
    width: 100%;
    padding: 10px;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }
  .consent-btn:hover { opacity: 0.9; }
  .consent-opt {
    display: block;
    text-align: center;
    margin-top: 10px;
    font-size: 11px;
    color: #4b5563;
    cursor: pointer;
    background: none;
    border: none;
    width: 100%;
  }
  .consent-opt:hover { color: #9ca3af; }
`;

interface ConsentNoticeProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function ConsentNotice({ onAccept, onDecline }: ConsentNoticeProps) {
  return (
    <>
      <style>{CONSENT_STYLES}</style>
      <div className="consent">
        <div className="consent-title">Before we start</div>
        <div className="consent-body">
          PromptIQ reads your prompt text <strong>locally</strong> to score it against prompt engineering frameworks.<br /><br />
          <strong>Nothing is sent to any server.</strong> All processing happens entirely in your browser. No account required. No data collected.
        </div>
        <button className="consent-btn" onClick={onAccept}>
          Got it — start scoring
        </button>
        <button className="consent-opt" onClick={onDecline}>
          No thanks, disable PromptIQ on this page
        </button>
      </div>
    </>
  );
}
