import { useEffect, useState } from "react";
import { API_URL } from "../../API_URL";
import "./ArtMosaic.css";

// How long each tile waits before showing (non-sequential order)
const FADE_DELAYS = {
  big:    0,
  right1: 180,
  small2: 380,
  right2: 560,
  small1: 760,
};

// How often each tile swaps its image (ms) — all different so they don't sync up
const CYCLE_INTERVALS = {
  big:    6000,
  small1: 4500,
  small2: 5500,
  right1: 4000,
  right2: 5200,
};

export default function ArtMosaic() {
  const [groups, setGroups] = useState(null);

  useEffect(() => {
    async function load() {
      const [mktRes, pdRes] = await Promise.allSettled([
        fetch(`${API_URL}/marketplace?limit=30&sort=newest`).then((r) => r.json()),
        fetch(`${API_URL}/public-art/featured`).then((r) => r.json()),
      ]);

      const mktItems =
        mktRes.status === "fulfilled" && mktRes.value.success
          ? mktRes.value.images.filter((img) => img.imageLink).map((img) => ({
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
          ? pdRes.value.data.filter((a) => a.thumbnailUrl || a.imageUrl).map((a) => ({
              src: a.thumbnailUrl || a.imageUrl,
              title: a.title,
              price: null,
            }))
          : [];

      // Interleave marketplace and public domain
      const all = [];
      const maxLen = Math.max(mktItems.length, pdItems.length);
      for (let i = 0; i < maxLen; i++) {
        if (mktItems[i]) all.push(mktItems[i]);
        if (pdItems[i]) all.push(pdItems[i]);
      }

      if (all.length < 3) return;

      // Distribute across 5 slots — round-robin
      const slots = { big: [], small1: [], small2: [], right1: [], right2: [] };
      const keys = ["big", "small1", "small2", "right1", "right2"];
      all.forEach((item, i) => slots[keys[i % 5]].push(item));

      setGroups(slots);
    }
    load();
  }, []);

  if (!groups) return null;

  return (
    <div className="art-mosaic">
      <Tile items={groups.big}    slot="big"    />
      <Tile items={groups.small1} slot="small1" />
      <Tile items={groups.small2} slot="small2" />
      <Tile items={groups.right1} slot="right1" />
      <Tile items={groups.right2} slot="right2" />
    </div>
  );
}

function Tile({ items, slot }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  // Fade in on load with per-slot delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), FADE_DELAYS[slot]);
    return () => clearTimeout(t);
  }, [slot]);

  // Cycle to next image on interval
  useEffect(() => {
    if (items.length <= 1) return;
    const iv = setInterval(
      () => setIdx((i) => (i + 1) % items.length),
      CYCLE_INTERVALS[slot]
    );
    return () => clearInterval(iv);
  }, [items.length, slot]);

  if (!items.length) return null;

  return (
    <div
      className={`mosaic-tile mosaic-${slot}`}
      style={{ opacity: visible ? 1 : 0, transition: `opacity 0.9s ease` }}
    >
      {/* Stack all images; only the current one is opaque */}
      {items.map((item, i) => (
        <img
          key={item.src}
          src={item.src}
          alt={item.title || ""}
          className="mosaic-tile-img"
          style={{ opacity: i === idx ? 1 : 0 }}
          draggable="false"
        />
      ))}

      {/* Caption floats above images */}
      <div className="mosaic-caption">
        {items[idx]?.title && (
          <span className="mosaic-caption-title">{items[idx].title}</span>
        )}
        {items[idx]?.price && (
          <span className="mosaic-caption-price">{items[idx].price}</span>
        )}
      </div>
    </div>
  );
}
