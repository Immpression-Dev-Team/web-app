/* eslint-disable react/prop-types -- no prop-types dependency in this
   project (see ArtCard.jsx for the same pre-existing pattern); all props
   here are optional strings with defaults. */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Same search bar markup/behavior as the Marketplace artwork detail page
// (see components/Marketplace/ArtworkDetail.jsx) — reused here rather than
// duplicated. It intentionally renders with the same `artwork-detail-search-*`
// class names so it inherits that page's existing CSS (all component CSS is
// bundled globally in this app), then an optional `className` adds page-specific
// color overrides on top without touching the Marketplace styles.
export default function ArtworkSearchBar({
  destination = "/search",
  placeholder = "Search artworks, artists…",
  className = "",
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`${destination}?q=${encodeURIComponent(q)}`);
  };

  return (
    <form
      className={`artwork-detail-search-form${className ? ` ${className}` : ""}`}
      onSubmit={handleSubmit}
    >
      <svg className="artwork-detail-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        className="artwork-detail-search-input"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button type="submit" className="artwork-detail-search-btn">Search</button>
    </form>
  );
}
