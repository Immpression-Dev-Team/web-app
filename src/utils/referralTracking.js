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
export function trackReferralEvent(code, { type, role, platform }) {
  try {
    const url = `${API_URL}/api/invite/${code}/event`;
    const payload = JSON.stringify({ type, role, platform });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Tracking must never block the user flow.
  }
}
