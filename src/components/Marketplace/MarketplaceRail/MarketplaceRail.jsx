import RailBlogSection from "./RailBlogSection.jsx";
import RailActivitySection from "./RailActivitySection.jsx";
import RailSellCTA from "./RailSellCTA.jsx";
import AdFrame from "../../shared/AdFrame/AdFrame.jsx";
import { AD_UNITS } from "../../../constants/ads.js";
import { useAdPlacement } from "../../../API/adsAPI.js";
import "./MarketplaceRail.css";

const ADSTERRA_TOP = AD_UNITS.adsterra.marketplaceRailTop;
const HILLTOP_SECOND = AD_UNITS.hilltop.marketplaceRailSecond;

// showAds is false on phones, where Marketplace shows these same ad units
// inline in the artwork grid instead (so each ad only loads once).
export default function MarketplaceRail({ showAds = true }) {
  const adsterraOn = useAdPlacement("adsterra", "marketplaceRailTop") && ADSTERRA_TOP.code.trim();
  const hilltopOn = useAdPlacement("hilltop", "marketplaceRailSecond") && HILLTOP_SECOND.code.trim();
  const showAdsterra = showAds && adsterraOn;
  const showHilltop = showAds && hilltopOn;

  return (
    <aside className="mp-rail" aria-label="Marketplace sidebar">
      {showAdsterra && (
        <div className="mp-rail-section mp-rail-ad">
          <AdFrame {...ADSTERRA_TOP} />
        </div>
      )}
      <RailBlogSection />
      {showHilltop && (
        <div className="mp-rail-section mp-rail-ad">
          <AdFrame {...HILLTOP_SECOND} />
        </div>
      )}
      <RailActivitySection />
      <RailSellCTA />
    </aside>
  );
}
