import "./AdFrame.css";

// Renders an ad network's code snippet (exactly as copied from the network's
// dashboard, see constants/ads.js) inside its own iframe document. Network
// snippets set globals (e.g. Adsterra's `atOptions`) and use
// document.write / "last script on the page" tricks, which break on
// client-side navigation and collide when two ads share a page — a separate
// document per ad avoids all of that.
//
// allow-same-origin is needed because ad scripts read document.cookie
// without a try/catch, which throws in a fully sandboxed frame. The sandbox
// still blocks the ad from redirecting the page on its own (top navigation
// needs a user click); clicks open the advertiser in a new tab.
const SANDBOX = [
  "allow-scripts",
  "allow-same-origin",
  "allow-popups",
  "allow-popups-to-escape-sandbox",
  "allow-top-navigation-by-user-activation",
].join(" ");

export default function AdFrame({ code, width, height, className = "" }) {
  if (!code?.trim()) return null;

  const srcDoc = `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>
</head><body>
${code}
</body></html>`;

  return (
    <div className={`ad-frame ${className}`.trim()}>
      <span className="ad-frame-label">Advertisement</span>
      <iframe
        title="Advertisement"
        className="ad-frame-frame"
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
