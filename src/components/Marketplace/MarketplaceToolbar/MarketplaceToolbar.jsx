import "./MarketplaceToolbar.css";

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
  const activeFilters = [];
  if (category !== "All") {
    activeFilters.push({
      key: "category",
      label: category.charAt(0).toUpperCase() + category.slice(1),
      clear: () => setCategory("All"),
    });
  }

  return (
    <div className="mp-toolbar">
      <div className="mp-toolbar-left">
        <button type="button" className="mp-toolbar-filters-btn" onClick={onOpenFilters}>
          Filters
        </button>

        {!loading && count != null && (
          <span className="mp-toolbar-count">
            {count} Artwork{count === 1 ? "" : "s"}
          </span>
        )}

        {activeFilters.length > 0 && (
          <div className="mp-toolbar-chips">
            {activeFilters.map((f) => (
              <button
                key={f.key}
                type="button"
                className="mp-toolbar-chip"
                onClick={f.clear}
                aria-label={`Remove ${f.label} filter`}
              >
                {f.label} <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mp-toolbar-sort">
        <label className="mp-toolbar-sort-label" htmlFor="mp-sort-select">Sort:</label>
        <select
          id="mp-sort-select"
          className="mp-toolbar-sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
