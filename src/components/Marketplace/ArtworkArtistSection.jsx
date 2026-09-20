import { Link } from "react-router-dom";

export default function ArtworkArtistSection({ artistName, artist }) {
  return (
    <section className="adr-artist-strip">
      <img
        src={artist?.profilePictureLink}
        alt={artistName}
        className="adr-artist-strip-avatar"
      />
      <div className="adr-artist-strip-body">
        <span className="adr-artist-strip-label">About the Artist</span>
        <p className="adr-artist-strip-name">{artistName}</p>
        {artist?.bio && <p className="adr-artist-strip-bio">{artist.bio}</p>}
      </div>
      <Link
        to={`/marketplace?q=${encodeURIComponent(artistName)}`}
        className="adr-view-profile-btn"
      >
        View Profile
      </Link>
    </section>
  );
}
