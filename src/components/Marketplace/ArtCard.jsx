import { Link } from "react-router-dom";
import "./ArtCard.css";

const ArtCard = ({ artwork }) => {
  const { _id, name, artistName, price, imageLink, category, isSigned, isFramed } = artwork;

  return (
    <Link to={`/marketplace/${_id}`} className="art-card">
      <div className="art-card-image-wrap">
        <img
          src={imageLink}
          alt={name}
          className="art-card-image"
          loading="lazy"
        />
        <div className="art-card-overlay">
          <span className="art-card-view-label">View Artwork</span>
        </div>
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
        <span className="art-card-price">${Number(price).toLocaleString()}</span>
      </div>
    </Link>
  );
};

export default ArtCard;
