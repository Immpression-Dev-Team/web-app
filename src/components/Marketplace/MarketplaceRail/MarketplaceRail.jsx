import RailBlogSection from "./RailBlogSection.jsx";
import RailActivitySection from "./RailActivitySection.jsx";
import RailSellCTA from "./RailSellCTA.jsx";
import AdFrame from "../../shared/AdFrame/AdFrame.jsx";
import { AD_UNITS } from "../../../constants/ads.js";
import { useAdPlacement } from "../../../API/adsAPI.js";
import "./MarketplaceRail.css";

const ADSTERRA_TOP = AD_UNITS.adsterra.marketplaceRailTop;
const HILLTOP_SECOND = AD_UNITS.hilltop.marketplaceRailSecond;

export default function MarketplaceRail() {
  const showAdsterra = useAdPlacement("adsterra", "marketplaceRailTop") && ADSTERRA_TOP.code.trim();
  const showHilltop = useAdPlacement("hilltop", "marketplaceRailSecond") && HILLTOP_SECOND.code.trim();

  return (
    <aside className="mp-rail" aria-label="Marketplace sidebar">
      {(showAdsterra || showHilltop) && (
        <div className="mp-rail-section mp-rail-ad">
          {showAdsterra && <AdFrame {...ADSTERRA_TOP} />}
          {showHilltop && <AdFrame {...HILLTOP_SECOND} />}
        </div>
      )}
      <RailBlogSection />
      <RailActivitySection />
      <RailSellCTA />
    </aside>
  );
}
