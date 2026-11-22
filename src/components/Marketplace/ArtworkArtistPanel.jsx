import { useState } from "react";
import { Link } from "react-router-dom";

const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// "jamal_k" -> "JK", "Vlad" -> "V".
const initials = (name = "") =>
  name
    .split(/[\s_.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";

// Right column of the artwork page: "About the Artist" card, then up to
// three more of their pieces. Profile links go to the marketplace filtered
// to the artist (the web app has no artist profile pages).
export default function ArtworkArtistPanel({ artistName, artist, artworks }) {
  const profileLink = `/?q=${encodeURIComponent(artistName || "")}`;
  const [photoFailed, setPhotoFailed] = useState(false);
  const photo = !photoFailed && artist?.profilePictureLink;

  return (
    <aside className="adp-aside" aria-label="About the artist">
      <section className="adp-card">
        <h2 className="adp-card-title">About the Artist</h2>
        <div className="adp-artist">
          {photo ? (
            <img
              src={photo}
              alt={artistName}
              className="adp-artist-avatar"
              onError={() => setPhotoFailed(true)}
            />
          ) : (
            <span className="adp-artist-avatar adp-artist-avatar--empty" aria-hidden="true">
              {initials(artistName)}
            </span>
          )}
          <div className="adp-artist-body">
            <p className="adp-artist-name">{artistName}</p>
            {artist?.artistType && <p className="adp-artist-type">{artist.artistType}</p>}
          </div>
        </div>
        {artist?.bio && <p className="adp-artist-bio">{artist.bio}</p>}
        <Link to={profileLink} className="adp-btn adp-btn--outline">View Profile</Link>
      </section>

      {artworks.length > 0 && (
        <section className="adp-card">
          <div className="adp-card-head">
            <h2 className="adp-card-title">More from this Artist</h2>
            <Link to={profileLink} className="adp-link">View all</Link>
          </div>
          <ul className="adp-more-list">
            {artworks.map((art) => (
              <li key={art._id}>
                <Link
                  to={`/marketplace/${slugify(art.artistName || "artist")}/${slugify(art.name || "artwork")}-${art._id}`}
                  className="adp-more-item"
                >
                  <span className="adp-more-thumb">
                    <img src={art.imageLink} alt={art.name} loading="lazy" />
                  </span>
                  <span className="adp-more-body">
                    <span className="adp-more-name">{art.name}</span>
                    <span className="adp-more-price">
                      {art.isSold ? "Sold" : `$${Number(art.price).toLocaleString()}`}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
