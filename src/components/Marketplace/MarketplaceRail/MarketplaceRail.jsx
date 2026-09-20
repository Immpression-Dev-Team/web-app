import RailBlogSection from "./RailBlogSection.jsx";
import RailActivitySection from "./RailActivitySection.jsx";
import RailSellCTA from "./RailSellCTA.jsx";
import "./MarketplaceRail.css";

export default function MarketplaceRail() {
  return (
    <aside className="mp-rail" aria-label="Marketplace sidebar">
      <RailBlogSection />
      <RailActivitySection />
      <RailSellCTA />
    </aside>
  );
}
