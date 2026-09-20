import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import "./ArtworkDetail.css";
import { API_URL } from "../../API_URL";
import appleIcon from "../../assets/headers/Apple.png";
import googlePlayIcon from "../../assets/headers/GooglePlay.png";
import ArtworkDetailLeftRail from "./ArtworkDetailLeftRail/ArtworkDetailLeftRail.jsx";
import ArtworkDetailRightRail from "./ArtworkDetailRightRail/ArtworkDetailRightRail.jsx";
import ArtworkArtistSection from "./ArtworkArtistSection.jsx";
import ArtworkRelatedSection from "./ArtworkRelatedSection.jsx";
import useSavedArtwork from "./useSavedArtwork.js";

// Extract 24-char MongoDB hex ID from the end of the artwork slug
const extractId = (artworkSlug = "") => artworkSlug.match(/[a-f0-9]{24}$/)?.[0];
const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const ArtworkDetail = () => {
  const { artworkSlug } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [artist, setArtist] = useState(null);
  const [artistWorks, setArtistWorks] = useState([]);
  const [relatedArtworks, setRelatedArtworks] = useState([]);
  const [rightRailArtworks, setRightRailArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  const id = extractId(artworkSlug);
  const [searchQuery, setSearchQuery] = useState("");
  const [saved, toggleSaved] = useSavedArtwork(id);

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
      setArtist(null);
      setArtistWorks([]);
      try {
        const res = await fetch(`${API_URL}/marketplace/${id}`);
        const data = await res.json();
        if (data.success) {
          setArtwork(data.image);

          // Same-category artworks, split between the right rail's compact
          // list and the center "Related Artwork" grid so nothing repeats.
          const params = new URLSearchParams({ limit: 10, sort: "newest" });
          if (data.image.category) params.append("category", data.image.category);
          fetch(`${API_URL}/marketplace?${params}`)
            .then((r) => r.json())
            .then((moreData) => {
              if (!moreData.success) return;
              const others = moreData.images.filter((a) => a._id !== data.image._id);
              setRightRailArtworks(others.slice(0, 4));
              setRelatedArtworks(others.slice(4, 9));
            })
            .catch(() => {});

          // Artist profile + their other pieces (real endpoints, no
          // fabricated follower counts or profile data).
          if (data.image.userId) {
            fetch(`${API_URL}/profile/${data.image.userId}`)
              .then((r) => r.json())
              .then((profileData) => { if (profileData.success) setArtist(profileData.user); })
              .catch(() => {});

            fetch(`${API_URL}/profile/${data.image.userId}/images`)
              .then((r) => r.json())
              .then((worksData) => {
                if (!worksData.success) return;
                setArtistWorks(worksData.images.filter((a) => a._id !== data.image._id).slice(0, 4));
              })
              .catch(() => {});
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
        <meta property="og:type" content="product" />
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

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Immpression", "item": "https://www.immpression.art" },
            { "@type": "ListItem", "position": 2, "name": "Marketplace", "item": "https://www.immpression.art/marketplace" },
            { "@type": "ListItem", "position": 3, "name": name, "item": pageUrl },
          ],
        })}</script>
      </Helmet>

      <div className="artwork-detail-rail-col artwork-detail-rail-col--left">
        <ArtworkDetailLeftRail
          artwork={artwork}
          artist={artist}
          artistWorks={artistWorks}
          saved={saved}
          onToggleSave={toggleSaved}
          pageUrl={pageUrl}
        />
      </div>

      <div className="artwork-detail-main-col">

        {/* Breadcrumb + search on same row */}
        <div className="artwork-detail-breadcrumb">
          <div className="artwork-detail-breadcrumb-left">
            <Link to="/marketplace" className="artwork-detail-back-link">
              ← Marketplace
            </Link>
            <span className="artwork-detail-breadcrumb-sep">/</span>
            <span className="artwork-detail-breadcrumb-artist">{artistName}</span>
            <span className="artwork-detail-breadcrumb-sep">/</span>
            <span className="artwork-detail-breadcrumb-name">{name}</span>
          </div>
          <form
            className="artwork-detail-search-form"
            onSubmit={e => { e.preventDefault(); if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); }}
          >
            <svg className="artwork-detail-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="artwork-detail-search-input"
              type="text"
              placeholder="Search artworks, artists…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="artwork-detail-search-btn">Search</button>
          </form>
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

            <div className="artwork-detail-primary-actions">
              <button
                type="button"
                className={`artwork-detail-save-btn${saved ? " active" : ""}`}
                onClick={toggleSaved}
              >
                {saved ? "Saved" : "Save"}
              </button>
              <span className="artwork-detail-views">{(artwork.views ?? 0).toLocaleString()} view{artwork.views !== 1 ? "s" : ""}</span>
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
                <div className="artwork-detail-spec">
                  <span className="artwork-detail-spec-key">Purchase method</span>
                  <span className="artwork-detail-spec-val">Immpression app</span>
                </div>
              </div>
            </div>

            {!isSold && (
              <div className="artwork-detail-cta-block">
                <p className="artwork-detail-cta-note">
                  Purchase through the Immpression app.
                </p>
                <div className="artwork-detail-app-links">
                  <a
                    href="https://apps.apple.com/app/id6756974604"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="artwork-detail-store-btn"
                  >
                    <img src={appleIcon} alt="Download on the App Store" className="artwork-detail-store-img" />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.immpression.artapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="artwork-detail-store-btn"
                  >
                    <img src={googlePlayIcon} alt="Get it on Google Play" className="artwork-detail-store-img" />
                  </a>
                </div>
              </div>
            )}
          </motion.div>

        </div>

        <ArtworkArtistSection artistName={artistName} artist={artist} />

        <ArtworkRelatedSection artworks={relatedArtworks} />

      </div>

      <div className="artwork-detail-rail-col artwork-detail-rail-col--right">
        <ArtworkDetailRightRail moreArtworks={rightRailArtworks} />
      </div>

    </div>
  );
};

export default ArtworkDetail;
