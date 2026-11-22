import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { QRCodeSVG } from "qrcode.react";
import Apple from "../../assets/headers/Apple.png";
import GooglePlay from "../../assets/headers/GooglePlay.png";
import { detectPlatform } from "../../utils/referralTracking";
import { APP_STORE_URL, PLAY_STORE_URL, appLinkForArtwork, storeUrlFor } from "../../constants/appLinks";
import "./GetApp.css";

// /get-app — the smart link behind the artwork purchase popup's button and
// QR code (see appLinkForArtwork). Phones go straight to their app store;
// anything else sees both stores and a QR code for their phone.
// The `?artwork=<id>` param is accepted but not used yet: it's where opening
// that artwork inside the app will hook in once deep links exist.
export default function GetApp() {
  const platform = useRef(detectPlatform()).current;
  const [searchParams] = useSearchParams();
  const smartLink = appLinkForArtwork(searchParams.get("artwork"));
  const isPhone = platform === "ios" || platform === "android";

  useEffect(() => {
    if (isPhone) window.location.replace(storeUrlFor(platform));
  }, [isPhone, platform]);

  return (
    <div className="get-app">
      <Helmet>
        <title>Get the Immpression App</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="get-app-card">
        <h1 className="get-app-title">Get the Immpression app</h1>
        {isPhone ? (
          <p className="get-app-copy">
            Opening the {platform === "ios" ? "App Store" : "Google Play Store"}…{" "}
            <a href={storeUrlFor(platform)}>Tap here</a> if nothing happens.
          </p>
        ) : (
          <>
            <p className="get-app-copy">
              Buy original art, follow artists, and sell your own work. Available on iOS and Android.
            </p>
            <div className="get-app-qr">
              <QRCodeSVG value={smartLink} size={148} marginSize={2} />
              <span>Scan with your phone&apos;s camera</span>
            </div>
            <div className="get-app-stores">
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                <img src={Apple} alt="Download on the App Store" />
              </a>
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
                <img src={GooglePlay} alt="Get it on Google Play" />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
