import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const APP_STORE_URL = "https://apps.apple.com/app/id6756974604";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.immpression.artapp";

// Selling happens in the mobile app (the web has no seller onboarding), so
// "Sell Your Art" opens the app's store page — Google Play on Android,
// the App Store everywhere else (same default as the Marketplace's
// "Start Selling" card).
const SELL_URL =
  typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)
    ? PLAY_STORE_URL
    : APP_STORE_URL;

// Links that collapse into the "More" menu on phones. New Arrivals and How
// It Works point at anchors the Navbar scrolls to (see useHashScroll).
const SECONDARY_LINKS = [
  { to: "/?sort=newest#listings", label: "New Arrivals", icon: SparkleIcon },
  { to: "/blog", label: "Artist Stories", icon: BookIcon },
  { to: "/flashback#how-it-works", label: "How It Works", icon: InfoIcon },
];

// Secondary bar under the main navbar on /marketplace pages: shopping
// shortcuts on the left, app downloads on the right.
export default function MarketplaceSubnav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMoreOpen(false);
  }, [location]);

  useEffect(() => {
    if (!moreOpen) return;
    const onPointer = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  const [newArrivals, ...rest] = SECONDARY_LINKS;

  return (
    <div className="subnav">
      <div className="subnav-inner">
        <nav className="subnav-links" aria-label="Marketplace shortcuts">
          <SubnavLink link={newArrivals} className="subnav-link--secondary" />
          <a href={SELL_URL} target="_blank" rel="noopener noreferrer" className="subnav-link subnav-link--sell">
            <BrushIcon />
            Sell Your Art
          </a>
          {rest.map((link) => (
            <SubnavLink key={link.to} link={link} className="subnav-link--secondary" />
          ))}

          {/* Phones: the secondary links fold into this menu. */}
          <div className="subnav-more" ref={moreRef}>
            <button
              type="button"
              className="subnav-link subnav-more-btn"
              aria-expanded={moreOpen}
              aria-haspopup="true"
              onClick={() => setMoreOpen((open) => !open)}
            >
              More
              <ChevronIcon />
            </button>
            {moreOpen && (
              <div className="subnav-menu">
                {SECONDARY_LINKS.map((link) => (
                  <SubnavLink key={link.to} link={link} className="subnav-menu-item" />
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="subnav-app">
          <span className="subnav-app-label">Get the App</span>
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="subnav-app-btn" aria-label="Download on the App Store">
            <AppleIcon />
          </a>
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="subnav-app-btn" aria-label="Get it on Google Play">
            <PlayIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

function SubnavLink({ link, className }) {
  const Icon = link.icon;
  return (
    <Link to={link.to} className={`subnav-link ${className}`}>
      <Icon />
      {link.label}
    </Link>
  );
}

const iconProps = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

function SparkleIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" />
    </svg>
  );
}

function BrushIcon() {
  return (
    <svg {...iconProps}>
      <path d="M18.4 2.6a2 2 0 0 1 2.9 2.9L12 14.8 9.2 12z" />
      <path d="M9.2 12c-2.5 0-4.2 1.7-4.2 4.2 0 1.6-.8 2.6-2 3.2 1.2.9 2.9 1.6 4.6 1.6 3.4 0 5.4-2.3 4.4-6.2" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
      <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16.5" />
      <line x1="12" y1="7.5" x2="12" y2="7.6" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg {...iconProps} width={12} height={12}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" />
    </svg>
  );
}
