import { Link } from "react-router-dom";
import "./ArtCard.css";

const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const ArtCard = ({ artwork }) => {
  const { _id, name, artistName, price, imageLink, category, isSigned, isFramed, isSold } = artwork;

  const artistSlug = slugify(artistName || "artist");
  const artworkSlug = `${slugify(name || "artwork")}-${_id}`;

  return (
    <Link to={`/marketplace/${artistSlug}/${artworkSlug}`} className={`art-card${isSold ? " art-card--sold" : ""}`}>
      <div className="art-card-image-wrap">
        <img
          src={imageLink}
          alt={name}
          className="art-card-image"
          loading="lazy"
        />
        {isSold ? (
          <div className="art-card-sold-overlay">
            <span className="art-card-sold-label">Sold</span>
          </div>
        ) : (
          <div className="art-card-overlay">
            <span className="art-card-view-label">View Artwork</span>
          </div>
        )}
        {category && (
          <span className="art-card-category">{category}</span>
        )}
      </div>
      <div className="art-card-info">
        <div className="art-card-meta">
          <span className="art-card-artist">{artistName}</span>
          {(isSigned || isFramed) && (
            <div className="art-card-tags">
              {isSigned && <span className="art-card-tag">Signed</span>}
              {isFramed && <span className="art-card-tag">Framed</span>}
            </div>
          )}
        </div>
        <p className="art-card-name">{name}</p>
        {isSold
          ? <span className="art-card-price art-card-price--sold">Sold</span>
          : <span className="art-card-price">${Number(price).toLocaleString()}</span>
        }
      </div>
    </Link>
  );
};

export default ArtCard;
