import ArtistSummaryCard from "./ArtistSummaryCard.jsx";
import PieceStats from "./PieceStats.jsx";
import MoreFromArtist from "./MoreFromArtist.jsx";
import "../MarketplaceLeftRail/MarketplaceLeftRail.css";
import "../MarketplaceRail/MarketplaceRail.css";
import "./ArtworkDetailLeftRail.css";

export default function ArtworkDetailLeftRail({ artwork, artist, artistWorks }) {
  return (
    <aside className="mp-left-rail" aria-label="Artwork and artist details">
      <ArtistSummaryCard artistName={artwork.artistName} artist={artist} />
      <PieceStats artwork={artwork} />
      <MoreFromArtist artistName={artwork.artistName} artworks={artistWorks} />
    </aside>
  );
}
