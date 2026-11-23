// Recommendation picks for the artwork page, built from plain /marketplace
// listings. Available pieces come before sold ones; nothing repeats.

const availableFirst = (list) => [
  ...list.filter((a) => !a.isSold),
  ...list.filter((a) => a.isSold),
];

function takeUnique(lists, count, seen) {
  const picked = [];
  for (const list of lists) {
    for (const art of list) {
      if (picked.length >= count) return picked;
      if (!art?._id || seen.has(art._id)) continue;
      seen.add(art._id);
      picked.push(art);
    }
  }
  return picked;
}

// "More Artwork": same-category pieces first, topped up from the rest of
// the marketplace. Excludes the current artwork.
export function pickMoreArtwork(current, sameCategory, marketplace, count = 4) {
  const seen = new Set([current._id]);
  return takeUnique([availableFirst(sameCategory), availableFirst(marketplace)], count, seen);
}
