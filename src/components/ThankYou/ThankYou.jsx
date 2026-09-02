// src/components/ThankYou/ThankYou.jsx
import { Helmet } from "react-helmet-async";

const ThankYou = () => {
  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <Helmet>
        <title>Thank You | Immpression</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <h1>🎉 Thank You for Your Support!</h1>
      <p>Your donation helps us keep Immpression growing.</p>
      <a href="/" style={{ color: "#4781FF", fontWeight: "bold" }}>
        Back to Home
      </a>
    </div>
  );
};

export default ThankYou;
