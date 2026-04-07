import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import "./ArtworkDetail.css";
import { API_URL } from "../../API_URL";
import appleIcon from "../../assets/headers/Apple.png";
import googlePlayIcon from "../../assets/headers/GooglePlay.png";

// Extract 24-char MongoDB hex ID from the end of the artwork slug
const extractId = (artworkSlug = "") => artworkSlug.match(/[a-f0-9]{24}$/)?.[0];
const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const ArtworkDetail = () => {
  const { artworkSlug } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  const id = extractId(artworkSlug);
  const [moreArtworks, setMoreArtworks] = useState([]);

  useEffect(() => {
    if (!id) {
      setError("Invalid artwork URL.");
      setLoading(false);
      return;
    }

    const fetchArtwork = async () => {
      setLoading(true);
      setError("");
      setImageLoaded(false);
      try {
        const res = await fetch(`${API_URL}/marketplace/${id}`);
        const data = await res.json();
        if (data.success) {
          setArtwork(data.image);
          // Fetch more artworks from same category
          const params = new URLSearchParams({ limit: 7, sort: "newest" });
          if (data.image.category) params.append("category", data.image.category);
          const moreRes = await fetch(`${API_URL}/marketplace?${params}`);
          const moreData = await moreRes.json();
          if (moreData.success) {
            setMoreArtworks(moreData.images.filter((a) => a._id !== data.image._id).slice(0, 6));
          }
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

  const pageUrl = `https://www.immpression.art/marketplace/${slugify(artistName || "artist")}/${slugify(name || "artwork")}-${artwork._id}`;
  const metaDescription = description
    ? `${description.slice(0, 140)}…`
    : `${name} by ${artistName} — original artwork available on Immpression. $${Number(price).toLocaleString()}.`;

  return (
    <div className="artwork-detail-wrapper">

      <Helmet>
        <title>{name} by {artistName} | Immpression</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="og:product" />
        <meta property="og:title" content={`${name} by ${artistName}`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={imageLink} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Immpression" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${name} by ${artistName}`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={imageLink} />

        {/* JSON-LD structured data — Google rich results for products */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": name,
          "description": description || metaDescription,
          "image": imageLink,
          "url": pageUrl,
          "brand": { "@type": "Person", "name": artistName },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": Number(price).toFixed(2),
            "availability": isSold
              ? "https://schema.org/SoldOut"
              : "https://schema.org/InStock",
            "seller": { "@type": "Organization", "name": "Immpression" },
          },
          ...(category && { "category": category }),
        })}</script>
      </Helmet>

      {/* Breadcrumb */}
      <div className="artwork-detail-breadcrumb">
        <Link to="/marketplace" className="artwork-detail-back-link">
          ← Marketplace
        </Link>
        <span className="artwork-detail-breadcrumb-sep">/</span>
        <span className="artwork-detail-breadcrumb-artist">{artistName}</span>
        <span className="artwork-detail-breadcrumb-sep">/</span>
        <span className="artwork-detail-breadcrumb-name">{name}</span>
      </div>

      <div className="artwork-detail-inner">

        {/* Image */}
        <motion.div
          className="artwork-detail-image-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className={`artwork-detail-image-wrap ${imageLoaded ? "loaded" : ""}`}>
            <img
              src={imageLink}
              alt={`${name} by ${artistName}`}
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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
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
                Purchase through the Immpression app.
              </p>
              <div className="artwork-detail-app-links">
                <a
                  href="https://apps.apple.com/app/immpression/id6739459806"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artwork-detail-app-btn"
                >
                  <img src={appleIcon} alt="Apple App Store" className="artwork-detail-app-icon" />
                  Download on App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.immpression.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artwork-detail-app-btn secondary"
                >
                  <img src={googlePlayIcon} alt="Google Play Store" className="artwork-detail-app-icon" />
                  Get on Google Play
                </a>
              </div>
            </div>
          )}
        </motion.div>

        {/* More artwork sidebar */}
        {moreArtworks.length > 0 && (
          <motion.div
            className="artwork-detail-more-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            <span className="artwork-detail-more-label">
              More {category ? category : "artwork"}
            </span>
            <div className="artwork-detail-more-list">
              {moreArtworks.map((art) => {
                const artistSlug = slugify(art.artistName || "artist");
                const artworkSlug = `${slugify(art.name || "artwork")}-${art._id}`;
                return (
                  <Link
                    key={art._id}
                    to={`/marketplace/${artistSlug}/${artworkSlug}`}
                    className="artwork-detail-more-card"
                  >
                    <div className="artwork-detail-more-img-wrap">
                      <img src={art.imageLink} alt={art.name} loading="lazy" />
                    </div>
                    <div className="artwork-detail-more-info">
                      <p className="artwork-detail-more-artist">{art.artistName}</p>
                      <p className="artwork-detail-more-name">{art.name}</p>
                      <p className="artwork-detail-more-price">${Number(art.price).toLocaleString()}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default ArtworkDetail;
