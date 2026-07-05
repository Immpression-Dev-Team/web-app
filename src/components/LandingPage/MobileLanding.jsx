import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../API_URL";
import GooglePlay from '../../assets/headers/GooglePlay.png';
import Apple from '../../assets/headers/Apple.png';
import "./MobileLanding.css";

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parseArtworkId(rawId) {
  const str = String(rawId);
  return str.includes(":") ? str.split(":")[1] : str;
}

const TRENDING = ["Abstract", "Portrait", "Van Gogh", "Photography", "Sculpture", "NYC Art"];

export default function MobileLanding({ searchQuery, setSearchQuery, onSearch }) {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [mktRes, pdRes] = await Promise.allSettled([
        fetch(`${API_URL}/marketplace?limit=12&sort=newest`).then(r => r.json()),
        fetch(`${API_URL}/public-art/featured`).then(r => r.json()),
      ]);

      const mkt = (mktRes.status === "fulfilled" && mktRes.value.success)
        ? mktRes.value.images
            .filter(img => img.imageLink)
            .slice(0, 8)
            .map(img => ({
              id: img._id,
              type: "marketplace",
              src: img.imageLink,
              title: img.name || "Untitled",
              artist: img.artistName || "Unknown Artist",
              price: img.price ? `$${Number(img.price).toLocaleString()}` : null,
              medium: img.category || null,
              href: `/marketplace/${slugify(img.artistName || "artist")}/${slugify(img.name || "artwork")}-${img._id}`,
            }))
        : [];

      const pd = (pdRes.status === "fulfilled" && pdRes.value.success)
        ? pdRes.value.data
            .filter(a => a.thumbnailUrl || a.imageUrl)
            .slice(0, 10)
            .map(a => ({
              id: String(a.id),
              type: "public",
              src: a.thumbnailUrl || a.imageUrl,
              title: a.title || "Untitled",
              artist: a.artistDisplayName || a.artistName || "Unknown Artist",
              medium: a.medium || null,
              dimensions: a.dimensions || null,
              href: `/art/${a.source || "met"}/${parseArtworkId(a.id)}`,
            }))
        : [];

      // Interleave marketplace first, public domain second
      const merged = [];
      const max = Math.max(mkt.length, pd.length);
      for (let i = 0; i < max; i++) {
        if (mkt[i]) merged.push(mkt[i]);
        if (pd[i]) merged.push(pd[i]);
      }

      setArtworks(merged.slice(0, 13));
      setLoading(false);
    }
    load();
  }, []);

  const featured = artworks[0] ?? null;
  const grid = artworks.slice(1, 11);

  return (
    <div className="mlp">

      {/* ── Hero ── */}
      <section className="mlp-hero">

        {/* Paint splashes — top-left teal */}
        <svg className="mlp-splash mlp-splash-tl" viewBox="0 0 240 260" fill="none" aria-hidden="true">
          <path d="M-10,50 C10,5 55,-5 95,18 C135,41 148,82 168,98 C188,114 218,102 228,122 C238,142 220,174 198,180 C176,186 150,162 128,168 C106,174 94,202 70,196 C46,190 18,168 8,140 C-2,112 -30,95 -10,50Z" fill="rgba(71,239,172,0.045)" />
          <path d="M58,168 C60,188 57,208 61,220 C62,225 59,222 58,213 C56,198 59,180 58,168Z" fill="rgba(71,239,172,0.038)" />
          <path d="M96,175 C98,191 97,205 100,213 C101,217 99,213 98,205 C96,194 97,186 96,175Z" fill="rgba(71,239,172,0.03)" />
          <circle cx="12" cy="12" r="3.5" fill="rgba(71,239,172,0.07)" />
          <circle cx="32" cy="4" r="2" fill="rgba(71,239,172,0.05)" />
          <circle cx="4" cy="38" r="2.5" fill="rgba(71,239,172,0.04)" />
          <circle cx="178" cy="28" r="1.5" fill="rgba(71,239,172,0.05)" />
          <circle cx="148" cy="8" r="1" fill="rgba(71,239,172,0.04)" />
          <circle cx="68" cy="5" r="1.5" fill="rgba(71,239,172,0.03)" />
        </svg>

        {/* Paint splash — top-right blue */}
        <svg className="mlp-splash mlp-splash-tr" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <path d="M200,0 C178,28 155,12 128,34 C101,56 112,90 90,102 C68,114 40,98 24,115 C8,132 20,165 42,170 C64,175 92,152 114,147 C136,142 162,158 184,146 C206,134 214,102 204,75 C194,48 222,-28 200,0Z" fill="rgba(126,184,255,0.032)" />
          <circle cx="188" cy="8" r="2.5" fill="rgba(126,184,255,0.055)" />
          <circle cx="165" cy="2" r="1.5" fill="rgba(126,184,255,0.04)" />
          <circle cx="196" cy="28" r="2" fill="rgba(126,184,255,0.04)" />
          <circle cx="145" cy="15" r="1" fill="rgba(126,184,255,0.03)" />
        </svg>

        <p className="mlp-eyebrow">✦ ART SEARCH ENGINE &amp; MARKETPLACE</p>

        <h1 className="mlp-title">
          Find Art.<br />
          <span className="mlp-accent">Own It.</span>
        </h1>

        <p className="mlp-subtitle">
          Search thousands of artworks, discover emerging artists, and buy originals directly from creators.
        </p>

        {/* Search bar */}
        <form className="mlp-search" onSubmit={onSearch}>
          <svg className="mlp-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="mlp-search-input"
            placeholder="Search art, artist, style..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="mlp-search-btn">Search</button>
        </form>

        {/* Trending chips */}
        <div className="mlp-trending">
          <span className="mlp-trending-label">Trending</span>
          <div className="mlp-chip-row">
            {TRENDING.map(term => (
              <button
                key={term}
                className="mlp-chip"
                onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* App store buttons */}
        <div className="mlp-stores">
          <a
            href="https://play.google.com/store/apps/details?id=com.immpression.artapp"
            target="_blank"
            rel="noopener noreferrer"
            className="mlp-store-link"
          >
            <img src={GooglePlay} alt="Get it on Google Play" className="mlp-store-img" />
          </a>
          <a
            href="https://apps.apple.com/app/id6756974604"
            target="_blank"
            rel="noopener noreferrer"
            className="mlp-store-link"
          >
            <img src={Apple} alt="Download on the App Store" className="mlp-store-img" />
          </a>
        </div>

      </section>

      {/* ── Featured Artwork ── */}
      {!loading && featured && (
        <section className="mlp-featured">
          <div className="mlp-section-head">
            <h2 className="mlp-section-title">Featured Artwork</h2>
            <Link
              to={featured.type === "marketplace" ? "/marketplace" : "/explore"}
              className="mlp-see-all"
            >
              See all →
            </Link>
          </div>

          <Link to={featured.href} className="mlp-feat-card">
            <div className="mlp-feat-img-wrap">
              <img
                src={featured.src}
                alt={featured.title}
                className="mlp-feat-img"
                loading="lazy"
              />
              <div className="mlp-feat-overlay">
                <span className="mlp-feat-badge">
                  {featured.type === "marketplace" ? "Original" : "Public Domain"}
                </span>
                <h3 className="mlp-feat-title">{featured.title}</h3>
                <p className="mlp-feat-artist">by {featured.artist}</p>
                <div className="mlp-feat-footer">
                  {featured.price && <span className="mlp-feat-price">{featured.price}</span>}
                  <span className="mlp-feat-cta">View →</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── Discover Grid ── */}
      {!loading && grid.length > 0 && (
        <section className="mlp-discover">
          <div className="mlp-section-head">
            <h2 className="mlp-section-title">Discover</h2>
            <Link to="/explore" className="mlp-see-all">Explore all →</Link>
          </div>

          <div className="mlp-grid">
            {grid.map(art => (
              <Link key={art.id} to={art.href} className="mlp-grid-card">
                <div className="mlp-grid-img-wrap">
                  <img
                    src={art.src}
                    alt={art.title}
                    className="mlp-grid-img"
                    loading="lazy"
                  />
                  <div className="mlp-grid-overlay">
                    <p className="mlp-grid-title">{art.title}</p>
                    {art.price
                      ? <span className="mlp-grid-price">{art.price}</span>
                      : <span className="mlp-grid-artist">{art.artist}</span>
                    }
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mlp-cta-row">
            <Link to="/explore" className="mlp-cta-btn">
              Explore More Art
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="mlp-loading">
          <div className="mlp-spinner" />
          <p className="mlp-loading-text">Loading artworks…</p>
        </div>
      )}

    </div>
  );
}
