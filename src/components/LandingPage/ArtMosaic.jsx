import { useEffect, useState } from "react";
import { API_URL } from "../../API_URL";
import "./ArtMosaic.css";

export default function ArtMosaic() {
  const [columns, setColumns] = useState([[], [], []]);

  useEffect(() => {
    async function load() {
      const [mktRes, pdRes] = await Promise.allSettled([
        fetch(`${API_URL}/marketplace?limit=24&sort=newest`).then((r) => r.json()),
        fetch(`${API_URL}/public-art/featured`).then((r) => r.json()),
      ]);

      const mktItems =
        mktRes.status === "fulfilled" && mktRes.value.success
          ? mktRes.value.images
              .filter((img) => img.imageLink)
              .map((img) => ({
                src: img.imageLink,
                title: img.name,
                price: img.soldStatus === "sold" ? "Sold" : img.price != null ? `$${Number(img.price).toLocaleString()}` : null,
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

      // Interleave marketplace and public domain items
      const all = [];
      const maxLen = Math.max(mktItems.length, pdItems.length);
      for (let i = 0; i < maxLen; i++) {
        if (mktItems[i]) all.push(mktItems[i]);
        if (pdItems[i]) all.push(pdItems[i]);
      }

      if (all.length === 0) return;

      // Split into 3 columns
      const c0 = all.filter((_, i) => i % 3 === 0);
      const c1 = all.filter((_, i) => i % 3 === 1);
      const c2 = all.filter((_, i) => i % 3 === 2);

      // Each column needs enough images to scroll smoothly — pad if short
      const pad = (arr) => {
        while (arr.length < 6) arr = [...arr, ...arr];
        return arr;
      };

      setColumns([pad(c0), pad(c1), pad(c2)]);
    }

    load();
  }, []);

  if (columns.every((c) => c.length === 0)) return null;

  return (
    <div className="art-mosaic">
      {/* top and bottom gradient fade */}
      <div className="art-mosaic-fade art-mosaic-fade--top" />
      <div className="art-mosaic-fade art-mosaic-fade--bottom" />

      {columns.map((imgs, colIdx) => (
        <div
          key={colIdx}
          className={`art-mosaic-col art-mosaic-col--${colIdx % 2 === 0 ? "up" : "down"}`}
        >
          {[...imgs, ...imgs].map((item, i) => (
            <div key={i} className="art-mosaic-item">
              <img src={item.src} alt={item.title || ""} loading="lazy" draggable="false" />
              <div className="art-mosaic-info">
                {item.title && <p className="art-mosaic-title">{item.title}</p>}
                {item.price && <p className="art-mosaic-price">{item.price}</p>}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
