import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import ArtCard from "./ArtCard.jsx";
import "./Marketplace.css";
import { API_URL } from "../../API_URL";

const CATEGORIES = [
  "All",
  "paintings",
  "photography",
  "graphic design",
  "illustrations",
  "sculptures",
  "woodwork",
  "graffiti",
  "stencil",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const Marketplace = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalImages, setTotalImages] = useState(0);

  const LIMIT = 24;

  const fetchArtworks = useCallback(async (newPage = 1, reset = true) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: newPage,
        limit: LIMIT,
        sort,
      });
      if (category !== "All") params.append("category", category);

      const res = await fetch(`${API_URL}/marketplace?${params}`);
      const data = await res.json();

      if (data.success) {
        setArtworks((prev) => (reset ? data.images : [...prev, ...data.images]));
        setTotalPages(data.totalPages);
        setTotalImages(data.totalImages);
        setPage(newPage);
      } else {
        setError("Failed to load artworks.");
      }
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, sort]);

  useEffect(() => {
    fetchArtworks(1, true);
  }, [fetchArtworks]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      fetchArtworks(page + 1, false);
    }
  };

  return (
    <div className="marketplace-wrapper">

      {/* Hero */}
      <section className="marketplace-hero">
        <div className="marketplace-hero-inner">
          <motion.span
            className="marketplace-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Original Art for Sale
          </motion.span>
          <motion.h1
            className="marketplace-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            The Collection.
          </motion.h1>
          <motion.p
            className="marketplace-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Discover and own original works from emerging artists.
            Every piece is one of a kind.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="marketplace-filters-section">
        <div className="marketplace-filters-inner">
          <div className="marketplace-category-scroll">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`marketplace-cat-btn ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat === "All" ? "All Work" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="marketplace-sort-wrap">
            <select
              className="marketplace-sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
        {!loading && totalImages > 0 && (
          <p className="marketplace-count">
            {totalImages} work{totalImages !== 1 ? "s" : ""} available
          </p>
        )}
      </section>

      {/* Grid */}
      <section className="marketplace-grid-section">
        <div className="marketplace-grid-inner">
          {loading ? (
            <div className="marketplace-loading">
              <div className="marketplace-spinner" />
              <p>Loading collection...</p>
            </div>
          ) : error ? (
            <div className="marketplace-error">
              <p>{error}</p>
              <button className="marketplace-retry-btn" onClick={() => fetchArtworks(1, true)}>
                Try Again
              </button>
            </div>
          ) : artworks.length === 0 ? (
            <div className="marketplace-empty">
              <span className="marketplace-empty-icon">✦</span>
              <p>No artworks found in this category yet.</p>
            </div>
          ) : (
            <div className="marketplace-grid">
              {artworks.map((art, i) => (
                <motion.div
                  key={art._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.6) }}
                >
                  <ArtCard artwork={art} />
                </motion.div>
              ))}
            </div>
          )}

          {!loading && page < totalPages && (
            <div className="marketplace-load-more">
              <button
                className="marketplace-load-btn"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Marketplace;
