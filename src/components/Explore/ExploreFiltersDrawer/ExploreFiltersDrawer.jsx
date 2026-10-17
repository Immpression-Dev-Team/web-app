import { useEffect } from "react";
import ExploreLeftRail from "../ExploreLeftRail/ExploreLeftRail.jsx";
import "./ExploreFiltersDrawer.css";

// Tablet/mobile home for the left rail, same pattern as
// MarketplaceFiltersDrawer: picking a filter applies it and closes.
export default function ExploreFiltersDrawer({ open, onClose, setSource, applyQuery, ...railProps }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div className={`ex-drawer-root${open ? " open" : ""}`} aria-hidden={!open}>
      <div className="ex-drawer-backdrop" onClick={onClose} />
      <div className="ex-drawer-panel" role="dialog" aria-modal="true" aria-label="Filters">
        <div className="ex-drawer-header">
          <span className="ex-drawer-title">Filters</span>
          <button type="button" className="ex-drawer-close" onClick={onClose} aria-label="Close filters">
            ×
          </button>
        </div>
        <div className="ex-drawer-body">
          <ExploreLeftRail
            {...railProps}
            setSource={(v) => { setSource(v); onClose(); }}
            applyQuery={(v) => { applyQuery(v); onClose(); }}
          />
        </div>
      </div>
    </div>
  );
}
