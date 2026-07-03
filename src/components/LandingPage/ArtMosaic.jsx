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

      const mktImages =
        mktRes.status === "fulfilled" && mktRes.value.success
          ? mktRes.value.images.map((img) => img.imageLink).filter(Boolean)
          : [];

      const pdImages =
        pdRes.status === "fulfilled" && pdRes.value.success
          ? pdRes.value.data
              .map((a) => a.thumbnailUrl || a.imageUrl)
              .filter(Boolean)
          : [];

      // Interleave marketplace and public domain images
      const all = [];
      const maxLen = Math.max(mktImages.length, pdImages.length);
      for (let i = 0; i < maxLen; i++) {
        if (mktImages[i]) all.push(mktImages[i]);
        if (pdImages[i]) all.push(pdImages[i]);
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
          {/* duplicate images for seamless loop */}
          {[...imgs, ...imgs].map((src, i) => (
            <div key={i} className="art-mosaic-item">
              <img src={src} alt="" loading="lazy" draggable="false" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
