import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import "./LandingPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../API_URL";
import GooglePlay from '../../assets/headers/GooglePlay.png';
import Apple from '../../assets/headers/Apple.png';
// import IphoneModel from './IphoneModel';
import ArtMosaic from './ArtMosaic';
import HowItWorks from './HowItWorks';
import FeaturedArticles from './FeaturedArticles';
import MobileLanding from './MobileLanding';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
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
  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  const fade = (delay) => ({
    initial: { opacity: 0 },
    animate: { opacity: fontsReady ? 1 : 0 },
    transition: { delay, duration: 0.65, ease: "easeOut" },
  });

  return (
    <div className="landing-wrapper">
      <Helmet>
        <title>Immpression — Art Search Engine &amp; Marketplace</title>
        <meta name="description" content="Immpression is an art search engine and marketplace for discovering and buying original artwork from emerging artists. Artists keep 90% of every sale." />
        <link rel="canonical" href="https://www.immpression.art" />
        <meta property="og:title" content="Immpression — Art Search Engine &amp; Marketplace" />
        <meta property="og:description" content="Discover and buy original artwork from emerging artists. Artists keep 90% of every sale." />
        <meta property="og:url" content="https://www.immpression.art" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Immpression" />
        <meta property="og:image" content="https://www.immpression.art/Immpression_UI_1.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Immpression — Art Search Engine &amp; Marketplace" />
        <meta name="twitter:description" content="Discover and buy original artwork from emerging artists." />
        <meta name="twitter:image" content="https://www.immpression.art/Immpression_UI_1.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://www.immpression.art/#organization",
              "name": "Immpression",
              "url": "https://www.immpression.art",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.immpression.art/Logo_T.png"
              },
              "description": "Immpression is an art search engine and marketplace for discovering and buying original artwork from emerging artists.",
              "email": "immpression.nyc@gmail.com",
              "sameAs": [
                "https://play.google.com/store/apps/details?id=com.immpression.artapp",
                "https://apps.apple.com/app/id6756974604"
              ]
            },
            {
              "@type": "WebSite",
              "@id": "https://www.immpression.art/#website",
              "url": "https://www.immpression.art",
              "name": "Immpression",
              "description": "Art search engine and marketplace. Discover and buy original artwork from emerging artists.",
              "publisher": { "@id": "https://www.immpression.art/#organization" },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.immpression.art/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@type": "WebPage",
              "@id": "https://www.immpression.art/#webpage",
              "url": "https://www.immpression.art",
              "name": "Immpression — Art Search Engine & Marketplace",
              "isPartOf": { "@id": "https://www.immpression.art/#website" },
              "about": { "@id": "https://www.immpression.art/#organization" },
              "description": "Immpression is an art search engine and marketplace for discovering and buying original artwork from emerging artists. Artists keep 90% of every sale."
            }
          ]
        })}</script>
      </Helmet>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-left">

            <motion.p className="hero-eyebrow" {...fade(0.05)}>✦ ART SEARCH ENGINE &amp; MARKETPLACE</motion.p>

            <motion.h1 className="hero-title" {...fade(0.15)}>
              Find Art.{" "}
              <span className="gradient-text gradient-bold">Own It.</span>
            </motion.h1>

            <motion.p className="hero-subtitle" {...fade(0.28)}>
              Search thousands of artworks, discover emerging artists, and buy
              original pieces directly from creators, all in one place.
            </motion.p>

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

          {/* empty spacer keeps the 2-column grid intact */}
          <div className="hero-right" />
        </div>

        {/* mosaic is absolutely positioned so it spans the full hero height */}
        <div className="hero-mosaic-panel">
          <ArtMosaic />
          <div className="mosaic-overlay">
            <form className="mosaic-search" onSubmit={handleSearch}>
              <svg className="mosaic-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="mosaic-search-input"
                placeholder="Search by artist, style, keyword, or anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="mosaic-search-btn">Search</button>
            </form>
            <div className="mosaic-trending">
              <span className="mosaic-trending-label">Trending</span>
              {["Abstract", "Portrait", "Van Gogh", "Photography", "Sculpture", "NYC Art"].map((term) => (
                <button
                  key={term}
                  className="mosaic-trending-tag"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MobileLanding
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      <FeaturedArticles />
      <HowItWorks />
    </div>
  );
};

export default LandingPage;
