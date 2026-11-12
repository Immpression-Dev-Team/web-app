import { useEffect } from "react";
import DiscoverNav from "../MarketplaceLeftRail/DiscoverNav.jsx";
import MediumList from "../MarketplaceLeftRail/MediumList.jsx";
import PriceRangeCard from "../MarketplaceLeftRail/PriceRangeCard.jsx";
import "../MarketplaceLeftRail/MarketplaceLeftRail.css";
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

  // The marketplace's only filter UI (the page has no side rail). Selecting
  // a filter is a complete action — apply it and close, rather than making the user close it separately.
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
          <div className="mp-left-rail">
            <DiscoverNav setCategory={handleSetCategory} setSort={handleSetSort} />
            <MediumList category={category} setCategory={handleSetCategory} />
            <PriceRangeCard />
          </div>
        </div>
      </div>
    </div>
  );
}
