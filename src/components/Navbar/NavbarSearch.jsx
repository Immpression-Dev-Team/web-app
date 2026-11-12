import { useState } from "react";
import { useNavigate } from "react-router-dom";
import searchPath from "../../utils/searchPath.js";

// Navbar search box (marketplace navbar). Submits to the same Search page
// as the homepage search, via the shared searchPath helper.
export default function NavbarSearch({ className = "" }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(searchPath(query));
  };

  return (
    <form className={`nav-search ${className}`} role="search" onSubmit={handleSubmit}>
      <input
        type="search"
        className="nav-search-input"
        placeholder="Search art, artists, styles…"
        aria-label="Search artwork"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="nav-search-btn" aria-label="Search">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  );
}
