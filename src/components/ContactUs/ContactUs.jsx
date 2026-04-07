import { useState } from "react";
import { motion } from "framer-motion";
import "./ContactUs.css";
import { API_URL } from "../../API_URL";

const fadeUp = (delay = 0) => ({
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.65, delay },
});

const reasons = [
  { icon: "🎨", label: "Artists", desc: "Want to list your work on Immpression?" },
  { icon: "🖼", label: "Collectors", desc: "Looking for help finding or buying art?" },
  { icon: "🤝", label: "Partnerships", desc: "Interested in working with us?" },
  { icon: "💬", label: "Feedback", desc: "Have an idea or something to report?" },
];

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">

      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <motion.span className="contact-eyebrow" {...fadeUp(0.1)}>
            Contact
          </motion.span>
          <motion.h1 className="contact-title" {...fadeUp(0.2)}>
            Let's Talk.
          </motion.h1>
          <motion.p className="contact-subtitle" {...fadeUp(0.35)}>
            Questions, ideas, or just want to connect? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Main: Form + Info */}
      <section className="contact-main">
        <div className="contact-main-inner">

          {/* Form */}
          <motion.div
            className="contact-form-block"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {submitted ? (
              <div className="contact-success">
                <span className="contact-success-icon">✦</span>
                <h3>Message sent.</h3>
                <p>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className={`contact-field ${focused === "name" ? "focused" : ""}`}>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused("")}
                    required
                  />
                </div>

                <div className={`contact-field ${focused === "email" ? "focused" : ""}`}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    required
                  />
                </div>

                <div className={`contact-field ${focused === "message" ? "focused" : ""}`}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="What's on your mind?"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused("")}
                    required
                  />
                </div>

                {error && <p className="contact-error">{error}</p>}
                <button type="submit" className="contact-submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            className="contact-info-block"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <div className="contact-info-item">
              <span className="contact-info-label">Email</span>
              <a href="mailto:contact@immpression.com" className="contact-info-value">
                contact@immpression.com
              </a>
            </div>
            <div className="contact-info-item">
              <span className="contact-info-label">Response Time</span>
              <span className="contact-info-value">Within 24 hours</span>
            </div>

            <div className="contact-divider" />

            <span className="contact-eyebrow" style={{ marginBottom: "1.5rem", display: "block" }}>
              Who should reach out?
            </span>
            <div className="contact-reasons">
              {reasons.map((r) => (
                <div className="contact-reason" key={r.label}>
                  <span className="contact-reason-icon">{r.icon}</span>
                  <div>
                    <span className="contact-reason-label">{r.label}</span>
                    <p className="contact-reason-desc">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
};

export default ContactUs;
