import { useEffect } from "react";
import MarketplaceLeftRail from "../MarketplaceLeftRail/MarketplaceLeftRail.jsx";
import "./MarketplaceFiltersDrawer.css";

export default function MarketplaceFiltersDrawer({ open, onClose, category, setCategory, setSort }) {
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

  // Selecting a filter inside the drawer is a complete action on mobile —
  // apply it and close, rather than making the user close it separately.
  const handleSetCategory = (value) => {
    setCategory(value);
    onClose();
  };

  const handleSetSort = (value) => {
    setSort(value);
    onClose();
  };

  return (
    <div className={`mp-drawer-root${open ? " open" : ""}`} aria-hidden={!open}>
      <div className="mp-drawer-backdrop" onClick={onClose} />
      <div className="mp-drawer-panel" role="dialog" aria-modal="true" aria-label="Filters">
        <div className="mp-drawer-header">
          <span className="mp-drawer-title">Filters</span>
          <button type="button" className="mp-drawer-close" onClick={onClose} aria-label="Close filters">
            ×
          </button>
        </div>
        <div className="mp-drawer-body">
          <MarketplaceLeftRail
            category={category}
            setCategory={handleSetCategory}
            setSort={handleSetSort}
          />
        </div>
      </div>
    </div>
  );
}
