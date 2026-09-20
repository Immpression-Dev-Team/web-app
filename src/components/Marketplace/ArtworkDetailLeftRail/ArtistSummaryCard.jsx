import { Link } from "react-router-dom";

export default function ArtistSummaryCard({ artistName, artist }) {
  const joinDate = artist?.createdAt
    ? new Date(artist.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : null;

  return (
    <div className="mp-left-section">
      <h3 className="mp-left-title">About the Artist</h3>
      <div className="adr-artist-card">
        <img
          src={artist?.profilePictureLink}
          alt={artistName}
          className="adr-artist-avatar"
        />
        <div className="adr-artist-body">
          <p className="adr-artist-name">{artistName}</p>
          {artist?.artistType && <p className="adr-artist-type">{artist.artistType}</p>}
        </div>
      </div>

      {artist?.bio && <p className="adr-artist-bio">{artist.bio}</p>}

      {joinDate && (
        <p className="adr-artist-meta">Joined Immpression {joinDate}</p>
      )}

      <Link
        to={`/marketplace?q=${encodeURIComponent(artistName)}`}
        className="adr-view-profile-btn"
      >
        View Profile
      </Link>
    </div>
  );
}
