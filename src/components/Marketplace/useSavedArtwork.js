import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "immpression_saved_artworks";

function readSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeSaved(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Private browsing / storage disabled — save just won't persist.
  }
}

// Local-only "save" (no account system is live in this guest-facing web
// app yet) — persists per-browser via localStorage rather than faking a
// synced favorite.
export default function useSavedArtwork(artworkId) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!artworkId) return;
    setSaved(readSaved().includes(artworkId));
  }, [artworkId]);

  const toggleSaved = useCallback(() => {
    if (!artworkId) return;
    const current = readSaved();
    const isSaved = current.includes(artworkId);
    const next = isSaved ? current.filter((id) => id !== artworkId) : [...current, artworkId];
    writeSaved(next);
    setSaved(!isSaved);
  }, [artworkId]);

  return [saved, toggleSaved];
}
