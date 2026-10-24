import { useEffect, useState } from "react";
import { API_URL } from "../API_URL";

// One request per page load, shared by every ad slot on the page.
let configPromise = null;

function getAdConfig() {
  if (!configPromise) {
    configPromise = fetch(`${API_URL}/api/ads/config`)
      .then((r) => r.json())
      .then((d) => (d.success ? d.data : {}))
      .catch(() => {
        configPromise = null; // let a later mount retry
        return {};
      });
  }
  return configPromise;
}

// Returns { key, src } for a placement that admins have switched on, else null.
export function useAdPlacement(network, placementId) {
  const [placement, setPlacement] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getAdConfig().then((config) => {
      if (!cancelled) setPlacement(config?.[network]?.[placementId] || null);
    });
    return () => { cancelled = true; };
  }, [network, placementId]);

  return placement;
}
