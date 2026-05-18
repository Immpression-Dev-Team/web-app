import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPublicArtwork } from "../../API/publicDomainAPI";
import "./PublicArtDetail.css";

export default function PublicArtDetail() {
  const { source, id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgExpanded, setImgExpanded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setArtwork(null);
    getPublicArtwork(source, id).then(res => {
      if (res.success && res.data) {
        setArtwork(res.data);
      } else {
        setError(true);
      }
      setLoading(false);
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

  const museumName = artwork.source === "chicago"
    ? "Art Institute of Chicago"
    : "The Metropolitan Museum of Art";

  const museumUrl = artwork.sourceUrl || (artwork.source === "chicago"
    ? "https://www.artic.edu"
    : "https://www.metmuseum.org");

  const metaTitle = artwork.artist
    ? `${artwork.title} — ${artwork.artist} | Immpression`
    : `${artwork.title} | Immpression`;

  const metaDescription = [
    artwork.year && `${artwork.year}.`,
    artwork.medium && `${artwork.medium}.`,
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
          <img src={artwork.imageUrl} alt={artwork.title} className="art-detail-lightbox-img" />
          <button className="art-detail-lightbox-close">✕</button>
        </div>
      )}

      <div className="art-detail-inner">
        <Link to="/explore" className="art-detail-back">← Back to Explore</Link>

        <div className="art-detail-layout">
          <div className="art-detail-img-col">
            <div
              className="art-detail-img-wrap"
              onClick={() => artwork.imageUrl && setImgExpanded(true)}
            >
              {artwork.imageUrl ? (
                <>
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="art-detail-img"
                  />
                  <span className="art-detail-img-hint">Click to enlarge</span>
                </>
              ) : (
                <div className="art-detail-no-img">No image available</div>
              )}
            </div>
          </div>

          <div className="art-detail-info-col">
            <p className="art-detail-eyebrow">{museumName}</p>
            <h1 className="art-detail-title">{artwork.title}</h1>
            {artwork.artist && <p className="art-detail-artist">{artwork.artist}</p>}

            <div className="art-detail-meta">
              {artwork.year && (
                <div className="art-detail-meta-row">
                  <span className="art-detail-meta-label">Date</span>
                  <span className="art-detail-meta-value">{artwork.year}</span>
                </div>
              )}
              {artwork.medium && (
                <div className="art-detail-meta-row">
                  <span className="art-detail-meta-label">Medium</span>
                  <span className="art-detail-meta-value">{artwork.medium}</span>
                </div>
              )}
              {artwork.dimensions && (
                <div className="art-detail-meta-row">
                  <span className="art-detail-meta-label">Dimensions</span>
                  <span className="art-detail-meta-value">{artwork.dimensions}</span>
                </div>
              )}
              {artwork.department && (
                <div className="art-detail-meta-row">
                  <span className="art-detail-meta-label">Department</span>
                  <span className="art-detail-meta-value">{artwork.department}</span>
                </div>
              )}
              {artwork.culture && (
                <div className="art-detail-meta-row">
                  <span className="art-detail-meta-label">Origin</span>
                  <span className="art-detail-meta-value">{artwork.culture}</span>
                </div>
              )}
              {artwork.style && (
                <div className="art-detail-meta-row">
                  <span className="art-detail-meta-label">Style</span>
                  <span className="art-detail-meta-value">{artwork.style}</span>
                </div>
              )}
            </div>

            <a
              href={museumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="art-detail-museum-link"
            >
              View at {museumName} →
            </a>

            <p className="art-detail-pd-note">
              This work is in the public domain and free to use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
