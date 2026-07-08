import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../API_URL";
import "./FeaturedArticles.css";

function getStep(track) {
  const card = track.children[0];
  if (!card) return 0;
  return card.offsetWidth + 24;
}

function stripMarkdown(md = "") {
  return md.replace(/[#*_`\[\]>~]/g, "").replace(/\n+/g, " ").trim();
}

export default function FeaturedArticles() {
  const [articles, setArticles] = useState([]);
  const [posts, setPosts] = useState([]);
  const trackRef = useRef(null);
  const idxRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/api/articles`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setArticles(data.data); })
      .catch(() => {});

    fetch(`${API_URL}/api/blog`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setPosts(data.data); })
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

  if (!articles.length && !posts.length) return null;

  const isCarousel = articles.length > 3;

  const pressCards = articles.map((a) => (
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

        {/* ── Single top header ── */}
        <div className="fa-heading">
          <p className="fa-eyebrow">Immpression</p>
          <h2 className="fa-h2">Blog</h2>
        </div>

        {/* ── Blog posts (our own) ── */}
        {posts.length > 0 && (
          <div className="fa-blog-block">
            <div className={`fa-blog-grid fa-blog-grid--${Math.min(posts.length, 3)}`}>
              {posts.slice(0, 3).map((p, i) => (
                <Link
                  key={p._id}
                  to={`/blog/${p.slug}`}
                  className={`fa-blog-card ${i === 0 ? "fa-blog-card--featured" : ""}`}
                >
                  <div className="fa-blog-img-wrap">
                    <img src={p.coverImageUrl} alt={p.title} className="fa-blog-img" loading="lazy" />
                  </div>
                  <div className="fa-blog-body">
                    {p.publishedAt && (
                      <span className="fa-blog-date">
                        {new Date(p.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "long", day: "numeric",
                        })}
                      </span>
                    )}
                    <p className="fa-blog-title">{p.title}</p>
                    <p className="fa-blog-excerpt">{stripMarkdown(p.body).slice(0, i === 0 ? 200 : 100)}…</p>
                    <span className="fa-blog-read">Read post →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Press / guest posts ── */}
        {articles.length > 0 && (
          <div className={posts.length > 0 ? "fa-press-block" : ""}>
            {isCarousel ? (
              <div className="fa-carousel-wrap">
                <button className="fa-arrow fa-arrow-prev" onClick={handlePrev} aria-label="Previous">
                  <ArrowLeft />
                </button>
                <div className="fa-track" ref={trackRef}>{pressCards}</div>
                <button className="fa-arrow fa-arrow-next" onClick={handleNext} aria-label="Next">
                  <ArrowRight />
                </button>
              </div>
            ) : (
              <div className="fa-grid">{pressCards}</div>
            )}
          </div>
        )}

        {/* ── Single footer link ── */}
        {(posts.length > 0 || articles.length > 0) && (
          <div className="fa-footer">
            <Link to="/press" className="fa-view-all">View all posts →</Link>
          </div>
        )}

      </div>
    </section>
  );
}

function ArrowLeft() {
  return (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M42 27 C35 25.5 22 26.8 13 26" stroke="white" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M23 16 C18 19 13 23 12 26 C13 29 18 33 23 36" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M38 22 L40 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 27 C17 25.5 30 26.8 39 26" stroke="white" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M29 16 C34 19 39 23 40 26 C39 29 34 33 29 36" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M14 22 L12 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}
