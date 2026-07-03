import { useEffect, useState } from "react";
import { API_URL } from "../../API_URL";
import "./ArtMosaic.css";

export default function ArtMosaic() {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    async function load() {
      const [mktRes, pdRes] = await Promise.allSettled([
        fetch(`${API_URL}/marketplace?limit=20&sort=newest`).then((r) => r.json()),
        fetch(`${API_URL}/public-art/featured`).then((r) => r.json()),
      ]);

      const mktItems =
        mktRes.status === "fulfilled" && mktRes.value.success
          ? mktRes.value.images
              .filter((img) => img.imageLink)
              .map((img) => ({
                src: img.imageLink,
                title: img.name,
                price:
                  img.soldStatus === "sold"
                    ? "Sold"
                    : img.price != null
                    ? `$${Number(img.price).toLocaleString()}`
                    : null,
              }))
          : [];

      const pdItems =
        pdRes.status === "fulfilled" && pdRes.value.success
          ? pdRes.value.data
              .filter((a) => a.thumbnailUrl || a.imageUrl)
              .map((a) => ({
                src: a.thumbnailUrl || a.imageUrl,
                title: a.title,
                price: null,
              }))
          : [];

      // Interleave and take first 5
      const all = [];
      const maxLen = Math.max(mktItems.length, pdItems.length);
      for (let i = 0; i < maxLen; i++) {
        if (mktItems[i]) all.push(mktItems[i]);
        if (pdItems[i]) all.push(pdItems[i]);
        if (all.length >= 5) break;
      }

      setPieces(all);
    }

    load();
  }, []);

  if (pieces.length < 3) return null;

  const [big, small1, small2, right1, right2] = pieces;

  return (
    <div className="art-mosaic">
      <Tile item={big} className="mosaic-big" />
      <Tile item={small1} className="mosaic-small-1" />
      <Tile item={small2 || small1} className="mosaic-small-2" />
      <Tile item={right1 || big} className="mosaic-right-1" />
      <Tile item={right2 || small1} className="mosaic-right-2" />
    </div>
  );
}

function Tile({ item, className }) {
  if (!item) return null;
  return (
    <div className={`mosaic-tile ${className}`}>
      <img src={item.src} alt={item.title || ""} draggable="false" />
      <div className="mosaic-caption">
        {item.title && <span className="mosaic-caption-title">{item.title}</span>}
        {item.price && <span className="mosaic-caption-price">{item.price}</span>}
      </div>
    </div>
  );
}
