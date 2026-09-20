import MoreArtworksList from "./MoreArtworksList.jsx";
import RailBlogSection from "../MarketplaceRail/RailBlogSection.jsx";
import RailActivitySection from "../MarketplaceRail/RailActivitySection.jsx";
import RailSellCTA from "../MarketplaceRail/RailSellCTA.jsx";
import "../MarketplaceRail/MarketplaceRail.css";

export default function ArtworkDetailRightRail({ moreArtworks }) {
  return (
    <aside className="mp-rail" aria-label="More from Immpression">
      <MoreArtworksList artworks={moreArtworks} />
      <RailBlogSection />
      <RailActivitySection />
      <RailSellCTA />
    </aside>
  );
}
