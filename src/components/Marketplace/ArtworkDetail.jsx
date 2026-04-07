import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./ArtworkDetail.css";
import { API_URL } from "../../API_URL";

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchArtwork = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/marketplace/${id}`);
        const data = await res.json();
        if (data.success) {
          setArtwork(data.image);
        } else {
          setError(data.error || "Artwork not found.");
        }
      } catch {
        setError("Could not load this artwork.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  if (loading) {
    return (
      <div className="artwork-detail-wrapper">
        <div className="artwork-detail-loading">
          <div className="artwork-detail-spinner" />
          <p>Loading artwork...</p>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="artwork-detail-wrapper">
        <div className="artwork-detail-error">
          <p>{error || "Artwork not found."}</p>
          <button className="artwork-detail-back-btn" onClick={() => navigate("/marketplace")}>
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const {
    name,
    artistName,
    price,
    imageLink,
    category,
    description,
    dimensions,
    weight,
    isSigned,
    isFramed,
    views,
    createdAt,
    isSold,
  } = artwork;

  const listedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : null;

  return (
    <div className="artwork-detail-wrapper">

      {/* Back nav */}
      <div className="artwork-detail-breadcrumb">
        <Link to="/marketplace" className="artwork-detail-back-link">
          ← Back to Marketplace
        </Link>
      </div>

      <div className="artwork-detail-inner">

        {/* Image */}
        <motion.div
          className="artwork-detail-image-col"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65 }}
        >
          <div className={`artwork-detail-image-wrap ${imageLoaded ? "loaded" : ""}`}>
            <img
              src={imageLink}
              alt={name}
              className="artwork-detail-image"
              onLoad={() => setImageLoaded(true)}
            />
            {isSold && (
              <div className="artwork-detail-sold-badge">Sold</div>
            )}
          </div>
          {views !== undefined && (
            <p className="artwork-detail-views">{views.toLocaleString()} view{views !== 1 ? "s" : ""}</p>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          className="artwork-detail-info-col"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          {category && (
            <span className="artwork-detail-category">{category}</span>
          )}

          <h1 className="artwork-detail-name">{name}</h1>
          <p className="artwork-detail-artist">by {artistName}</p>

          <div className="artwork-detail-price-row">
            <span className="artwork-detail-price">${Number(price).toLocaleString()}</span>
            {isSold && <span className="artwork-detail-sold-tag">Sold</span>}
          </div>

          {description && (
            <div className="artwork-detail-section">
              <span className="artwork-detail-section-label">About this piece</span>
              <p className="artwork-detail-description">{description}</p>
            </div>
          )}

          <div className="artwork-detail-section">
            <span className="artwork-detail-section-label">Details</span>
            <div className="artwork-detail-specs">
              {dimensions?.height && dimensions?.width && (
                <div className="artwork-detail-spec">
                  <span className="artwork-detail-spec-key">Dimensions</span>
                  <span className="artwork-detail-spec-val">
                    {dimensions.height}" × {dimensions.width}"
                    {dimensions.length ? ` × ${dimensions.length}"` : ""}
                  </span>
                </div>
              )}
              {weight && (
                <div className="artwork-detail-spec">
                  <span className="artwork-detail-spec-key">Weight</span>
                  <span className="artwork-detail-spec-val">{weight} lbs</span>
                </div>
              )}
              <div className="artwork-detail-spec">
                <span className="artwork-detail-spec-key">Signed</span>
                <span className="artwork-detail-spec-val">{isSigned ? "Yes" : "No"}</span>
              </div>
              <div className="artwork-detail-spec">
                <span className="artwork-detail-spec-key">Framed</span>
                <span className="artwork-detail-spec-val">{isFramed ? "Yes" : "No"}</span>
              </div>
              {listedDate && (
                <div className="artwork-detail-spec">
                  <span className="artwork-detail-spec-key">Listed</span>
                  <span className="artwork-detail-spec-val">{listedDate}</span>
                </div>
              )}
            </div>
          </div>

          {!isSold && (
            <div className="artwork-detail-cta-block">
              <p className="artwork-detail-cta-note">
                Purchases are made through the Immpression app.
              </p>
              <div className="artwork-detail-app-links">
                <a
                  href="https://apps.apple.com/app/immpression/id6739459806"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artwork-detail-app-btn"
                >
                  Get on App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.immpression.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artwork-detail-app-btn secondary"
                >
                  Get on Google Play
                </a>
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default ArtworkDetail;
