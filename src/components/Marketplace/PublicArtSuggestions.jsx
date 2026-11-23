import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getPublicDomainFeatured,
  searchPublicDomainArt,
  parseArtworkId,
} from "../../API/publicDomainAPI";

const COUNT = 3;

// The Met currently serves its images behind a bot check, so they can't be
// shown on our pages; skip Met pieces until that changes.
const BLOCKED_SOURCES = new Set(["met"]);

// Top-up searches against Cleveland's open-access collection (reliable
// images). Which one runs is picked from the current artwork's id, so
// different artwork pages suggest different pieces.
const TOP_UP_TERMS = ["landscape", "flowers", "portrait", "sea", "garden", "river", "city", "still life"];

// "Claude Monet (French, 1840–1926)" -> "Claude Monet"
const cleanArtist = (artist = "") => artist.replace(/\s*\(.*$/, "").trim();

function pickTerm(seed = "") {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return TOP_UP_TERMS[hash % TOP_UP_TERMS.length];
}

// Sidebar card on the artwork page (shown when the artist has no other
// listings): three public domain pieces — admin-featured first, then
// Cleveland — each linking to its public art page.
export default function PublicArtSuggestions({ seed }) {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getPublicDomainFeatured(),
      searchPublicDomainArt(pickTerm(seed), "cleveland", 8),
    ]).then(([featured, topUp]) => {
      if (cancelled) return;
      const seen = new Set();
      const picks = [...(featured.data || []), ...(topUp.data || [])].filter((a) => {
        if (!a?.id || seen.has(a.id) || BLOCKED_SOURCES.has(a.source)) return false;
        if (!(a.thumbnailUrl || a.imageUrl)) return false;
        seen.add(a.id);
        return true;
      });
      setArtworks(picks.slice(0, COUNT));
    });
    return () => {
      cancelled = true;
    };
  }, [seed]);

  if (!artworks.length) return null;

  return (
    <section className="adp-card adp-pd-card">
      <svg className="adp-artist-scribble" viewBox="0 0 160 70" aria-hidden="true">
        <path d="M6 64 C 40 34, 92 12, 156 6" />
        <path d="M34 66 C 70 42, 112 24, 154 18" />
        <path d="M72 60 C 98 46, 126 34, 152 28" />
      </svg>

      <h2 className="adp-artist-heading">More Artwork</h2>
      <p className="adp-pd-sub">Discover and buy timeless public domain art.</p>

      <ul className="adp-pd-list">
        {artworks.map((art) => (
          <li key={art.id}>
            <Link to={`/art/${art.source}/${parseArtworkId(art.id)}`} className="adp-pd-item">
              <span className="adp-pd-thumb">
                <img
                  src={art.thumbnailUrl || art.imageUrl}
                  alt={art.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </span>
              <span className="adp-pd-body">
                <span className="adp-pd-title">{art.title}</span>
                {art.artist && <span className="adp-pd-artist">by {cleanArtist(art.artist)}</span>}
              </span>
              <span className="adp-pd-go" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
