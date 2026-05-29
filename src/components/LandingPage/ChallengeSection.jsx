import { motion } from "framer-motion";
import "./ChallengeSection.css";

const ChallengeSection = () => {
  return (
    <motion.div
      className="ch-root"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
    >
      <h2 className="ch-event-title">
        <span className="ch-title-drawing">DRAWING</span>
        <span className="ch-title-competition">COMPETITION</span>
      </h2>

      <div className="ch-gif-outer">
        <div className="ch-gif-wrap">
          <img src="/drawing.gif" alt="Drawing challenge" className="ch-gif" />
        </div>
      </div>

      <div className="ch-cash-prize">CASH PRIZE <span className="ch-prize-amount">$40</span></div>

      <p className="ch-tagline">Create artwork based on our chosen topic and compete for cash prizes.</p>


      <div className="ch-cta-wrap">
        <button className="ch-cta" onClick={() => {}}>
          <span className="ch-cta-shimmer" />
          <span className="ch-cta-text">Join Challenge</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ChallengeSection;
