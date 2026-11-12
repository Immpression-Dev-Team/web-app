// URL for the site-wide art search (Search page). Shared by every search box
// so they all behave the same; an empty query opens the Search page itself.
export default function searchPath(query) {
  const q = (query || "").trim();
  return q ? `/search?q=${encodeURIComponent(q)}` : "/search";
}
