import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPublicArtwork, parseArtworkId } from "../../API/publicDomainAPI";
import { getDiversePublicArt, isPublicDomain } from "../../utils/diversePublicArt";
import {
  sanitizeText,
  sanitizeYear,
  sanitizeDescription,
  sanitizeUrl,
  buildDetailRows,
  pickSecondaryDetail,
} from "../../utils/publicDomainSanitize";
import {
  CalendarIcon, FrameIcon, LayersIcon, PenIcon, RulerIcon,
} from "../Marketplace/ArtworkInfoIcons.jsx";
import buyNowArt from "../../assets/buy-now-button.webp";
import "./PublicArtDetail.css";

// Fallback only — the backend now returns `institution` directly for every
// source. Kept here in case older cached data is missing the field.
const INSTITUTION_FALLBACK = {
  met: "The Metropolitan Museum of Art",
  chicago: "Art Institute of Chicago",
  cleveland: "Cleveland Museum of Art",
  wikimedia: "Wikimedia Commons",
  rijksmuseum: "Rijksmuseum",
};

// Icon per detail row (rows come from buildDetailRows; unknown labels fall
// back to the layers icon).
const DETAIL_ICONS = {
  Date: CalendarIcon,
  Medium: PenIcon,
  Dimensions: RulerIcon,
  Culture: LayersIcon,
  Period: CalendarIcon,
  Department: FrameIcon,
  Classification: FrameIcon,
  "Museum / Collection": LayersIcon,
  "Credit Line": PenIcon,
  License: FrameIcon,
};

