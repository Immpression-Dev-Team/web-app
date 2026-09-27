import { Link } from "react-router-dom";

const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function BlogMarketplaceRail({ artworks, className = "" }) {
  if (!artworks.length) return null;

  return (
    <div className={`bp-mp-rail ${className}`}>
      <h2 className="bp-mp-heading">From The Marketplace</h2>
      <div className="bp-mp-list">
        {artworks.map((a) => {
          const artistSlug = slugify(a.artistName || "artist");
          const artworkSlug = `${slugify(a.name || "artwork")}-${a._id}`;
          const href = `/marketplace/${artistSlug}/${artworkSlug}`;
          return (
            <div key={a._id} className="bp-mp-item">
              <Link to={href} className="bp-mp-img-wrap">
                <img src={a.imageLink} alt={a.name} className="bp-mp-img" loading="lazy" />
              </Link>
              <Link to={href} className="bp-mp-title">{a.name}</Link>
              <span className="bp-mp-artist">{a.artistName}</span>
              {a.price != null && (
                <span className="bp-mp-price">${Number(a.price).toLocaleString()}</span>
              )}
              <Link to={href} className="bp-mp-view">View art →</Link>
            </div>
          );
        })}
      </div>
      <Link to="/marketplace" className="bp-mp-explore">Explore marketplace →</Link>
    </div>
  );
}
