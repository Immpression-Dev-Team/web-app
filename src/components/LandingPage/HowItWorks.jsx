import { motion } from "framer-motion";
import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Search",
    description:
      "Find any artwork, style, or artist instantly. Browse public domain classics and modern originals — all in one search.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Discover",
    description:
      "Explore emerging artists and curated collections. Scroll through styles, movements, and creators you've never seen before.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Own",
    description:
      "Buy original artwork directly from creators. Simple, secure checkout. No middlemen — artists keep 90% of every sale.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

const HowItWorks = () => {
  return (
    <section className="hiw-section">
      <div className="hiw-container">
        <motion.div
          className="hiw-header"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="hiw-eyebrow">How It Works</span>
          <h2 className="hiw-title">
            Search. Discover. <span className="hiw-title-accent">Own.</span>
          </h2>
          <p className="hiw-subtitle">
            Everything you need to find and own art — in three steps.
          </p>
        </motion.div>

        <div className="hiw-cards">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="hiw-card"
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="hiw-card-top">
                <span className="hiw-step-number">{step.number}</span>
                <div className="hiw-icon">{step.icon}</div>
              </div>
              <h3 className="hiw-card-title">{step.title}</h3>
              <p className="hiw-card-desc">{step.description}</p>
              <div className="hiw-card-glow" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
