import { useState } from "react";

export default function ShareSaveActions({ saved, onToggleSave, pageUrl, title }) {
  const [copyLabel, setCopyLabel] = useState("Copy Link");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy Link"), 1800);
    } catch {
      // Clipboard API unavailable — leave the button label as-is.
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: pageUrl });
      } catch {
        // User cancelled the native share sheet — no-op.
      }
    } else {
      handleCopy();
    }
  };

  const reportHref = `mailto:immpression.nyc@gmail.com?subject=${encodeURIComponent(`Reporting artwork: ${title}`)}&body=${encodeURIComponent(`I'd like to report this artwork:\n${pageUrl}\n\nReason:\n`)}`;

  return (
    <div className="mp-left-section">
      <h3 className="mp-left-title">Share &amp; Save</h3>
      <div className="adr-action-grid">
        <button type="button" className={`adr-action-btn${saved ? " active" : ""}`} onClick={onToggleSave}>
          {saved ? "Saved" : "Save"}
        </button>
        <button type="button" className="adr-action-btn" onClick={handleShare}>
          Share
        </button>
        <button type="button" className="adr-action-btn" onClick={handleCopy}>
          {copyLabel}
        </button>
        <a className="adr-action-btn" href={reportHref}>
          Report
        </a>
      </div>
    </div>
  );
}
