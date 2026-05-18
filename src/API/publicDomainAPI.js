import axios from "axios";
import { API_URL } from "../API_URL";

export async function getPublicDomainFeatured() {
  try {
    const res = await axios.get(`${API_URL}/public-art/featured`);
    return res.data;
  } catch {
    return { success: false, data: [] };
  }
}

export async function searchPublicDomainArt(query, source = "all", limit = 20) {
  try {
    const res = await axios.get(`${API_URL}/public-art/search`, {
      params: { q: query, source, limit },
    });
    return res.data;
  } catch {
    return { success: false, data: [] };
  }
}

export async function getPublicArtwork(source, id) {
  try {
    const res = await axios.get(`${API_URL}/public-art/${source}/${id}`);
    return res.data;
  } catch {
    return { success: false, data: null };
  }
}

// Strips the "met:" / "chicago:" prefix the backend adds to IDs
export function parseArtworkId(rawId) {
  const str = String(rawId);
  return str.includes(":") ? str.split(":")[1] : str;
}
