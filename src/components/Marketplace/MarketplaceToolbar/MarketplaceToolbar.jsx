import "./MarketplaceToolbar.css";

// One-click category filters. Values are the backend's marketplace
// categories (same ones the filter drawer's medium list uses).
const QUICK_FILTERS = [
  { value: "All", label: "All Art" },
  { value: "paintings", label: "Paintings" },
  { value: "graphic design", label: "Graphic Design" },
  { value: "photography", label: "Photography" },
  { value: "illustrations", label: "Illustrations" },
];

const formatCategory = (c) => c.charAt(0).toUpperCase() + c.slice(1);

export default function MarketplaceToolbar({
  count,
  loading,
  category,
  setCategory,
  sort,
  setSort,
  sortOptions,
  onOpenFilters,
}) {
  // A category picked in the drawer that has no quick pill still shows
  // as an active pill, so the current filter is always visible.
  const pills = QUICK_FILTERS.some((f) => f.value === category)
    ? QUICK_FILTERS
    : [...QUICK_FILTERS, { value: category, label: formatCategory(category) }];

  const isFiltered = category !== "All";

  return (
    <div className="mp-toolbar">
      <div className="mp-toolbar-row">
        <div className="mp-toolbar-pills" role="group" aria-label="Filter by category">
          {pills.map((f) => {
            const active = f.value === category;
            return (
              <button
                key={f.value}
                type="button"
                className={`mp-pill${active ? " mp-pill--active" : ""}`}
                aria-pressed={active}
                onClick={() => setCategory(f.value)}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <button type="button" className="mp-toolbar-more" onClick={onOpenFilters}>
          <SlidersIcon />
          <span className="mp-toolbar-more-label">More Filters</span>
        </button>
      </div>

      <div className="mp-toolbar-row mp-toolbar-row--meta">
        <div className="mp-toolbar-status">
          {!loading && count != null && (
            <span className="mp-toolbar-count">
              {count} artwork{count === 1 ? "" : "s"}
            </span>
          )}
          {isFiltered && (
            <button type="button" className="mp-toolbar-reset" onClick={() => setCategory("All")}>
              Reset filters
            </button>
          )}
        </div>

        <div className="mp-toolbar-sort">
          <label className="mp-toolbar-sort-label" htmlFor="mp-sort-select">Sort by</label>
          <select
            id="mp-sort-select"
            className="mp-toolbar-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function SlidersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="9" cy="6" r="2" fill="#fff" />
      <circle cx="15" cy="12" r="2" fill="#fff" />
      <circle cx="8" cy="18" r="2" fill="#fff" />
    </svg>
  );
}
