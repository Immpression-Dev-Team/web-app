import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./ArtworkDetail.css";
import { API_URL } from "../../API_URL";
import ArtworkArtistPanel from "./ArtworkArtistPanel.jsx";
import PurchaseModal from "./PurchaseModal/PurchaseModal.jsx";
import ArtworkRelatedSection from "./ArtworkRelatedSection.jsx";
import { pickMoreArtwork, pickDiscoverArt } from "./artworkRecommendations.js";
import RailBlogSection from "./MarketplaceRail/RailBlogSection.jsx";
import "./MarketplaceRail/MarketplaceRail.css";

// Extract 24-char MongoDB hex ID from the end of the artwork slug
const extractId = (artworkSlug = "") => artworkSlug.match(/[a-f0-9]{24}$/)?.[0];
const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const closePurchase = useCallback(() => setPurchaseOpen(false), []);

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
      setPurchaseOpen(false);
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

          {/* Purchases happen in the mobile app; the popup hands off to it.
              There is no web checkout. */}
          <div className="adp-buy">
            {isSold ? (
              <button type="button" className="adp-btn adp-btn--primary adp-buy-btn" disabled>
                Sold
              </button>
            ) : (
              // Brand CTA: wordmark lettering, a hand-painted mint swoosh and
              // brush edge on the navbar's navy (see .adp-cta in the CSS).
              <button
                type="button"
                className="adp-cta"
                aria-haspopup="dialog"
                aria-label="Make it yours: purchase this artwork"
                onClick={() => setPurchaseOpen(true)}
              >
                <span className="adp-cta-label">
                  Make It Yours
                  <svg className="adp-cta-swoosh" viewBox="0 0 220 16" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M3 10 C 38 4, 72 13, 110 8 S 178 3, 217 9" pathLength="1" />
                  </svg>
                </span>
                <svg className="adp-cta-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </button>
            )}
            <p className="adp-buy-note">
              {isSold
                ? "This piece has sold. Find more original work in the Immpression app."
                : "Secure purchase in the Immpression app"}
            </p>
            {!isSold && (
              <ul className="adp-assurances">
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="7" y="2.5" width="10" height="19" rx="2" />
                    <path d="M11 18h2" />
                  </svg>
                  Bought in the app
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  Secure checkout
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3.5" y="4.5" width="17" height="15" rx="1" />
                    <path d="M3.5 15l5-5 4 4 3-3 5 5" />
                  </svg>
                  Original artwork
                </li>
              </ul>
            )}
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

      {!isSold && (
        <PurchaseModal open={purchaseOpen} onClose={closePurchase} artwork={artwork} />
      )}

    </div>
  );
};

export default ArtworkDetail;
