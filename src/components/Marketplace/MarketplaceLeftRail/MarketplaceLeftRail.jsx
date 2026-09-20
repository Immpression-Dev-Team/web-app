import DiscoverNav from "./DiscoverNav.jsx";
import MediumList from "./MediumList.jsx";
import PriceRangeCard from "./PriceRangeCard.jsx";
import SupportArtistsCard from "./SupportArtistsCard.jsx";
import "./MarketplaceLeftRail.css";

export default function MarketplaceLeftRail({ category, setCategory, setSort }) {
  return (
    <aside className="mp-left-rail" aria-label="Browse marketplace">
      <DiscoverNav setCategory={setCategory} setSort={setSort} />
      <MediumList category={category} setCategory={setCategory} />
      <PriceRangeCard />
      <SupportArtistsCard />
    </aside>
  );
}
