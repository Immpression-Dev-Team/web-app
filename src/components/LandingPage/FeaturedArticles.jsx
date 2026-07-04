import { useEffect, useState, useRef } from "react";
import { API_URL } from "../../API_URL";
import "./FeaturedArticles.css";

export default function FeaturedArticles() {
  const [articles, setArticles] = useState([]);
  const trackRef = useRef(null);
  const idxRef = useRef(0);

  useEffect(() => {
    fetch(`${API_URL}/api/articles`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setArticles(data.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (articles.length <= 3) return;
    const iv = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.children[0];
      if (!card) return;
      const step = card.offsetWidth + 24;
      const maxScroll = track.scrollWidth - track.clientWidth;
      const nextPos = (idxRef.current + 1) * step;
      if (nextPos > maxScroll) {
        track.scrollTo({ left: 0, behavior: "smooth" });
        idxRef.current = 0;
      } else {
        track.scrollTo({ left: nextPos, behavior: "smooth" });
        idxRef.current += 1;
      }
    }, 3500);
    return () => clearInterval(iv);
  }, [articles.length]);

  if (!articles.length) return null;

  const isCarousel = articles.length > 3;

  const cards = articles.map((a) => (
    <a
      key={a._id}
      href={a.url}
      target="_blank"
      rel="noopener noreferrer"
      className="fa-card"
    >
      <div className="fa-card-img-wrap">
        <img src={a.imageUrl} alt={a.title} className="fa-card-img" loading="lazy" />
      </div>
      <div className="fa-card-body">
        {a.publication && <span className="fa-card-pub">{a.publication}</span>}
        <p className="fa-card-title">{a.title}</p>
        <span className="fa-card-date">
          {new Date(a.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </a>
  ));

  return (
    <section className="fa-section">
      <div className="fa-inner">
        <div className="fa-heading">
          <p className="fa-eyebrow">Press &amp; Features</p>
          <h2 className="fa-h2">As Seen In</h2>
        </div>
        {isCarousel ? (
          <div className="fa-track" ref={trackRef}>{cards}</div>
        ) : (
          <div className="fa-grid">{cards}</div>
        )}
      </div>
    </section>
  );
}
