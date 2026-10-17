import { Link } from "react-router-dom";
import { parseArtworkId } from "../../API/publicDomainAPI";
import { shortSourceName } from "./exploreSources.js";
import "./PublicArtCard.css";

// Public-domain counterpart to Marketplace/ArtCard — same anatomy (image,
// hover overlay, badge, artist / title / bottom line), but the badge shows
// the lending museum and the bottom line is the date instead of a price.
export default function PublicArtCard({ artwork }) {
  const { id, source, title, artist, year, thumbnailUrl, imageUrl } = artwork;
  const to = `/art/${source || "met"}/${parseArtworkId(id)}`;

  return (
    <Link to={to} className="pd-card">
      <div className="pd-card-image-wrap">
        <img
          src={thumbnailUrl || imageUrl}
          alt={title || "Artwork"}
          className="pd-card-image"
          loading="lazy"
          referrerPolicy="no-referrer"
          // Museum CDNs occasionally fail; show the empty panel, not alt text.
          onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
        />
        <div className="pd-card-overlay">
          <span className="pd-card-view-label">View Artwork</span>
        </div>
        <span className="pd-card-source">{shortSourceName(source)}</span>
      </div>
      <div className="pd-card-info">
        <span className="pd-card-artist">{artist || "Unknown Artist"}</span>
        <p className="pd-card-name">{title || "Untitled"}</p>
        {year && <span className="pd-card-year">{year}</span>}
      </div>
    </Link>
  );
}
