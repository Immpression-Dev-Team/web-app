import { useEffect, useRef, useState } from "react";
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

// `autoHeight` (responsive units such as native banners): the frame spans
// its container's width and follows the ad content's height instead of a
// fixed size. `height` is then just the space reserved before it loads.
export default function AdFrame({ code, width, height, className = "", autoHeight = false }) {
  const frameRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(null);

  useEffect(() => {
    if (!autoHeight) return;
    const frame = frameRef.current;
    if (!frame) return;

    let observer;
    const watch = () => {
      const doc = frame.contentDocument;
      if (!doc?.body) return;
      const measure = () => setContentHeight(Math.ceil(doc.body.scrollHeight));
      measure();
      observer?.disconnect();
      observer = new ResizeObserver(measure);
      observer.observe(doc.body);
    };
    frame.addEventListener("load", watch);
    watch();
    return () => {
      frame.removeEventListener("load", watch);
      observer?.disconnect();
    };
  }, [autoHeight, code]);

  if (!code?.trim()) return null;

  const srcDoc = `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>
</head><body>
${code}
</body></html>`;

  return (
    <div className={`ad-frame${autoHeight ? " ad-frame--auto" : ""} ${className}`.trim()}>
      <span className="ad-frame-label">Advertisement</span>
      <iframe
        ref={frameRef}
        title="Advertisement"
        className="ad-frame-frame"
        srcDoc={srcDoc}
        width={autoHeight ? undefined : width}
        height={autoHeight ? (contentHeight || height) : height}
        sandbox={SANDBOX}
        loading="lazy"
        scrolling="no"
      />
    </div>
  );
}
