import "./AdsterraBanner.css";

// Adsterra's banner snippet sets a global `atOptions` and then loads a
// script that reads it once. Dropping that snippet straight into a React
// page breaks on client-side navigation and when two banners share a page
// (they overwrite each other's atOptions), so each banner runs in its own
// iframe document instead.
//
// Adsterra's script reads document.cookie without a try/catch, which throws
// in a fully sandboxed (opaque-origin) frame, so allow-same-origin is needed
// for ads to render. The sandbox still blocks the ad from redirecting the
// page on its own (top navigation needs a user click) and from opening
// modal dialogs; clicks open the advertiser in a new tab.
const SANDBOX = [
  "allow-scripts",
  "allow-same-origin",
  "allow-popups",
  "allow-popups-to-escape-sandbox",
  "allow-top-navigation-by-user-activation",
].join(" ");

// `src` comes from the ad code pasted into the admin panel (Adsterra rotates
// its ad domains). The values are embedded as JSON / an escaped attribute
// so they can't break out of the generated document.
export default function AdsterraBanner({ adKey, src, width, height, className = "" }) {
  if (!adKey || !src) return null;

  const options = JSON.stringify({ key: adKey, format: "iframe", height, width, params: {} })
    .replace(/</g, "\\u003c");
  const safeSrc = src.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

  const srcDoc = `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>
</head><body>
<script>atOptions=${options};</script>
<script src="${safeSrc}"></script>
</body></html>`;

  return (
    <div className={`adsterra-banner ${className}`.trim()}>
      <span className="adsterra-banner-label">Advertisement</span>
      <iframe
        title="Advertisement"
        className="adsterra-banner-frame"
        srcDoc={srcDoc}
        width={width}
        height={height}
        sandbox={SANDBOX}
        loading="lazy"
        scrolling="no"
      />
    </div>
  );
}
