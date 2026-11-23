import { getPublicDomainFeatured, getRelatedPublicArtworks, searchPublicDomainArt } from "../API/publicDomainAPI";

// The Met serves its images behind a bot check, so they can't load on our
// pages; leave Met pieces out until that changes.
const BLOCKED_SOURCES = new Set(["met"]);

// Themes spanning categories and periods. Two are picked per page (from the
// current artwork's id) so different pages draw different pools.
const THEMES = [
  "portrait", "landscape", "still life", "sculpture", "woodblock print",
  "ancient", "renaissance", "impressionism", "textile", "drawing",
  "ceramic", "medieval", "baroque", "sea", "garden", "city",
];

function hash(str = "") {
  let h = 0;
  for (const ch of String(str)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

// "Claude Monet (French, 1840–1926)" -> "claude monet"
const artistKey = (artist = "") =>
  artist.replace(/\s*\(.*$/, "").toLowerCase().replace(/[^a-zÀ-ɏ ]/g, "").trim();

// Collapses titles that differ only by numbers, punctuation or bracketed
// notes ("Bodyart (5725537695)" / "bodyart (5725537675)").
const titleKey = (title = "") =>
  title.toLowerCase().replace(/\(.*?\)|\[.*?\]/g, "").replace(/[^a-zÀ-ɏ]+/g, " ").trim()
    .split(" ").slice(0, 4).join(" ");

// Wikimedia items carry their license; anything that isn't public domain /
// CC0 (e.g. "CC BY-SA 2.0") isn't recommended as public domain art.
export const isPublicDomain = (art) =>
  !art?.license || /public domain|^pd|cc0|cc-zero/i.test(art.license);

const imageKey = (art) => (art.thumbnailUrl || art.imageUrl || "").split("?")[0];

/**
 * Up to `count` varied public domain pieces for the artwork page sidebar:
 * different artists (and not the current one), no repeated images or
 * near-identical titles, mixed across sources and classifications.
 */
export async function getDiversePublicArt(current, count = 5) {
  const seed = hash(current.id);
  const themeA = THEMES[seed % THEMES.length];
  const themeB = THEMES[(seed >> 4) % THEMES.length] === themeA
    ? THEMES[(seed + 7) % THEMES.length]
    : THEMES[(seed >> 4) % THEMES.length];
  const sourceId = String(current.id).includes(":") ? String(current.id).split(":")[1] : current.id;

  const [related, featured, searchA, searchB] = await Promise.all([
    getRelatedPublicArtworks(current.source, sourceId, 12),
    getPublicDomainFeatured(),
    searchPublicDomainArt(themeA, "cleveland", 10),
    searchPublicDomainArt(themeB, "cleveland", 10),
  ]);

  // Interleave the pools so no single source dominates.
  const pools = [searchA.data, related.data, searchB.data, featured.data].map((p) => p || []);
  const merged = [];
  for (let i = 0; pools.some((p) => i < p.length); i++) {
    for (const pool of pools) if (pool[i]) merged.push(pool[i]);
  }

  const seen = {
    ids: new Set([current.id]),
    artists: new Set([artistKey(current.artist)].filter(Boolean)),
    titles: new Set([titleKey(current.title)].filter(Boolean)),
    images: new Set([imageKey(current)].filter(Boolean)),
  };
  const classCount = {};
  const picks = [];

  const take = (art, { strictClass }) => {
    if (picks.length >= count || !art?.id || BLOCKED_SOURCES.has(art.source)) return;
    if (!isPublicDomain(art)) return;
    const img = imageKey(art);
    const artist = artistKey(art.artist);
    const title = titleKey(art.title);
    const cls = (art.classification || art.department || "").toLowerCase();
    if (!img || seen.ids.has(art.id) || seen.images.has(img)) return;
    if (artist && seen.artists.has(artist)) return;
    if (title && seen.titles.has(title)) return;
    if (strictClass && cls && classCount[cls] >= 2) return;
    picks.push(art);
    seen.ids.add(art.id);
    seen.images.add(img);
    if (artist) seen.artists.add(artist);
    if (title) seen.titles.add(title);
    if (cls) classCount[cls] = (classCount[cls] || 0) + 1;
  };

  // First pass keeps categories mixed; second fills any gaps.
  merged.forEach((art) => take(art, { strictClass: true }));
  merged.forEach((art) => take(art, { strictClass: false }));
  return picks;
}
