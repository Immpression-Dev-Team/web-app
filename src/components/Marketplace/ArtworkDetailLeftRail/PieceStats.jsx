export default function PieceStats({ artwork }) {
  const listedDate = artwork.createdAt
    ? new Date(artwork.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : null;

  const stats = [
    { label: "Views", value: artwork.views?.toLocaleString() ?? "0" },
    { label: "Favorites", value: (artwork.likes?.length ?? 0).toLocaleString() },
    { label: "Category", value: artwork.category },
    { label: "Availability", value: artwork.isSold ? "Sold" : "Available" },
    listedDate && { label: "Listed", value: listedDate },
  ].filter(Boolean);

  return (
    <div className="mp-left-section">
      <h3 className="mp-left-title">Piece Stats</h3>
      <dl className="adr-stats-list">
        {stats.map((s) => (
          <div className="adr-stats-row" key={s.label}>
            <dt className="adr-stats-label">{s.label}</dt>
            <dd className="adr-stats-value">{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
