import { Link } from "react-router-dom";
import ArtCard from "./ArtCard.jsx";

// "More Artwork" below the product info (picked by pickMoreArtwork), using
// the home page's marketplace card.
export default function ArtworkRelatedSection({ artworks }) {
  if (!artworks.length) return null;

  return (
    <section className="adp-section adp-related">
      <div className="adp-section-head">
        <h2 className="adp-section-title">More Artwork</h2>
        <Link to="/" className="adp-link">View all</Link>
      </div>
      <div className="adp-related-grid" style={{ "--adp-count": artworks.length }}>
        {artworks.map((art) => (
          <ArtCard key={art._id} artwork={art} />
        ))}
      </div>
    </section>
  );
}
