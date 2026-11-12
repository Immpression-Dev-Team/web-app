import { Link } from "react-router-dom";
import "./ArtCard.css";

const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Marketplace listing card (also used by Search and related artworks). The
// whole card is one link to the artwork's detail page.
const ArtCard = ({ artwork }) => {
  const { _id, name, artistName, price, imageLink, isSigned, isFramed, isSold } = artwork;

  const artistSlug = slugify(artistName || "artist");
  const artworkSlug = `${slugify(name || "artwork")}-${_id}`;

  return (
    <Link
      to={`/marketplace/${artistSlug}/${artworkSlug}`}
      className={`art-card${isSold ? " art-card--sold" : ""}`}
    >
      <div className="art-card-image-wrap">
        <img
          src={imageLink}
          alt={name}
          className="art-card-image"
          loading="lazy"
        />
        {isSold && <span className="art-card-badge art-card-badge--sold">Sold</span>}
      </div>

      <div className="art-card-info">
        <p className="art-card-name">{name}</p>
        <span className="art-card-artist">{artistName}</span>
        <div className="art-card-bottom">
          {isSold
            ? <span className="art-card-price art-card-price--sold">Sold</span>
            : <span className="art-card-price">${Number(price).toLocaleString()}</span>
          }
          {(isSigned || isFramed) && (
            <div className="art-card-tags">
              {isSigned && <span className="art-card-tag">Signed</span>}
              {isFramed && <span className="art-card-tag">Framed</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ArtCard;
