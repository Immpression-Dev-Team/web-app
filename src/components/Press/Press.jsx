import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { API_URL } from "../../API_URL";
import "./Press.css";

export default function Press() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/articles`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setArticles(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="press-page">
      <Helmet>
        <title>Press &amp; Media Coverage | Immpression</title>
        <meta name="description" content="Immpression in the press — read our featured articles, guest posts, and media coverage of the art search engine and marketplace." />
        <link rel="canonical" href="https://www.immpression.art/press" />
        <meta property="og:title" content="Press &amp; Media Coverage | Immpression" />
        <meta property="og:description" content="Read featured articles, guest posts, and media coverage of Immpression." />
        <meta property="og:url" content="https://www.immpression.art/press" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Immpression" />
        <meta property="og:image" content="https://www.immpression.art/Immpression_UI_1.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Press &amp; Media Coverage | Immpression" />
        <meta name="twitter:description" content="Read featured articles, guest posts, and media coverage of Immpression." />
        <meta name="twitter:image" content="https://www.immpression.art/Immpression_UI_1.png" />
      </Helmet>

      <header className="press-hero">
        <p className="press-eyebrow">Media &amp; Press</p>
        <h1 className="press-title">As Seen In</h1>
        <p className="press-subtitle">Features, guest posts, and coverage from around the web.</p>
      </header>

      <div className="press-inner">
        {loading ? (
          <div className="press-loading">Loading…</div>
        ) : articles.length === 0 ? (
          <div className="press-empty">No press coverage yet — check back soon.</div>
        ) : (
          <div className="press-grid">
            {articles.map((a) => (
              <a
                key={a._id}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="press-card"
              >
                <div className="press-card-img-wrap">
                  <img src={a.imageUrl} alt={a.title} className="press-card-img" loading="lazy" />
                </div>
                <div className="press-card-body">
                  {a.publication && <span className="press-card-pub">{a.publication}</span>}
                  <p className="press-card-title">{a.title}</p>
                  <span className="press-card-date">
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
        )}
      </div>
    </div>
  );
}
