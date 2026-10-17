import "./ExploreToolbar.css";

export default function ExploreToolbar({
  count,
  isBrowsing,
  query,
  clearQuery,
  source,
  clearSource,
  sourceLabel,
  sort,
  setSort,
  sortOptions,
  onOpenFilters,
}) {
  const activeFilters = [];
  if (query) activeFilters.push({ key: "q", label: `“${query}”`, clear: clearQuery });
  if (source !== "all") activeFilters.push({ key: "source", label: sourceLabel, clear: clearSource });

  return (
    <div className="ex-toolbar">
      <div className="ex-toolbar-left">
        <button type="button" className="ex-toolbar-filters-btn" onClick={onOpenFilters}>
          Filters
        </button>

        {count != null && (
          <span className="ex-toolbar-count">
            {isBrowsing ? "Featured · " : ""}{count} Work{count === 1 ? "" : "s"}
          </span>
        )}

        {activeFilters.length > 0 && (
          <div className="ex-toolbar-chips">
            {activeFilters.map((f) => (
              <button
                key={f.key}
                type="button"
                className="ex-toolbar-chip"
                onClick={f.clear}
                aria-label={`Remove ${f.label} filter`}
              >
                {f.label} <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ex-toolbar-sort">
        <label className="ex-toolbar-sort-label" htmlFor="ex-sort-select">Sort:</label>
        <select
          id="ex-sort-select"
          className="ex-toolbar-sort-select"
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
