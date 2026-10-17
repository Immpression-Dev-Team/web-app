import { Link } from "react-router-dom";
import { SOURCES } from "../exploreSources.js";
import "./ExploreLeftRail.css";

const ARTISTS = [
  "Monet", "Van Gogh", "Rembrandt", "Vermeer",
  "Degas", "Cézanne", "Renoir", "Hokusai",
];

const MOVEMENTS = [
  "Impressionism", "Renaissance", "Baroque",
  "Ukiyo-e", "Romanticism", "Landscape", "Portrait",
];

// Mirrors MarketplaceLeftRail's sections (Discover / Browse by Medium /
// CTA), with public-domain equivalents: museums instead of mediums, and
// artist / movement quick-searches instead of price.
export default function ExploreLeftRail({ query, source, setSource, applyQuery }) {
  const activeQuery = query.toLowerCase();

  return (
    <aside className="ex-left-rail" aria-label="Browse public domain art">
      <div className="ex-left-section">
        <h3 className="ex-left-title">Browse by Museum</h3>
        <ul className="ex-source-list">
          {SOURCES.map((s) => (
            <li key={s.key}>
              <button
                type="button"
                className={`ex-source-item${source === s.key ? " active" : ""}`}
                onClick={() => setSource(s.key)}
                aria-pressed={source === s.key}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="ex-left-section">
        <h3 className="ex-left-title">Old Masters</h3>
        <ChipList items={ARTISTS} activeQuery={activeQuery} applyQuery={applyQuery} />
      </div>

      <div className="ex-left-section">
        <h3 className="ex-left-title">Movements &amp; Subjects</h3>
        <ChipList items={MOVEMENTS} activeQuery={activeQuery} applyQuery={applyQuery} />
      </div>

      <div className="ex-left-section ex-shop-cta">
        <h3 className="ex-shop-title">Own Something Original</h3>
        <p className="ex-shop-copy">
          Love the classics? Discover one-of-a-kind work from today&rsquo;s emerging artists.
        </p>
        <Link to="/marketplace" className="ex-shop-btn">Shop Original Art</Link>
      </div>
    </aside>
  );
}

function ChipList({ items, activeQuery, applyQuery }) {
  return (
    <div className="ex-chip-list">
      {items.map((item) => {
        const isActive = activeQuery === item.toLowerCase();
        return (
          <button
            key={item}
            type="button"
            className={`ex-chip${isActive ? " active" : ""}`}
            onClick={() => applyQuery(isActive ? "" : item)}
            aria-pressed={isActive}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
