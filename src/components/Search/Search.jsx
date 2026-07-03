import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ArtCard from "../Marketplace/ArtCard.jsx";
import "./Search.css";
import { API_URL } from "../../API_URL";

function parseArtworkId(rawId) {
  const str = String(rawId);
  return str.includes(":") ? str.split(":")[1] : str;
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQ = searchParams.get("q") || "";

  const [inputValue, setInputValue] = useState(initialQ);
  const [marketplace, setMarketplace] = useState([]);
  const [publicDomain, setPublicDomain] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchedQ, setSearchedQ] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setInputValue(q);
    if (q.trim()) runSearch(q.trim());
  }, [searchParams]);

  async function runSearch(q) {
    setLoading(true);
    setError("");
    setSearchedQ(q);
    try {
      const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(q)}&limit=12`);
      const data = await res.json();
      if (data.success) {
        setMarketplace(data.marketplace || []);
        setPublicDomain(data.publicDomain || []);
      } else {
        setError("Search failed. Please try again.");
      }
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  const total = marketplace.length + publicDomain.length;

  return (
    <div className="search-wrapper">
      <Helmet>
        <title>{searchedQ ? `"${searchedQ}" — Search | Immpression` : "Search | Immpression"}</title>
        <meta name="description" content="Search across original artwork from emerging artists and public domain masterpieces." />
      </Helmet>

      {/* Search header */}
      <section className="search-header">
        <div className="search-header-inner">
          <form className="search-bar-wrap" onSubmit={handleSubmit}>
            <svg className="search-bar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="search-bar-input"
              placeholder="Search by artist, style, keyword, or anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
            <button type="submit" className="search-bar-btn">Search</button>
          </form>

          {!loading && searchedQ && (
            <p className="search-meta">
              {total > 0
                ? `${total} result${total !== 1 ? "s" : ""} for "${searchedQ}"`
                : `No results for "${searchedQ}"`}
            </p>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="search-results">
        <div className="search-results-inner">

          {loading && (
            <div className="search-loading">
              <div className="search-spinner" />
              <p>Searching across artists and masterpieces…</p>
            </div>
          )}

          {error && !loading && (
            <p className="search-error">{error}</p>
          )}

          {!loading && !error && searchedQ && total === 0 && (
            <div className="search-empty">
              <p className="search-empty-title">No results found</p>
              <p className="search-empty-sub">Try a different artist name, style, or keyword.</p>
            </div>
          )}

          {!loading && !searchedQ && (
            <div className="search-empty">
              <p className="search-empty-title">Start searching</p>
              <p className="search-empty-sub">Search across thousands of original artworks and public domain masterpieces.</p>
            </div>
          )}

          {/* Marketplace results */}
          {!loading && marketplace.length > 0 && (
            <div className="search-section">
              <div className="search-section-header">
                <div>
                  <h2 className="search-section-title">From Our Artists</h2>
                  <p className="search-section-sub">Original works for sale</p>
                </div>
                <Link to={`/marketplace?q=${encodeURIComponent(searchedQ)}`} className="search-section-link">
                  Browse all →
                </Link>
              </div>
              <div className="search-grid search-grid--marketplace">
                {marketplace.map((art) => (
                  <ArtCard key={art._id} artwork={art} />
                ))}
              </div>
            </div>
          )}

          {/* Public domain results */}
          {!loading && publicDomain.length > 0 && (
            <div className="search-section">
              <div className="search-section-header">
                <div>
                  <h2 className="search-section-title">Masters &amp; Masterpieces</h2>
                  <p className="search-section-sub">Public domain art from world-class museums</p>
                </div>
                <Link to={`/explore`} className="search-section-link">
                  Explore all →
                </Link>
              </div>
              <div className="search-grid search-grid--public">
                {publicDomain.map((art) => (
                  <Link
                    key={art.id}
                    to={`/art/${art.source || "met"}/${parseArtworkId(art.id)}`}
                    className="search-public-card"
                  >
                    <div className="search-public-img-wrap">
                      <img
                        src={art.thumbnailUrl || art.imageUrl}
                        alt={art.title || "Artwork"}
                        className="search-public-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="search-public-info">
                      <p className="search-public-title">{art.title || "Untitled"}</p>
                      {art.artist && <p className="search-public-artist">{art.artist}</p>}
                      {art.year && <p className="search-public-year">{art.year}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
