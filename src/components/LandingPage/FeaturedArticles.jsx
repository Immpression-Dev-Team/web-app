import { useEffect, useState } from "react";
import { API_URL } from "../../API_URL";
import "./FeaturedArticles.css";

export default function FeaturedArticles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/articles`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setArticles(data.data); })
      .catch(() => {});
  }, []);

  if (!articles.length) return null;

  return (
    <section className="fa-section">
      <div className="fa-inner">
        <div className="fa-heading">
          <p className="fa-eyebrow">Press &amp; Features</p>
          <h2 className="fa-h2">As Seen In</h2>
        </div>
        <div className="fa-grid">
          {articles.map((a) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}
