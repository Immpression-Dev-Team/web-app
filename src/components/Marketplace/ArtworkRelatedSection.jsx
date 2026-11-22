import { Link } from "react-router-dom";
import ArtCard from "./ArtCard.jsx";

// Same-category artworks below the product info, using the home page's
// marketplace card.
export default function ArtworkRelatedSection({ artworks }) {
  if (!artworks.length) return null;

  return (
    <section className="adp-section">
      <div className="adp-section-head">
        <h2 className="adp-section-title">Related Artwork</h2>
        <Link to="/" className="adp-link">View all</Link>
      </div>
      <div className="adp-related-grid">
        {artworks.map((art) => (
          <ArtCard key={art._id} artwork={art} />
        ))}
      </div>
    </section>
  );
}
