import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import "./AboutUs.css";
import GooglePlay from "../../assets/headers/GooglePlay.png";
import Apple from "../../assets/headers/Apple.png";

const fadeUp = (delay = 0) => ({
  initial: { y: 40, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.7, delay },
});

const pillars = [
  {
    number: "01",
    title: "Search",
    body: "Find any artwork, style, artist, or movement instantly. From public domain classics to original pieces, all in one search.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Discover",
    body: "Explore emerging artists, curated collections, and styles you've never encountered. Art finds you here.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Own",
    body: "Buy original artwork directly from the creator. Simple checkout. No middlemen. Artists keep 90% of every sale.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

const differentiators = [
  { label: "Real artists. Real artwork.", desc: "Every piece on Immpression comes from a real creator. No AI-generated stock, no mass-produced prints." },
  { label: "Search engine + marketplace.", desc: "Not just a store. Immpression lets you search art like you search the internet, by style, mood, artist, or movement." },
  { label: "Public domain + original in one place.", desc: "Browse 500 years of art history alongside work made last week. No other platform combines both." },
  { label: "Artists keep 90%.", desc: "We built the economics for creators, not galleries. The most creator-fair split in the space." },
];

const AboutUs = () => {
  return (
    <div className="about-wrapper">
      <Helmet>
        <title>About Us | Immpression</title>
        <meta name="description" content="Immpression is an art search engine and marketplace built to give emerging artists real tools to reach real collectors. Art deserves better discovery." />
        <link rel="canonical" href="https://www.immpression.art/about" />
        <meta property="og:title" content="About Immpression" />
        <meta property="og:description" content="Built to give emerging artists real tools to reach real collectors." />
        <meta property="og:url" content="https://www.immpression.art/about" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <motion.span className="about-eyebrow" {...fadeUp(0.1)}>
            About Immpression
          </motion.span>
          <motion.h1 className="about-hero-title" {...fadeUp(0.2)}>
            Art deserves better<br />
            <span className="about-hero-accent">discovery.</span>
          </motion.h1>
          <motion.p className="about-hero-sub" {...fadeUp(0.35)}>
            Immpression is the search engine, marketplace, and discovery platform
            built for a generation that wants to find art the way they find everything else.
            Instantly, personally, and without barriers.
          </motion.p>
        </div>
        <div className="about-hero-line" />
      </section>

      {/* Story */}
      <section className="about-story">
        <div className="about-section-inner">
          <motion.div className="about-story-grid" {...fadeUp(0)}>
            <div className="about-story-left">
              <span className="about-eyebrow">Why We Exist</span>
              <h2 className="about-section-title">The art world was built for a few.<br />We built this for everyone.</h2>
            </div>
            <div className="about-story-right">
              <p>
                Art has always been hard to access. Discovery is broken, scattered across auction sites,
                gallery walls, and social feeds with no real way to search. Emerging artists can't break
                through. Collectors pay commissions to middlemen who add no value.
              </p>
              <p>
                Immpression exists to fix that. We built a platform where anyone can search
                and discover art, from timeless public domain works to original pieces by
                tomorrow's most important artists, and buy directly from the people who made them.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="about-pillars">
        <div className="about-section-inner">
          <motion.div className="about-section-header" {...fadeUp(0)}>
            <span className="about-eyebrow">What We Do</span>
            <h2 className="about-section-title">Three things.<br />Done right.</h2>
          </motion.div>
          <div className="about-pillars-grid">
            {pillars.map((p, i) => (
              <motion.div
                key={p.number}
                className="about-pillar-card"
                {...fadeUp(i * 0.15)}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className="about-pillar-top">
                  <span className="about-pillar-number">{p.number}</span>
                  <div className="about-pillar-icon">{p.icon}</div>
                </div>
                <h3 className="about-pillar-title">{p.title}</h3>
                <p className="about-pillar-body">{p.body}</p>
                <div className="about-pillar-glow" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="about-diff">
        <div className="about-section-inner">
          <motion.div className="about-section-header" {...fadeUp(0)}>
            <span className="about-eyebrow">Why Immpression</span>
            <h2 className="about-section-title">We're not another<br />art app.</h2>
          </motion.div>
          <div className="about-diff-list">
            {differentiators.map((d, i) => (
              <motion.div
                key={i}
                className="about-diff-item"
                {...fadeUp(i * 0.1)}
              >
                <div className="about-diff-dot" />
                <div>
                  <span className="about-diff-label">{d.label}</span>
                  <p className="about-diff-desc">{d.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="about-vision">
        <div className="about-section-inner">
          <motion.div className="about-vision-inner" {...fadeUp(0)}>
            <span className="about-eyebrow">Our Vision</span>
            <h2 className="about-vision-title">
              Building the ecosystem<br />
              <span className="about-hero-accent">art has always needed.</span>
            </h2>
            <p className="about-vision-body">
              Immpression is more than an app. We're building a full art ecosystem:
              a search engine, a marketplace, a discovery platform, and eventually an
              encyclopedia of art culture. A place where artists are found, collectors
              are inspired, and art becomes part of everyday life again.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-section">
        <div className="about-section-inner">
          <motion.div className="about-cta-inner" {...fadeUp(0)}>
            <h2 className="about-cta-title">Start exploring art.</h2>
            <p className="about-cta-sub">Available now on iOS and Android.</p>
            <div className="about-cta-buttons">
              <a
                href="https://play.google.com/store/apps/details?id=com.immpression.artapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={GooglePlay} alt="Get it on Google Play" className="about-store-badge" />
              </a>
              <a
                href="https://apps.apple.com/app/id6756974604"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={Apple} alt="Download on the App Store" className="about-store-badge" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
