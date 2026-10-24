import RailBlogSection from "./RailBlogSection.jsx";
import RailActivitySection from "./RailActivitySection.jsx";
import RailSellCTA from "./RailSellCTA.jsx";
import AdsterraBanner from "../../shared/AdsterraBanner/AdsterraBanner.jsx";
import { AD_UNITS } from "../../../constants/ads.js";
import { useAdPlacement } from "../../../API/adsAPI.js";
import "./MarketplaceRail.css";

export default function MarketplaceRail() {
  const showTopAd = useAdPlacement("adsterra", "marketplaceRailTop");
  const topAd = AD_UNITS.adsterra.marketplaceRailTop;

  return (
    <aside className="mp-rail" aria-label="Marketplace sidebar">
      {showTopAd && (
        <div className="mp-rail-section mp-rail-ad">
          <AdsterraBanner adKey={topAd.key} src={topAd.src} width={topAd.width} height={topAd.height} />
        </div>
      )}
      <RailBlogSection />
      <RailActivitySection />
      <RailSellCTA />
    </aside>
  );
}
