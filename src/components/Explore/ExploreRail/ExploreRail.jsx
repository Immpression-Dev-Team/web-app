import "./ExploreRail.css";

const COLLECTIONS = [
  { name: "The Met", detail: "New York · 400,000+ open-access images" },
  { name: "Art Institute of Chicago", detail: "Chicago · CC0 collection" },
  { name: "Cleveland Museum of Art", detail: "Cleveland · CC0 open access" },
  { name: "Wikimedia Commons", detail: "Community-curated public domain works" },
];

// Right rail — the editorial column, like MarketplaceRail, but explaining
// what "public domain" means here and where the works come from.
export default function ExploreRail() {
  return (
    <aside className="ex-rail" aria-label="About public domain art">
      <div className="ex-rail-section">
        <span className="ex-rail-eyebrow">What is this?</span>
        <h3 className="ex-rail-title">Art That Belongs to Everyone</h3>
        <p className="ex-rail-copy">
          These works are in the public domain. Their copyright has expired or
          been waived, so anyone can view, share, and reuse them freely.
          They&rsquo;re here to explore, not to buy.
        </p>
      </div>

      <div className="ex-rail-section">
        <h3 className="ex-rail-heading">The Collections</h3>
        <ul className="ex-rail-list">
          {COLLECTIONS.map((c) => (
            <li key={c.name} className="ex-rail-list-item">
              <span className="ex-rail-list-name">{c.name}</span>
              <span className="ex-rail-list-detail">{c.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="ex-rail-section ex-rail-cta">
        <span className="ex-rail-eyebrow">For Artists</span>
        <h3 className="ex-rail-cta-title">Make the Next Masterpiece</h3>
        <p className="ex-rail-copy">
          List your original work on Immpression and reach collectors.
          Artists keep 90% of every sale.
        </p>
        <a
          href="https://apps.apple.com/app/id6756974604"
          target="_blank"
          rel="noopener noreferrer"
          className="ex-rail-btn"
        >
          Start Selling
        </a>
      </div>
    </aside>
  );
}
