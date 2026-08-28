import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import GooglePlay from "../../assets/headers/GooglePlay.png";
import Apple from "../../assets/headers/Apple.png";
import { API_URL } from "../../API_URL";
import { detectPlatform, trackReferralEvent } from "../../utils/referralTracking";
import "./Invite.css";

const APP_STORE_URL = "https://apps.apple.com/app/id6756974604";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.immpression.artapp";

// Served straight from web-app/public — referenced by root-relative URL, not
// imported as a module (Vite doesn't bundle files under public/).
const INVITE_BANNER_SRC = "/Immpression_Invite_Banner.png";
const INVITE_BANNER_ABSOLUTE_URL = "https://www.immpression.art/Immpression_Invite_Banner.png";

export default function Invite() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState("loading"); // loading | invalid | role | download
  const [canonicalCode, setCanonicalCode] = useState(code);
  const platform = useRef(detectPlatform()).current;
  const viewTracked = useRef(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_URL}/api/invite/${code}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.success) {
          setStep("invalid");
          return;
        }
        if (data.data.redirected) {
          navigate(`/invite/${data.data.code}`, { replace: true });
          return;
        }
        setCanonicalCode(data.data.code);
        setStep("role");
      })
      .catch(() => { if (!cancelled) setStep("invalid"); });

    return () => { cancelled = true; };
  }, [code, navigate]);

  useEffect(() => {
    if (step === "role" && !viewTracked.current) {
      viewTracked.current = true;
      trackReferralEvent(canonicalCode, { type: "PAGE_VIEW", platform });
    }
  }, [step, canonicalCode, platform]);

  function handleRoleSelect(role) {
    trackReferralEvent(canonicalCode, { type: "ROLE_SELECTED", role, platform });
    setStep("download");
  }

  function handleStoreClick(store) {
    trackReferralEvent(canonicalCode, {
      type: store === "ios" ? "APP_STORE_CLICK" : "PLAY_STORE_CLICK",
      platform,
    });
    window.location.href = store === "ios" ? APP_STORE_URL : PLAY_STORE_URL;
  }

  const pageUrl = `https://www.immpression.art/invite/${code}`;

  return (
    <div className="invite-page">
      <Helmet>
        <title>You&apos;re Invited to Immpression</title>
        <meta name="description" content="Discover, collect, buy and sell art on Immpression." />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="You're Invited to Immpression" />
        <meta property="og:description" content="Discover, collect, buy and sell art on Immpression." />
        <meta property="og:image" content={INVITE_BANNER_ABSOLUTE_URL} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Immpression" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="You're Invited to Immpression" />
        <meta name="twitter:description" content="Discover, collect, buy and sell art on Immpression." />
        <meta name="twitter:image" content={INVITE_BANNER_ABSOLUTE_URL} />
      </Helmet>

      <div className="invite-card">
        <div className="invite-banner-wrap">
          <img src={INVITE_BANNER_SRC} alt="Immpression" className="invite-banner-img" />
        </div>

        {step === "loading" && (
          <div className="invite-body">
            <p className="invite-status">Loading your invite…</p>
          </div>
        )}

        {step === "invalid" && (
          <div className="invite-body">
            <h1 className="invite-heading">This invite link is no longer valid</h1>
            <button className="invite-primary-btn" onClick={() => navigate("/")}>Go to Immpression</button>
          </div>
        )}

        {step === "role" && (
          <div className="invite-body">
            <h1 className="invite-heading">You&apos;re invited to Immpression</h1>
            <p className="invite-question">How do you want to use Immpression?</p>
            <div className="invite-role-options">
              <button className="invite-role-card" onClick={() => handleRoleSelect("ARTIST")}>
                <span className="invite-role-emoji" aria-hidden="true">🎨</span>
                <span>I&apos;m an Artist</span>
              </button>
              <button className="invite-role-card" onClick={() => handleRoleSelect("ART_LOVER")}>
                <span className="invite-role-emoji" aria-hidden="true">🖼️</span>
                <span>I&apos;m an Art Lover</span>
              </button>
            </div>
          </div>
        )}

        {step === "download" && (
          <div className="invite-body">
            <h1 className="invite-heading">Download Immpression</h1>
            <p className="invite-question">Get the app to get started.</p>
            <div className={`invite-store-options invite-store-${platform}`}>
              <button
                className={`invite-store-btn ${platform === "ios" ? "invite-store-primary" : ""}`}
                onClick={() => handleStoreClick("ios")}
              >
                <img src={Apple} alt="Download on the App Store" className="invite-store-img" />
              </button>
              <button
                className={`invite-store-btn ${platform === "android" ? "invite-store-primary" : ""}`}
                onClick={() => handleStoreClick("android")}
              >
                <img src={GooglePlay} alt="Get it on Google Play" className="invite-store-img" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
