// Temporary mock feed — swap for a real `/marketplace/activity` endpoint
// once one exists. Shape is intentionally flat so a backend response can
// drop straight in.
export const MOCK_ACTIVITY = [
  { id: 1, type: "new_artwork", title: "New piece listed", detail: '"Coastal Fog" by Elena Rivas', time: "12m ago" },
  { id: 2, type: "favorited", title: "Artwork favorited", detail: '"Concrete Bloom" gained a new favorite', time: "48m ago" },
  { id: 3, type: "new_artist", title: "New artist joined", detail: "Marcus Chen joined Immpression", time: "2h ago" },
  { id: 4, type: "listed", title: "Recently listed", detail: '"Night Market" is now for sale', time: "5h ago" },
  { id: 5, type: "new_artwork", title: "New piece listed", detail: '"Paper Moon" by Dara Osei', time: "1d ago" },
  { id: 6, type: "favorited", title: "Artwork favorited", detail: '"Static Bloom" gained a new favorite', time: "1d ago" },
];

export const ACTIVITY_ICON = {
  new_artwork: "✦",
  new_artist: "◆",
  listed: "▲",
  favorited: "♥",
};
