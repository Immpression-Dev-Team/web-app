// Immpression mobile app destinations. Purchases happen in the app, so every
// "buy" path on the website ends at one of these. (Device detection:
// detectPlatform in utils/referralTracking.js — "ios" | "android" | "other".)
export const APP_STORE_URL = "https://apps.apple.com/app/id6756974604";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.immpression.artapp";

const SITE_URL = "https://www.immpression.art";

export function storeUrlFor(platform) {
  return platform === "android" ? PLAY_STORE_URL : APP_STORE_URL;
}

// The one link the website uses to send a buyer to the app for a given
// artwork (the purchase popup's button and QR code both use it). Today
// /get-app just forwards phones to the right store. To open the exact
// artwork in the app later, handle `artwork` in GetApp (e.g. try a
// universal link / app scheme first) — callers won't need to change.
export function appLinkForArtwork(artworkId) {
  const params = artworkId ? `?artwork=${encodeURIComponent(artworkId)}` : "";
  return `${SITE_URL}/get-app${params}`;
}
