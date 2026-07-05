import { motion } from "framer-motion";
import { Suspense } from "react";
import IphoneModel from "./IphoneModel";
import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Search",
    description:
      "Find any artwork, style, or artist instantly. Browse public domain classics and modern originals — all in one search.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Discover",
    description:
      "Explore emerging artists and curated collections. Scroll through styles, movements, and creators you've never seen before.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Own",
    description:
      "Buy original artwork directly from creators. Simple, secure checkout. No middlemen — artists keep 90% of every sale.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

/* Hand-drawn wavy divider between steps */
function StepDivider() {
  return (
    <svg className="hiw-divider" viewBox="0 0 260 12" fill="none" preserveAspectRatio="none">
      <path
        d="M2,6 C22,2 42,10 65,6 C88,2 108,9 130,6 C152,3 172,8 195,6 C212,4 232,7 258,6"
        stroke="rgba(71,239,172,0.22)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="5,7"
      />
    </svg>
  );
}

/* Paint stroke underline beneath "Own." */
function PaintStroke() {
  return (
    <svg className="hiw-paint-stroke" viewBox="0 0 200 18" fill="none">
      <path
        d="M3,12 C35,5 75,15 110,10 C140,6 165,13 197,9"
        stroke="#47efac"
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M15,14 C50,12 90,16 125,12"
        stroke="#7eb8ff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

/* Spray dot cluster — fixed coords, no random */
function SprayCluster() {
  const dots = [
    { cx: 8,  cy: 14, r: 1.4 }, { cx: 18, cy: 6,  r: 0.8 },
    { cx: 28, cy: 18, r: 1.1 }, { cx: 38, cy: 9,  r: 0.6 },
    { cx: 14, cy: 28, r: 1.0 }, { cx: 44, cy: 22, r: 1.3 },
    { cx: 6,  cy: 36, r: 0.7 }, { cx: 52, cy: 12, r: 0.9 },
    { cx: 24, cy: 40, r: 1.2 }, { cx: 60, cy: 30, r: 0.5 },
    { cx: 34, cy: 50, r: 0.8 }, { cx: 48, cy: 42, r: 1.0 },
  ];
  return (
    <svg className="hiw-spray" viewBox="0 0 70 60" fill="none" aria-hidden="true">
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#47efac" opacity={0.25 + (i % 3) * 0.12} />
      ))}
    </svg>
  );
}

const HowItWorks = () => {
  return (
    <section className="hiw-section">
      {/* Subtle background accent glow */}
      <div className="hiw-bg-glow" aria-hidden="true" />

      <div className="hiw-container">

        {/* ── Col 1: header text ── */}
        <motion.div
          className="hiw-col hiw-col-text"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
        >
          <span className="hiw-section-label">How It Works</span>
          <span className="hiw-eyebrow" style={{ display: 'none' }}>How It Works</span>
          <h2 className="hiw-title">
            <span className="hiw-title-line">Search.</span>
            <span className="hiw-title-line">Discover.</span>
            <span className="hiw-title-line hiw-title-accent">Own.</span>
          </h2>
          <PaintStroke />
          <p className="hiw-subtitle">
            Everything you need to find and own art — in three steps.
          </p>
          <SprayCluster />
        </motion.div>

        {/* ── Col 2: phone ── */}
        <div className="hiw-col hiw-col-phone">
          <Suspense fallback={null}>
            <IphoneModel />
          </Suspense>
        </div>

        {/* ── Col 3: steps ── */}
        <div className="hiw-col hiw-col-steps">
          {steps.map((step, i) => (
            <div key={step.number}>
              <motion.div
                className="hiw-step"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.14 }}
              >
                {/* Ghost number — stencil texture */}
                <span className="hiw-ghost-num" aria-hidden="true">{step.number}</span>

                <div className="hiw-step-body">
                  <div className="hiw-step-meta">
                    <div className="hiw-step-icon">{step.icon}</div>
                    <span className="hiw-step-tag">{step.number}</span>
                  </div>
                  <h3 className="hiw-step-title">{step.title}</h3>
                  <p className="hiw-step-desc">{step.description}</p>
                </div>
              </motion.div>

              {i < steps.length - 1 && <StepDivider />}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
