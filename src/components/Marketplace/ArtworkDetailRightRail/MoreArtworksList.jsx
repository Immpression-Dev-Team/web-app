import { Link } from "react-router-dom";

const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function MoreArtworksList({ artworks }) {
  if (!artworks.length) return null;

  return (
    <div className="mp-rail-section">
      <div className="mp-rail-section-head">
        <h3 className="mp-rail-title">More Artworks</h3>
        <Link to="/marketplace" className="mp-rail-link">View all</Link>
      </div>
      <ul className="mp-blog-rail-list">
        {artworks.map((art) => {
          const artistSlug = slugify(art.artistName || "artist");
          const artworkSlug = `${slugify(art.name || "artwork")}-${art._id}`;
          return (
            <li key={art._id}>
              <Link to={`/marketplace/${artistSlug}/${artworkSlug}`} className="mp-blog-rail-item">
                <div className="mp-blog-rail-img-wrap">
                  <img src={art.imageLink} alt={art.name} loading="lazy" />
                </div>
                <div className="mp-blog-rail-body">
                  <span className="mp-blog-rail-label">{art.artistName}</span>
                  <p className="mp-blog-rail-headline">{art.name}</p>
                  <span className="mp-blog-rail-date">${Number(art.price).toLocaleString()}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
