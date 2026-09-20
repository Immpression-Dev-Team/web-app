import { useState } from "react";

const ITEMS = [
  { key: "all", label: "All Artwork", icon: IconGrid, enabled: true },
  { key: "featured", label: "Featured", icon: IconStar, enabled: false },
  { key: "new", label: "New Arrivals", icon: IconSparkle, enabled: true },
  { key: "curated", label: "Curated Collections", icon: IconLayers, enabled: false },
  { key: "rising", label: "Rising Artists", icon: IconTrend, enabled: false },
];

export default function DiscoverNav({ setCategory, setSort }) {
  const [active, setActive] = useState("all");

  const handleClick = (item) => {
    if (!item.enabled) return;
    setActive(item.key);
    if (item.key === "all") {
      setCategory("All");
    } else if (item.key === "new") {
      setCategory("All");
      setSort("newest");
    }
  };

  return (
    <div className="mp-left-section">
      <h3 className="mp-left-title">Discover</h3>
      <ul className="mp-discover-list">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.key}>
              <button
                type="button"
                className={`mp-discover-item${active === item.key ? " active" : ""}${!item.enabled ? " soon" : ""}`}
                onClick={() => handleClick(item)}
                disabled={!item.enabled}
              >
                <Icon />
                <span className="mp-discover-label">{item.label}</span>
                {!item.enabled && <span className="mp-soon-tag">Soon</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function IconGrid() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="1.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1.5" y="9" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="9" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5l1.9 4.2 4.6.5-3.4 3.1.9 4.6L8 11.7l-4 2.2.9-4.6-3.4-3.1 4.6-.5L8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function IconSparkle() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1v4M8 11v4M1 8h4M11 8h4M3.5 3.5l2 2M10.5 10.5l2 2M3.5 12.5l2-2M10.5 5.5l2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5l6.5 3.5L8 8.5 1.5 5 8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M1.5 8.5L8 12l6.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M1.5 11.5L8 15l6.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function IconTrend() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M1.5 12.5l4.5-5 3 3 5.5-6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 3.5h3.5V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