export default function PublicArtDetail() {
  const { source, id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgExpanded, setImgExpanded] = useState(false);
  const [related, setRelated] = useState([]);
  const [aboutOpen, setAboutOpen] = useState(false);
  // Sidebar rows whose thumbnail failed to load are hidden.
  const [failedThumbs, setFailedThumbs] = useState(() => new Set());

  useEffect(() => {
    setLoading(true);
    setError(false);
    setArtwork(null);
    setRelated([]);
    setAboutOpen(false);
    setFailedThumbs(new Set());

    let cancelled = false;
    getPublicArtwork(source, id).then(res => {
      if (cancelled) return;
      if (res.success && res.data) {
        setArtwork(res.data);
        // Varied recommendations (see utils/diversePublicArt).
        getDiversePublicArt(res.data, 6)
          .then((picks) => { if (!cancelled) setRelated(picks); })
          .catch(() => {});
      } else {
        setError(true);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [source, id]);

  useEffect(() => {
    if (!imgExpanded) return;
    const onKey = (e) => { if (e.key === "Escape") setImgExpanded(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imgExpanded]);

  if (loading) {
    return (
      <div className="art-detail-wrapper">
        <div className="art-detail-center">
          <div className="art-detail-spinner" />
          <p>Loading artwork…</p>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="art-detail-wrapper">
        <div className="art-detail-center">
          <p className="art-detail-error-msg">Artwork not found.</p>
          <Link to="/explore" className="art-detail-back">← Back to Explore</Link>
        </div>
      </div>
    );
  }

  const title = sanitizeText(artwork.title) || "Untitled";
  const artist = sanitizeText(artwork.artist);
  const about = sanitizeDescription(artwork.description);
  // Museum pieces are public domain (their APIs are queried that way);
  // Wikimedia files carry their own license, which may be Creative Commons.
  const publicDomain = isPublicDomain(artwork);
  const licenseLabel = artwork.license || "Public Domain";
  const details = [...buildDetailRows(artwork), { label: "License", value: licenseLabel }];
  // Long descriptions (some Wikimedia captions run for paragraphs) start
  // clamped with a Read more toggle.
  const longAbout = (about || "").length > 320;
  const visibleRelated = related.filter(
    (art) => (art.thumbnailUrl || art.imageUrl) && !failedThumbs.has(art.id),
  );
  const museumName = sanitizeText(artwork.institution) || INSTITUTION_FALLBACK[artwork.source] || "Public Domain Collection";
  const museumUrl = sanitizeUrl(artwork.sourceUrl);
  const cleanYear = sanitizeYear(artwork.year);
  const cleanMedium = sanitizeText(artwork.medium);

  const metaTitle = artist ? `${title} — ${artist} | Immpression` : `${title} | Immpression`;
  const metaDescription = [
    cleanYear && `${cleanYear}.`,
    cleanMedium && `${cleanMedium}.`,
    `From ${museumName}. Public domain artwork on Immpression.`,
  ].filter(Boolean).join(" ");
  const pageUrl = `https://www.immpression.art/art/${source}/${id}`;

  return (
    <div className="art-detail-wrapper">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {artwork.imageUrl && <meta property="og:image" content={artwork.imageUrl} />}
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Immpression" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {artwork.imageUrl && <meta name="twitter:image" content={artwork.imageUrl} />}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VisualArtwork",
          "name": title,
          ...(artist && { "creator": { "@type": "Person", "name": artist } }),
          ...(cleanYear && { "dateCreated": cleanYear }),
          ...(cleanMedium && { "artMedium": cleanMedium }),
          ...(artwork.imageUrl && { "image": artwork.imageUrl }),
          "url": pageUrl,
          "creditText": museumName,
          ...(museumUrl && { "isBasedOn": museumUrl }),
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Immpression", "item": "https://www.immpression.art" },
            { "@type": "ListItem", "position": 2, "name": "Explore", "item": "https://www.immpression.art/explore" },
            { "@type": "ListItem", "position": 3, "name": title, "item": pageUrl },
          ],
        })}</script>
      </Helmet>

      {imgExpanded && (
        <div className="art-detail-lightbox" onClick={() => setImgExpanded(false)}>
          <img src={artwork.imageUrl} alt={title} className="art-detail-lightbox-img" />
          <button className="art-detail-lightbox-close">✕</button>
        </div>
      )}

      <div className="art-detail-inner">
        <Link to="/explore" className="art-detail-back">← Back to Explore</Link>

        <div className="art-detail-layout">
          {/* Image column */}
          <div className="art-detail-img-col">
            {artwork.imageUrl ? (
              <button
                type="button"
                className="art-detail-img-wrap"
                onClick={() => setImgExpanded(true)}
                aria-label={`Enlarge ${title}`}
              >
                <img src={artwork.imageUrl} alt={title} className="art-detail-img" />
                <span className="art-detail-img-hint">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" />
                  </svg>
                  Click to enlarge
                </span>
              </button>
            ) : (
              <div className="art-detail-img-wrap art-detail-img-wrap--empty">
                <div className="art-detail-no-img">No image available</div>
              </div>
            )}

            <section className="art-detail-pd-about">
              <h2 className="art-detail-pd-about-title">About Public Domain Art</h2>
              {publicDomain ? (
                <p>
                  This artwork is in the public domain: its copyright has expired or
                  been waived, so the original image is free for anyone to view,
                  download and use.
                </p>
              ) : (
                <p>
                  This image isn&apos;t public domain: it&apos;s shared under a{" "}
                  {licenseLabel} license, so reuse has conditions (such as crediting
                  the author). Check the terms on {museumName} before using it.
                </p>
              )}
              <p>
                Immpression will offer products featuring public domain artwork
                that you can buy through our app. They aren&apos;t available
                yet. When they are, you&apos;ll be paying for the product, not
                for the artwork itself.
              </p>
            </section>
          </div>

          {/* Info column */}
          <div className="art-detail-info-col">
            <span className="art-detail-source">{museumName}</span>
            <h1 className="art-detail-title">
              {title}
              <svg className="art-detail-title-swoosh" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 10.5 C 45 3.5, 110 2.5, 197 4.5" />
              </svg>
            </h1>
            {artist && <p className="art-detail-artist">{artist}</p>}

            {/* Purchasing public domain art isn't live yet: no price, and the
                Buy Now artwork is shown disabled with "Coming Soon". */}
            <div className="art-detail-buy-card">
              <div className="art-detail-buy-status">
                <span className="art-detail-soon">Coming Soon</span>
                <span className="art-detail-soon-note">Purchasing public domain art isn&apos;t available yet.</span>
              </div>
              <div className="art-detail-buy-art" aria-disabled="true" title="Coming soon">
                <img src={buyNowArt} alt="" width="1100" height="195" />
                <span className="art-detail-buy-tag">Coming Soon</span>
              </div>
            </div>

            {about && (
              <blockquote className="art-detail-quote">
                <span className="art-detail-quote-mark" aria-hidden="true">&ldquo;</span>
                <div className="art-detail-about-wrap">
                  <p className={`art-detail-about${longAbout && !aboutOpen ? " art-detail-about--clamped" : ""}`}>
                    {about}
                  </p>
                  {longAbout && (
                    <button
                      type="button"
                      className="art-detail-about-toggle"
                      aria-expanded={aboutOpen}
                      onClick={() => setAboutOpen((open) => !open)}
                    >
                      {aboutOpen ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              </blockquote>
            )}

            {details.length > 0 && (
              <section className="art-detail-details">
                <h2 className="art-detail-details-title">
                  <span className="art-detail-details-icon"><LayersIcon /></span>
                  Artwork Details
                </h2>
                <dl className="art-detail-specs">
                  {details.map((row) => {
                    const Icon = DETAIL_ICONS[row.label] || LayersIcon;
                    return (
                      <div
                        className={`art-detail-spec${String(row.value).length > 36 ? " art-detail-spec--wide" : ""}`}
                        key={row.label}
                      >
                        <span className="art-detail-spec-icon"><Icon /></span>
                        <div className="art-detail-spec-text">
                          <dt>{row.label}</dt>
                          <dd>{row.value}</dd>
                        </div>
                      </div>
                    );
                  })}
                </dl>
              </section>
            )}

            {museumUrl && (
              <a
                href={museumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="art-detail-museum-link"
              >
                View at {museumName}
                <span aria-hidden="true">→</span>
              </a>
            )}
            <p className="art-detail-pd-note">
              {publicDomain
                ? "This work is in the public domain and free to use."
                : `Shared under ${licenseLabel}. See ${museumName} for reuse terms.`}
            </p>
          </div>

          {/* More public domain art sidebar */}
          {visibleRelated.length > 0 && (
            <aside className="art-detail-more-col">
              <svg className="art-detail-more-scribble" viewBox="0 0 160 70" aria-hidden="true">
                <path d="M6 64 C 40 34, 92 12, 156 6" />
                <path d="M34 66 C 70 42, 112 24, 154 18" />
              </svg>
              <h2 className="art-detail-more-label">More Public Domain Art</h2>
              <div className="art-detail-more-list">
                {visibleRelated.map((art) => {
                  const thumb = art.thumbnailUrl || art.imageUrl;
                  const artTitle = sanitizeText(art.title) || "Untitled";
                  const secondary = pickSecondaryDetail(art);
                  return (
                    <Link
                      key={art.id}
                      to={`/art/${art.source}/${parseArtworkId(art.id)}`}
                      className="art-detail-more-card"
                    >
                      <div className="art-detail-more-img-wrap">
                        <img
                          src={thumb}
                          alt={artTitle}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={() => setFailedThumbs((prev) => new Set(prev).add(art.id))}
                        />
                      </div>
                      <div className="art-detail-more-info">
                        <p className="art-detail-more-name">{artTitle}</p>
                        {secondary && <p className="art-detail-more-secondary">{secondary}</p>}
                      </div>
                      <span className="art-detail-more-go" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
