// Ad slot sizes per network/placement. Whether a slot is on, and its unit
// key, are set by admins in the admin panel (Settings → Ad Networks) and
// fetched at runtime via useAdPlacement — placement ids must match the
// backend's AD_PLACEMENTS.
export const AD_SLOT_SIZES = {
  adsterra: {
    marketplaceRailTop: { width: 300, height: 250 },
  },
};
