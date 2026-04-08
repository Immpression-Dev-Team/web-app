import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import "./LandingPage.css";
import { useEffect, useState } from "react";
import { API_URL } from "../../API_URL";
import GooglePlay from '../../assets/headers/GooglePlay.png';
import Apple from '../../assets/headers/Apple.png';
import IphoneModel from './IphoneModel';
import HowItWorks from './HowItWorks';

const LandingPage = () => {
  const [signUpLink, setSignUpLink] = useState("/signup");
  const [kickStarterlink, setKickStarterLink] = useState(
    "https://www.kickstarter.com/projects/132225890/immpression-presents-the-digital-gallery-movement?ref=discovery&term=immpression&total_hits=247&category_id=332"
  );
  const [donating, setDonating] = useState(false);

  /*
   * fontsReady: stays false until document.fonts.ready resolves.
   * Nothing fades in until this is true — prevents the FOUT flash where
   * the browser briefly renders text in a fallback font before swapping.
   */
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  const donate = async (amountCents = 2500, note = "") => {
    try {
      setDonating(true);
      const res = await fetch(
        `${API_URL}/api/web/donations/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ amountCents, note }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to start donation");
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No redirect URL from server.");
      }
    } catch (e) {
      console.error(e);
      alert("Sorry—couldn't start the donation. Please try again.");
      setDonating(false);
    }
  };

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    const adjustFontSize = () => {
      const isMobileViewport = window.innerWidth <= 768;

      if (/android/i.test(userAgent)) {
        setSignUpLink("https://forms.gle/ogAzLMj9ac92qWYJ8");
        setKickStarterLink(
          "https://www.kickstarter.com/projects/132225890/immpression-presents-the-digital-gallery-movement?ref=discovery&term=immpression&total_hits=247&category_id=332"
        );
        document.querySelectorAll(".gradient-text").forEach((el) => {
          el.style.fontSize = "2rem";
        });
      } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        setSignUpLink("https://forms.gle/ogAzLMj9ac92qWYJ8");
        setKickStarterLink(
          "https://www.kickstarter.com/projects/132225890/immpression-presents-the-digital-gallery-movement?ref=discovery&term=immpression&total_hits=247&category_id=332"
        );
        document.querySelectorAll(".gradient-text").forEach((el) => {
          el.style.fontSize = "2rem";
        });
      } else if (isMobileViewport) {
        document.querySelectorAll(".gradient-text").forEach((el) => {
          el.style.fontSize = "2rem";
        });
      } else {
        document.querySelectorAll(".gradient-text").forEach((el) => {
          el.style.fontSize = "3rem";
        });
      }
    };

    adjustFontSize();
    window.addEventListener("resize", adjustFontSize);
    return () => window.removeEventListener("resize", adjustFontSize);
  }, []);

  /*
   * All hero elements share this fade config.
   * `animate` is keyed to fontsReady — nothing moves until fonts are loaded,
   * so the first frame the user ever sees has the correct typeface already in place.
   */
  const fade = (delay) => ({
    initial: { opacity: 0 },
    animate: { opacity: fontsReady ? 1 : 0 },
    transition: { delay, duration: 0.65, ease: "easeOut" },
  });

  return (
    <div className="landing-wrapper">
      <Helmet>
        <title>Immpression — Find Art. Own It.</title>
        <meta name="description" content="Immpression is an art search engine and marketplace for discovering and buying original artwork from emerging artists. Artists keep 90% of every sale." />
        <link rel="canonical" href="https://www.immpression.art" />
        <meta property="og:title" content="Immpression — Find Art. Own It." />
        <meta property="og:description" content="Discover and buy original artwork from emerging artists. Artists keep 90% of every sale." />
        <meta property="og:url" content="https://www.immpression.art" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Immpression" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Immpression — Find Art. Own It." />
        <meta name="twitter:description" content="Discover and buy original artwork from emerging artists." />
      </Helmet>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-left">

            <motion.div className="badge" {...fade(0.05)}>
              <span className="badge-text">✦ ART SEARCH ENGINE &amp; MARKETPLACE</span>
            </motion.div>

            <motion.h1 className="hero-title" {...fade(0.15)}>
              Find Art.{" "}
              <span className="gradient-text gradient-bold">Own It.</span>
            </motion.h1>

            <motion.p className="hero-subtitle" {...fade(0.28)}>
              Search thousands of artworks, discover emerging artists, and buy
              original pieces directly from creators — all in one place.
            </motion.p>

            <motion.div className="hero-pills" {...fade(0.4)}>
              <span className="hero-pill">✦ Search Thousands of Artworks</span>
              <span className="hero-pill">✦ Discover Emerging Artists</span>
              <span className="hero-pill">✦ Artists Keep 90%</span>
            </motion.div>

            <motion.div className="cta-buttons" {...fade(0.52)}>
              <a
                href="https://play.google.com/store/apps/details?id=com.immpression.artapp"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-google-play"
              >
                <img src={GooglePlay} alt="Get it on Google Play" className="google-play-img" />
              </a>

              <a
                href="https://apps.apple.com/app/id6756974604"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-google-play"
              >
                <img src={Apple} alt="Download on the App Store" className="google-play-img" />
              </a>
            </motion.div>
          </div>

          <div className="hero-right">
            <IphoneModel />
          </div>
        </div>
      </section>

      <HowItWorks />
    </div>
  );
};

export default LandingPage;
