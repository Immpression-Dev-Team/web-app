import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../API_URL";
import "./FeaturedArticles.css";

function getStep(track) {
  const card = track.children[0];
  if (!card) return 0;
  return card.offsetWidth + 24;
}

export default function FeaturedArticles() {
  const [articles, setArticles] = useState([]);
  const trackRef = useRef(null);
  const idxRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/api/articles`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setArticles(data.data); })
      .catch(() => {});
  }, []);

  const scrollTo = useCallback((nextIdx) => {
    const track = trackRef.current;
    if (!track) return;
    const step = getStep(track);
    const maxScroll = track.scrollWidth - track.clientWidth;
    const pos = nextIdx * step;
    if (pos > maxScroll) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      idxRef.current = 0;
    } else {
      track.scrollTo({ left: pos, behavior: "smooth" });
      idxRef.current = nextIdx;
    }
  }, []);

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      scrollTo(idxRef.current + 1);
    }, 3500);
  }, [scrollTo]);

  useEffect(() => {
    if (articles.length <= 3) return;
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [articles.length, startInterval]);

  const handlePrev = () => {
    const track = trackRef.current;
    if (!track) return;
    const step = getStep(track);
    const maxScroll = track.scrollWidth - track.clientWidth;
    const maxIdx = Math.round(maxScroll / step);
    const next = idxRef.current <= 0 ? maxIdx : idxRef.current - 1;
    scrollTo(next);
    startInterval();
  };

  const handleNext = () => {
    scrollTo(idxRef.current + 1);
    startInterval();
  };

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
          <div className="fa-carousel-wrap">
            <button className="fa-arrow fa-arrow-prev" onClick={handlePrev} aria-label="Previous">
              <ArrowLeft />
            </button>
            <div className="fa-track" ref={trackRef}>{cards}</div>
            <button className="fa-arrow fa-arrow-next" onClick={handleNext} aria-label="Next">
              <ArrowRight />
            </button>
          </div>
        ) : (
          <div className="fa-grid">{cards}</div>
        )}
        <div className="fa-footer">
          <Link to="/press" className="fa-view-all">View all press →</Link>
        </div>
      </div>
    </section>
  );
}

function ArrowLeft() {
  return (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* shaft */}
      <path d="M42 27 C35 25.5 22 26.8 13 26" stroke="white" strokeWidth="4.5" strokeLinecap="round"/>
      {/* head */}
      <path d="M23 16 C18 19 13 23 12 26 C13 29 18 33 23 36" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* little scratch tick for street feel */}
      <path d="M38 22 L40 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* shaft */}
      <path d="M10 27 C17 25.5 30 26.8 39 26" stroke="white" strokeWidth="4.5" strokeLinecap="round"/>
      {/* head */}
      <path d="M29 16 C34 19 39 23 40 26 C39 29 34 33 29 36" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* little scratch tick */}
      <path d="M14 22 L12 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}
