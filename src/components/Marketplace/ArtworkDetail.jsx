import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./ArtworkDetail.css";
import { API_URL } from "../../API_URL";
import appleIcon from "../../assets/headers/Apple.png";
import googlePlayIcon from "../../assets/headers/GooglePlay.png";
import ArtworkArtistPanel from "./ArtworkArtistPanel.jsx";
import ArtworkRelatedSection from "./ArtworkRelatedSection.jsx";
import { pickMoreArtwork, pickDiscoverArt } from "./artworkRecommendations.js";
import RailBlogSection from "./MarketplaceRail/RailBlogSection.jsx";
import "./MarketplaceRail/MarketplaceRail.css";

// Extract 24-char MongoDB hex ID from the end of the artwork slug
const extractId = (artworkSlug = "") => artworkSlug.match(/[a-f0-9]{24}$/)?.[0];
const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const APP_STORE_URL = "https://apps.apple.com/app/id6756974604";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.immpression.artapp";
// "Get on the App" opens the store for the visitor's phone (App Store
// everywhere but Android); both store badges sit beside it.
const APP_URL =
  typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)
    ? PLAY_STORE_URL
    : APP_STORE_URL;

const ArtworkDetail = () => {
  const { artworkSlug } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [artist, setArtist] = useState(null);
  const [artistWorks, setArtistWorks] = useState([]);
  // False until the artist's other pieces have loaded, so the sidebar
  // doesn't flash "Discover More Art" for artists who do have more.
  const [artistWorksLoaded, setArtistWorksLoaded] = useState(false);
  // Listings for recommendations: same category + newest marketplace-wide.
  const [sameCategory, setSameCategory] = useState([]);
  const [marketplace, setMarketplace] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  const id = extractId(artworkSlug);

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
      setArtistWorksLoaded(false);
      setSameCategory([]);
      setMarketplace([]);
      try {
        const res = await fetch(`${API_URL}/marketplace/${id}`);
        const data = await res.json();
        if (data.success) {
          setArtwork(data.image);

          // Recommendation pools (see artworkRecommendations.js).
          const listings = (params) =>
            fetch(`${API_URL}/marketplace?${new URLSearchParams({ sort: "newest", ...params })}`)
              .then((r) => r.json())
              .then((d) => (d.success ? d.images : []))
              .catch(() => []);
          if (data.image.category) {
            listings({ limit: 12, category: data.image.category }).then(setSameCategory);
          }
          listings({ limit: 24 }).then(setMarketplace);

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
                setArtistWorks(worksData.images.filter((a) => a._id !== data.image._id).slice(0, 3));
              })
              .catch(() => {})
              .finally(() => setArtistWorksLoaded(true));
          } else {
            setArtistWorksLoaded(true);
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

  const moreArtwork = useMemo(
    () => (artwork ? pickMoreArtwork(artwork, sameCategory, marketplace) : []),
    [artwork, sameCategory, marketplace],
  );
  // Artist has nothing else listed: the sidebar suggests marketplace art.
  const discoverArt = useMemo(
    () =>
      artwork && artistWorksLoaded && artistWorks.length === 0
        ? pickDiscoverArt(artwork, marketplace, moreArtwork)
        : [],
    [artwork, artistWorksLoaded, artistWorks, marketplace, moreArtwork],
  );

  if (loading) {
    return (
      <div className="adp">
        <div className="adp-state">
          <div className="adp-spinner" />
          <p>Loading artwork...</p>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="adp">
        <div className="adp-state">
          <p>{error || "Artwork not found."}</p>
          <button className="adp-btn adp-btn--outline" onClick={() => navigate("/")}>
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

  const views = artwork.views ?? 0;
  const favorites = artwork.likes?.length ?? 0;

  // Only details the listing actually has.
  const specs = [
    dimensions?.height && dimensions?.width && {
      label: "Dimensions",
      value: `${dimensions.height}" × ${dimensions.width}"${dimensions.length ? ` × ${dimensions.length}"` : ""}`,
    },
    weight && { label: "Weight", value: `${weight} lbs` },
    { label: "Signed", value: isSigned ? "Yes" : "No" },
    { label: "Framed", value: isFramed ? "Yes" : "No" },
    listedDate && { label: "Listed", value: listedDate },
    { label: "Purchase method", value: "Immpression app" },
  ].filter(Boolean);

  const pageUrl = `https://www.immpression.art/marketplace/${slugify(artistName || "artist")}/${slugify(name || "artwork")}-${artwork._id}`;
  const metaDescription = description
    ? `${description.slice(0, 140)}…`
    : `${name} by ${artistName} — original artwork available on Immpression. $${Number(price).toLocaleString()}.`;

  return (
    <div className="adp">

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
            { "@type": "ListItem", "position": 2, "name": "Marketplace", "item": "https://www.immpression.art/" },
            { "@type": "ListItem", "position": 3, "name": name, "item": pageUrl },
          ],
        })}</script>
      </Helmet>

      <nav className="adp-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Marketplace</Link>
        {category && (
          <>
            <span aria-hidden="true">/</span>
            <span>{category}</span>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span className="adp-breadcrumb-current">{name}</span>
      </nav>

      {/* Product: image | details | artist. Stacks in that order on phones. */}
      <div className="adp-product">
        <div className="adp-media">
          <div className={`adp-image-frame${imageLoaded ? " loaded" : ""}`}>
            <img
              src={imageLink}
              alt={`${name} by ${artistName}`}
              className="adp-image"
              onLoad={() => setImageLoaded(true)}
            />
            {isSold && <span className="adp-image-badge">Sold</span>}
          </div>
        </div>

        <div className="adp-info">
          {category && <span className="adp-category">{category}</span>}
          <h1 className="adp-title">{name}</h1>
          <p className="adp-artist-line">
            by <Link to={`/?q=${encodeURIComponent(artistName || "")}`}>{artistName}</Link>
          </p>

          <div className="adp-price-row">
            <span className={`adp-price${isSold ? " adp-price--sold" : ""}`}>
              ${Number(price).toLocaleString()}
            </span>
            <span className={`adp-status${isSold ? " adp-status--sold" : ""}`}>
              {isSold ? "Sold" : "Available"}
            </span>
          </div>

          <p className="adp-stats">
            <span>{views.toLocaleString()} view{views === 1 ? "" : "s"}</span>
            <span aria-hidden="true">·</span>
            <span>{favorites.toLocaleString()} favorite{favorites === 1 ? "" : "s"}</span>
          </p>

          {description && <p className="adp-description">{description}</p>}

          {/* Purchases happen in the mobile app; there is no web checkout. */}
          <div className="adp-buy">
            <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="adp-btn adp-btn--primary">
              Get on the App
            </a>
            <p className="adp-buy-note">
              {isSold
                ? "This piece has sold. Find more original work in the Immpression app."
                : "Purchases are completed securely in the Immpression app."}
            </p>
            <div className="adp-store-links">
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="adp-store-btn">
                <img src={appleIcon} alt="Download on the App Store" />
              </a>
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="adp-store-btn">
                <img src={googlePlayIcon} alt="Get it on Google Play" />
              </a>
            </div>
          </div>

          <section className="adp-block">
            <h2 className="adp-block-title">Details</h2>
            <dl className="adp-specs">
              {specs.map((spec) => (
                <div className="adp-spec" key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <ArtworkArtistPanel
          key={artwork._id}
          artistName={artistName}
          artist={artist}
          artistWorks={artistWorks}
          discoverArt={discoverArt}
        />
      </div>

      <ArtworkRelatedSection artworks={moreArtwork} />

      <RailBlogSection className="adp-section adp-blog" limit={4} />

    </div>
  );
};

export default ArtworkDetail;
