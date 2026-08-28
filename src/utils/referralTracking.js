import { API_URL } from "../API_URL";

export function detectPlatform() {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

// Fire-and-forget: must never throw, and must never delay/block whatever the
// caller does next (e.g. redirecting to an app store). Uses sendBeacon so the
// request still gets sent even when the page is about to navigate away.
//
// The web-app origin (immpression.art) and the API origin (vercel.app) are
// different, so this is a cross-origin request. sendBeacon does NOT perform a
// CORS preflight — if the payload's content type isn't one of the CORS
// "simple" types (application/x-www-form-urlencoded, multipart/form-data,
// text/plain), browsers silently refuse to even queue the beacon (it just
// returns false). We send text/plain to stay a simple request, and the
// backend parses the body as JSON regardless of the declared content type.
export function trackReferralEvent(code, { type, role, platform }) {
  try {
    const url = `${API_URL}/api/invite/${code}/event`;
    const payload = JSON.stringify({ type, role, platform });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "text/plain" });
      const queued = navigator.sendBeacon(url, blob);
      if (queued) return;
      // Fall through to fetch if the beacon couldn't be queued for any reason.
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Tracking must never block the user flow.
  }
}
