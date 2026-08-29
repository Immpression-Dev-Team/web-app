import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPublicArtwork, getRelatedPublicArtworks, parseArtworkId } from "../../API/publicDomainAPI";
import ArtworkSearchBar from "../shared/ArtworkSearchBar";
import {
  sanitizeText,
  sanitizeYear,
  sanitizeDescription,
  sanitizeUrl,
  buildDetailRows,
  pickSecondaryDetail,
} from "../../utils/publicDomainSanitize";
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

export default function PublicArtDetail() {
  const { source, id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgExpanded, setImgExpanded] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setArtwork(null);
    setRelated([]);

    getPublicArtwork(source, id).then(res => {
      if (res.success && res.data) {
        setArtwork(res.data);
      } else {
        setError(true);
      }
      setLoading(false);
    });

    getRelatedPublicArtworks(source, id, 7).then(res => {
      if (res.success) setRelated(res.data);
    });
  }, [source, id]);

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
  const details = buildDetailRows(artwork);
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

  return (
    <div className="art-detail-wrapper">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {artwork.imageUrl && <meta property="og:image" content={artwork.imageUrl} />}
        <meta property="og:type" content="article" />
      </Helmet>

      {imgExpanded && (
        <div className="art-detail-lightbox" onClick={() => setImgExpanded(false)}>
          <img src={artwork.imageUrl} alt={title} className="art-detail-lightbox-img" />
          <button className="art-detail-lightbox-close">✕</button>
        </div>
      )}

      <div className="art-detail-inner">
        <div className="art-detail-top-row">
          <Link to="/explore" className="art-detail-back">← Back to Explore</Link>
          <ArtworkSearchBar
            destination="/explore"
            placeholder="Search artworks, artists…"
            className="art-detail-search-form--dark"
          />
        </div>

        <div className="art-detail-layout">
          {/* Image column */}
          <div className="art-detail-img-col">
            <div
              className="art-detail-img-wrap"
              onClick={() => artwork.imageUrl && setImgExpanded(true)}
            >
              {artwork.imageUrl ? (
                <>
                  <img
                    src={artwork.imageUrl}
                    alt={title}
                    className="art-detail-img"
                  />
                  <span className="art-detail-img-hint">Click to enlarge</span>
                </>
              ) : (
                <div className="art-detail-no-img">No image available</div>
              )}
            </div>
          </div>

          {/* Info column */}
          <div className="art-detail-info-col">
            <p className="art-detail-eyebrow">{museumName}</p>
            <h1 className="art-detail-title">{title}</h1>
            {artist && <p className="art-detail-artist">{artist}</p>}

            {about && (
              <div className="art-detail-section">
                <span className="art-detail-section-label">About This Work</span>
                <p className="art-detail-about">{about}</p>
              </div>
            )}

            {details.length > 0 && (
              <div className="art-detail-section">
                <span className="art-detail-section-label">Details</span>
                <div className="art-detail-specs">
                  {details.map(row => (
                    <div className="art-detail-spec" key={row.label}>
                      <span className="art-detail-spec-key">{row.label}</span>
                      <span className="art-detail-spec-val">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="art-detail-actions">
              {museumUrl && (
                <a
                  href={museumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="art-detail-museum-link"
                >
                  View at {museumName} →
                </a>
              )}

              <p className="art-detail-pd-note">
                This work is in the public domain and free to use.
              </p>
            </div>
          </div>

          {/* More public domain art sidebar */}
          {related.length > 0 && (
            <div className="art-detail-more-col">
              <span className="art-detail-more-label">More Public Domain Art</span>
              <div className="art-detail-more-list">
                {related.map(art => {
                  const thumb = art.thumbnailUrl || art.imageUrl;
                  if (!thumb) return null;
                  const artTitle = sanitizeText(art.title) || "Untitled";
                  const artArtist = sanitizeText(art.artist);
                  const secondary = pickSecondaryDetail(art);
                  return (
                    <Link
                      key={art.id}
                      to={`/art/${art.source}/${parseArtworkId(art.id)}`}
                      className="art-detail-more-card"
                    >
                      <div className="art-detail-more-img-wrap">
                        <img src={thumb} alt={artTitle} loading="lazy" />
                      </div>
                      <div className="art-detail-more-info">
                        {artArtist && <p className="art-detail-more-artist">{artArtist}</p>}
                        <p className="art-detail-more-name">{artTitle}</p>
                        {secondary && <p className="art-detail-more-secondary">{secondary}</p>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
