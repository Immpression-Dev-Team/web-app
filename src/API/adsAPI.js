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

// True once the backend confirms admins have switched this placement on.
export function useAdPlacement(network, placementId) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAdConfig().then((config) => {
      if (!cancelled) setEnabled(Boolean(config?.[network]?.[placementId]));
    });
    return () => { cancelled = true; };
  }, [network, placementId]);

  return enabled;
}
