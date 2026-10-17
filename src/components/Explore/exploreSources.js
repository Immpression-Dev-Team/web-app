// Museum sources the /public-art backend proxies. Keys match the backend's
// VALID_SOURCES (Rijksmuseum is omitted — it's off unless an API key is set).
export const SOURCES = [
  { key: "all", label: "All Museums", short: "All" },
  { key: "met", label: "The Metropolitan Museum of Art", short: "The Met" },
  { key: "chicago", label: "Art Institute of Chicago", short: "Art Institute" },
  { key: "cleveland", label: "Cleveland Museum of Art", short: "Cleveland" },
  { key: "wikimedia", label: "Wikimedia Commons", short: "Wikimedia" },
];

export const shortSourceName = (key) =>
  SOURCES.find((s) => s.key === key)?.short || "Museum";
