import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import logoIcon from "../../../assets/Logo_T.png";
import wordmark from "../../../assets/headers/Immpression_multi.png";
import Apple from "../../../assets/headers/Apple.png";
import GooglePlay from "../../../assets/headers/GooglePlay.png";
import { detectPlatform } from "../../../utils/referralTracking";
import { APP_STORE_URL, PLAY_STORE_URL, appLinkForArtwork } from "../../../constants/appLinks";
import "./PurchaseModal.css";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// "Purchase Artwork" popup on the artwork page. Purchases happen in the
// Immpression app, so this hands the buyer off to it: the button (and on
// desktop, the QR code) go to the /get-app smart link for this artwork,
// which forwards phones to their app store. Device-specific store buttons
// sit underneath. No website checkout.
export default function PurchaseModal({ open, onClose, artwork }) {
  const dialogRef = useRef(null);
  const platform = useRef(detectPlatform()).current;
  const isPhone = platform === "ios" || platform === "android";
  const appLink = appLinkForArtwork(artwork._id);

  // Escape to close, Tab kept inside the dialog, background scroll locked,
  // and focus returned to the "Purchase Artwork" button on close.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      dialogRef.current?.querySelector(".pm-primary")?.focus();
    }, 50);

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  const price = `$${Number(artwork.price).toLocaleString()}`;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="pm-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={dialogRef}
            className="pm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pm-title"
            aria-describedby="pm-subtitle"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <button type="button" className="pm-close" onClick={onClose} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="pm-art">
              <img src={artwork.imageLink} alt={`${artwork.name} by ${artwork.artistName}`} />
            </div>

            <div className="pm-body">
              <div className="pm-brand">
                <img src={logoIcon} alt="" className="pm-brand-icon" />
                <img src={wordmark} alt="Immpression" className="pm-brand-wordmark" />
              </div>

              <h2 id="pm-title" className="pm-title">Make it yours.</h2>
              <p id="pm-subtitle" className="pm-subtitle">
                Purchase this artwork securely through the Immpression app.
              </p>

              <div className="pm-summary">
                <div className="pm-summary-text">
                  <span className="pm-summary-name">{artwork.name}</span>
                  <span className="pm-summary-artist">by {artwork.artistName}</span>
                </div>
                <span className="pm-summary-price">{price}</span>
              </div>

              <a
                href={appLink}
                className="pm-primary"
                {...(isPhone ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              >
                Continue in Immpression
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <p className="pm-availability">
                <span className="pm-dot" aria-hidden="true" />
                Immpression is available on iOS and Android.
              </p>

              {isPhone ? (
                <div className="pm-store-single">
                  {platform === "ios" ? (
                    <a href={APP_STORE_URL}>
                      <img src={Apple} alt="Download on the App Store" />
                    </a>
                  ) : (
                    <a href={PLAY_STORE_URL}>
                      <img src={GooglePlay} alt="Get it on Google Play" />
                    </a>
                  )}
                </div>
              ) : (
                <div className="pm-handoff">
                  <div className="pm-qr">
                    <QRCodeSVG value={appLink} size={104} marginSize={1} title="QR code to get the Immpression app" />
                  </div>
                  <div className="pm-handoff-side">
                    <p className="pm-handoff-title">Scan to continue on your phone</p>
                    <div className="pm-stores">
                      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                        <img src={Apple} alt="Download on the App Store" />
                      </a>
                      <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
                        <img src={GooglePlay} alt="Get it on Google Play" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
