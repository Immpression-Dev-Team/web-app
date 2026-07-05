import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPublicDomainFeatured, searchPublicDomainArt, parseArtworkId } from "../../API/publicDomainAPI";
import "./Explore.css";

const SEARCH_TERMS = [
  "monet", "van gogh", "rembrandt", "degas", "vermeer",
  "raphael", "caravaggio", "botticelli", "titian", "rubens",
  "goya", "turner", "constable", "cezanne", "renoir",
];

export default function Explore() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const searchIndexRef = useRef(0);
  const isFetchingMoreRef = useRef(false);
  const sentinelRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    (async () => {
      const res = await getPublicDomainFeatured();
      if (res.success) setArtworks(res.data);
      setLoading(false);
    })();
  }, []);

  const fetchMore = useCallback(async () => {
    if (isFetchingMoreRef.current || searchIndexRef.current >= SEARCH_TERMS.length) return;
    isFetchingMoreRef.current = true;
    setLoadingMore(true);
    const query = SEARCH_TERMS[searchIndexRef.current];
    const res = await searchPublicDomainArt(query, "all", 20);
    if (res.success && res.data.length > 0) {
      setArtworks(prev => {
        const ids = new Set(prev.map(a => a.id));
        return [...prev, ...res.data.filter(a => !ids.has(a.id))];
      });
    }
    searchIndexRef.current += 1;
    isFetchingMoreRef.current = false;
    setLoadingMore(false);
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) fetchMore(); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchMore, loading]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    clearTimeout(searchTimeoutRef.current);
    if (!value.trim()) {
      searchIndexRef.current = 0;
      setLoading(true);
      getPublicDomainFeatured().then(res => {
        if (res.success) setArtworks(res.data);
        setLoading(false);
      });
      return;
    }
    searchTimeoutRef.current = setTimeout(async () => {
      setSearching(true);
      const res = await searchPublicDomainArt(value.trim(), "all", 40);
      if (res.success) setArtworks(res.data);
      setSearching(false);
    }, 500);
  };

  const getArtworkUrl = (artwork) => `/art/${artwork.source || "met"}/${parseArtworkId(artwork.id)}`;

  const shown = artworks.filter(a => a.thumbnailUrl || a.imageUrl);

  return (
    <div className="explore-wrapper">
      <Helmet>
        <title>Explore Public Domain Art | Immpression</title>
        <meta name="description" content="Browse thousands of public domain masterpieces from the Met Museum and Art Institute of Chicago. Search by artist, style, or movement — free to explore." />
        <link rel="canonical" href="https://www.immpression.art/explore" />
        <meta property="og:title" content="Explore Public Domain Art | Immpression" />
        <meta property="og:description" content="Browse thousands of public domain masterpieces — Van Gogh, Monet, Rembrandt, and more. Free to explore." />
        <meta property="og:url" content="https://www.immpression.art/explore" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Immpression" />
        <meta property="og:image" content="https://www.immpression.art/Immpression_UI_2.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Explore Public Domain Art | Immpression" />
        <meta name="twitter:description" content="Browse thousands of public domain masterpieces from the Met Museum and Art Institute of Chicago." />
        <meta name="twitter:image" content="https://www.immpression.art/Immpression_UI_2.png" />
      </Helmet>

      <section className="explore-hero">
        <div className="explore-hero-inner">
          <p className="explore-eyebrow">Public Domain</p>
          <h1 className="explore-title">500 Years of Art History</h1>
          <p className="explore-subtitle">
            Masterpieces from the Met Museum &amp; Art Institute of Chicago, free to explore.
          </p>
          <div className="explore-search">
            <input
              type="text"
              placeholder="Search by artist, title, or movement…"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="explore-search-input"
            />
            {searchQuery && (
              <button className="explore-search-clear" onClick={() => handleSearch("")}>✕</button>
            )}
          </div>
        </div>
      </section>

      <section className="explore-grid-section">
        <div className="explore-grid-inner">
          {loading || searching ? (
            <div className="explore-loading">
              <div className="explore-spinner" />
              <p>{searching ? "Searching…" : "Loading masterpieces…"}</p>
            </div>
          ) : shown.length === 0 ? (
            <p className="explore-empty">No artworks found for that search.</p>
          ) : (
            <div className="explore-grid">
              {shown.map(artwork => (
                <Link key={artwork.id} to={getArtworkUrl(artwork)} className="explore-card">
                  <div className="explore-card-img-wrap">
                    <img
                      src={artwork.thumbnailUrl || artwork.imageUrl}
                      alt={artwork.title || "Artwork"}
                      className="explore-card-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="explore-card-info">
                    <p className="explore-card-title">{artwork.title || "Untitled"}</p>
                    {artwork.artist && <p className="explore-card-artist">{artwork.artist}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && !searching && !searchQuery && (
            <div ref={sentinelRef} className="explore-sentinel">
              {loadingMore && <div className="explore-spinner" />}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
