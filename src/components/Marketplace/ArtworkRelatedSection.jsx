import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ArtCard from "./ArtCard.jsx";

export default function ArtworkRelatedSection({ artworks }) {
  if (!artworks.length) return null;

  return (
    <section className="adr-related-section">
      <div className="adr-section-head">
        <h2 className="adr-related-title">Related Artwork</h2>
        <Link to="/marketplace" className="mp-rail-link">View all</Link>
      </div>
      <div className="adr-related-grid">
        {artworks.map((art, i) => (
          <motion.div
            key={art._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
          >
            <ArtCard artwork={art} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
