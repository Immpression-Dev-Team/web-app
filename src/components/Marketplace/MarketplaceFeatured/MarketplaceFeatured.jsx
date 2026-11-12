import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicDomainFeatured, parseArtworkId } from "../../../API/publicDomainAPI";
import "./MarketplaceFeatured.css";

const MAX_TILES = 5;

// Featured hero at the top of /marketplace: the admin panel's Featured
// list (Public Art → Featured), in its saved order. The first artwork is
// the large tile; the next four fill the grid beside it. Layout adapts to
// however many (1–5) are available, and renders nothing if none load.
export default function MarketplaceFeatured() {
  const [artworks, setArtworks] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getPublicDomainFeatured().then((res) => {
      if (cancelled) return;
      const list = res.success && Array.isArray(res.data) ? res.data : [];
      setArtworks(list.filter((a) => a.thumbnailUrl || a.imageUrl).slice(0, MAX_TILES));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (artworks === null) {
    return <div className="mp-feat mp-feat--n5 mp-feat--loading" aria-hidden="true">
      {Array.from({ length: MAX_TILES }, (_, i) => <div key={i} className="mp-feat-tile" />)}
    </div>;
  }

  if (artworks.length === 0) return null;

  return (
    <section className={`mp-feat mp-feat--n${artworks.length}`} aria-label="Featured artworks">
      {artworks.map((art, i) => (
        <FeaturedTile key={art.id} artwork={art} lead={i === 0} />
      ))}
    </section>
  );
}

function FeaturedTile({ artwork, lead }) {
  const { id, source, title, artist, thumbnailUrl, imageUrl } = artwork;
  const [failed, setFailed] = useState(false);

  return (
    <Link
      to={`/art/${source || "met"}/${parseArtworkId(id)}`}
      className={`mp-feat-tile${lead ? " mp-feat-tile--lead" : ""}`}
    >
      {!failed && (
        <img
          src={thumbnailUrl || imageUrl}
          alt={title || "Featured artwork"}
          loading={lead ? "eager" : "lazy"}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      )}
      <span className="mp-feat-caption">
        <span className="mp-feat-title">{title || "Untitled"}</span>
        {artist && <span className="mp-feat-artist">{artist}</span>}
      </span>
    </Link>
  );
}
