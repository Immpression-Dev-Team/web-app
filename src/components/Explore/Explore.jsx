import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { getPublicDomainFeatured, searchPublicDomainArt } from "../../API/publicDomainAPI";
import PublicArtCard from "./PublicArtCard.jsx";
import ExploreLeftRail from "./ExploreLeftRail/ExploreLeftRail.jsx";
import ExploreRail from "./ExploreRail/ExploreRail.jsx";
import ExploreToolbar from "./ExploreToolbar/ExploreToolbar.jsx";
import ExploreFiltersDrawer from "./ExploreFiltersDrawer/ExploreFiltersDrawer.jsx";
import { SOURCES } from "./exploreSources.js";
import "./Explore.css";

// Terms used to keep the default (no-search) grid growing on scroll.
const BROWSE_TERMS = [
  "monet", "van gogh", "rembrandt", "degas", "vermeer",
  "raphael", "caravaggio", "botticelli", "titian", "rubens",
  "goya", "turner", "constable", "cezanne", "renoir",
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "title", label: "Title: A to Z" },
  { value: "artist", label: "Artist: A to Z" },
];

const hasImage = (a) => a.thumbnailUrl || a.imageUrl;

export default function Explore() {
  // Other pages (e.g. the public-domain detail page's search bar) link
  // straight into results here via /explore?q=...
  const [searchParams, setSearchParams] = useSearchParams();

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState(() => searchParams.get("q") || "");
  const [source, setSource] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const browseIndexRef = useRef(0);
  const isFetchingMoreRef = useRef(false);
  const requestIdRef = useRef(0);
  const sentinelRef = useRef(null);
  const debounceRef = useRef(null);

  // The URL is the source of truth for the search, so /explore?q=... links
  // (including ones followed while already on this page) just work.
  const query = (searchParams.get("q") || "").trim();
  const setQuery = useCallback(
    (value) => setSearchParams(value ? { q: value } : {}, { replace: true }),
    [setSearchParams]
  );
  const isBrowsing = !query;

  // Reflect external URL changes (back/forward, links) in the input.
  useEffect(() => {
    setSearchInput((prev) => (prev.trim() === query ? prev : query));
  }, [query]);

  // Initial / filter-driven load. A request id guards against a slow
  // earlier response overwriting a newer one.
  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    browseIndexRef.current = 0;
    setLoading(true);
    setError("");

    const res = query
      ? await searchPublicDomainArt(query, source, 40)
      : await getPublicDomainFeatured();

    if (requestId !== requestIdRef.current) return;

    if (res.success) {
      const list = query || source === "all"
        ? res.data
        : res.data.filter((a) => a.source === source);
      setArtworks(list);
    } else {
      setArtworks([]);
      setError("Couldn't reach the museum collections.");
    }
    setLoading(false);
  }, [query, source]);

  useEffect(() => { load(); }, [load]);

  const fetchMore = useCallback(async () => {
    if (!isBrowsing || isFetchingMoreRef.current) return;
    if (browseIndexRef.current >= BROWSE_TERMS.length) return;

    isFetchingMoreRef.current = true;
    setLoadingMore(true);
    const requestId = requestIdRef.current;
    const term = BROWSE_TERMS[browseIndexRef.current];
    browseIndexRef.current += 1;

    const res = await searchPublicDomainArt(term, source, 20);
    if (requestId === requestIdRef.current && res.success && res.data.length) {
      setArtworks((prev) => {
        const ids = new Set(prev.map((a) => a.id));
        return [...prev, ...res.data.filter((a) => !ids.has(a.id))];
      });
    }
    isFetchingMoreRef.current = false;
    setLoadingMore(false);
  }, [isBrowsing, source]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) fetchMore(); },
      { rootMargin: "400px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchMore, loading]);

  const handleSearchInput = (value) => {
    setSearchInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setQuery(value.trim()), 500);
  };

  // Rail picks (artists, movements) apply immediately.
  const applyQuery = (value) => {
    clearTimeout(debounceRef.current);
    setSearchInput(value);
    setQuery(value.trim());
  };

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const shown = useMemo(() => {
    const list = artworks.filter(hasImage);
    if (sort === "title") {
      return [...list].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }
    if (sort === "artist") {
      return [...list].sort((a, b) => (a.artist || "").localeCompare(b.artist || ""));
    }
    return list;
  }, [artworks, sort]);

  const railProps = {
    query,
    source,
    setSource,
    applyQuery,
  };

  return (
    <div className="explore-wrapper">
      <Helmet>
        <title>Explore Public Domain Art | Immpression</title>
        <meta name="description" content="Browse thousands of public domain masterpieces from the Met, the Art Institute of Chicago, the Cleveland Museum of Art and Wikimedia Commons. Search by artist, style, or movement — free to explore." />
        <link rel="canonical" href="https://www.immpression.art/explore" />
        <meta property="og:title" content="Explore Public Domain Art | Immpression" />
        <meta property="og:description" content="Browse thousands of public domain masterpieces — Van Gogh, Monet, Rembrandt, and more. Free to explore." />
        <meta property="og:url" content="https://www.immpression.art/explore" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Immpression" />
        <meta property="og:image" content="https://www.immpression.art/Immpression_UI_2.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Explore Public Domain Art | Immpression" />
        <meta name="twitter:description" content="Browse thousands of public domain masterpieces from the world's great museums." />
        <meta name="twitter:image" content="https://www.immpression.art/Immpression_UI_2.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Explore Public Domain Art",
          "description": "Browse thousands of public domain masterpieces on Immpression.",
          "url": "https://www.immpression.art/explore",
          "isPartOf": { "@id": "https://www.immpression.art/#website" },
        })}</script>
      </Helmet>

      <div className="explore-rail-col explore-rail-col--left">
        <ExploreLeftRail {...railProps} />
      </div>

      <div className="explore-main-col">
        <section className="explore-hero">
          <div className="explore-hero-inner">
            <motion.span
              className="explore-eyebrow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Public Domain Collection
            </motion.span>
            <motion.h1
              className="explore-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              500 Years of Art History.
            </motion.h1>
            <motion.p
              className="explore-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Masterpieces from the world&rsquo;s great museums, free for everyone to explore.
            </motion.p>
            <motion.div
              className="explore-search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <input
                type="text"
                placeholder="Search by artist, title, or movement…"
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="explore-search-input"
                aria-label="Search public domain art"
              />
              {searchInput && (
                <button
                  type="button"
                  className="explore-search-clear"
                  onClick={() => applyQuery("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </motion.div>
          </div>
        </section>

        <section className="explore-grid-section">
          <div className="explore-main">
            <ExploreToolbar
              count={!loading ? shown.length : null}
              isBrowsing={isBrowsing}
              query={query}
              clearQuery={() => applyQuery("")}
              source={source}
              clearSource={() => setSource("all")}
              sourceLabel={SOURCES.find((s) => s.key === source)?.label}
              sort={sort}
              setSort={setSort}
              sortOptions={SORT_OPTIONS}
              onOpenFilters={() => setFiltersOpen(true)}
            />

            {loading ? (
              <div className="explore-state">
                <div className="explore-spinner" />
                <p>{query ? "Searching the collections…" : "Loading masterpieces…"}</p>
              </div>
            ) : error ? (
              <div className="explore-state">
                <p>{error}</p>
                <button type="button" className="explore-retry-btn" onClick={load}>
                  Try Again
                </button>
              </div>
            ) : shown.length === 0 ? (
              <div className="explore-state">
                <span className="explore-empty-icon">✦</span>
                <p>
                  {query
                    ? `No public domain works found for “${query}”.`
                    : "No works from this museum in the featured set yet."}
                </p>
              </div>
            ) : (
              <div className="explore-grid">
                {shown.map((artwork, i) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: Math.min((i % 24) * 0.04, 0.6) }}
                  >
                    <PublicArtCard artwork={artwork} />
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && !error && isBrowsing && (
              <div ref={sentinelRef} className="explore-sentinel">
                {loadingMore && <div className="explore-spinner" />}
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="explore-rail-col explore-rail-col--right">
        <ExploreRail />
      </div>

      <ExploreFiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        {...railProps}
      />
    </div>
  );
}
