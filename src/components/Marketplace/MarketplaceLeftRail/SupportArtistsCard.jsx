import { Link } from "react-router-dom";

export default function SupportArtistsCard() {
  return (
    <div className="mp-left-section mp-support-cta">
      <h3 className="mp-support-title">Support Independent Artists</h3>
      <p className="mp-support-copy">Discover original work. Own something real.</p>
      <Link to="/explore" className="mp-support-btn">Explore Art</Link>
    </div>
  );
}
