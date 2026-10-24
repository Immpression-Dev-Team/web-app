import RailBlogSection from "./RailBlogSection.jsx";
import RailActivitySection from "./RailActivitySection.jsx";
import RailSellCTA from "./RailSellCTA.jsx";
import AdsterraBanner from "../../shared/AdsterraBanner/AdsterraBanner.jsx";
import { AD_SLOT_SIZES } from "../../../constants/ads.js";
import { useAdPlacement } from "../../../API/adsAPI.js";
import "./MarketplaceRail.css";

export default function MarketplaceRail() {
  const topAd = useAdPlacement("adsterra", "marketplaceRailTop");

  return (
    <aside className="mp-rail" aria-label="Marketplace sidebar">
      {topAd && (
        <div className="mp-rail-section mp-rail-ad">
          <AdsterraBanner adKey={topAd.key} src={topAd.src} {...AD_SLOT_SIZES.adsterra.marketplaceRailTop} />
        </div>
      )}
      <RailBlogSection />
      <RailActivitySection />
      <RailSellCTA />
    </aside>
  );
}
