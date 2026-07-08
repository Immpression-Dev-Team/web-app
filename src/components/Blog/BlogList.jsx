import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { API_URL } from "../../API_URL";
import "./BlogList.css";

function stripMarkdown(md = "") {
  return md.replace(/[#*_`\[\]>~]/g, "").replace(/\n+/g, " ").trim();
}

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/blog`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setPosts(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="blog-page">
      <Helmet>
        <title>Blog | Immpression</title>
        <meta name="description" content="Thoughts, stories, and insights from the Immpression team — the art search engine and marketplace." />
        <link rel="canonical" href="https://www.immpression.art/blog" />
        <meta property="og:title" content="Blog | Immpression" />
        <meta property="og:description" content="Thoughts, stories, and insights from the Immpression team." />
        <meta property="og:url" content="https://www.immpression.art/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Immpression" />
        <meta property="og:image" content="https://www.immpression.art/Immpression_BannerTemp.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <header className="blog-hero">
        <p className="blog-eyebrow">Journal</p>
        <h1 className="blog-title">Blog</h1>
        <p className="blog-subtitle">Thoughts, stories, and insights from the Immpression team.</p>
      </header>

      <div className="blog-inner">
        {loading ? (
          <div className="blog-loading">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="blog-empty">No posts yet — check back soon.</div>
        ) : (
          <div className="blog-grid">
            {posts.map((p) => (
              <Link key={p._id} to={`/blog/${p.slug}`} className="blog-card">
                <div className="blog-card-img-wrap">
                  <img src={p.coverImageUrl} alt={p.title} className="blog-card-img" loading="lazy" />
                </div>
                <div className="blog-card-body">
                  <span className="blog-card-date">
                    {new Date(p.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                  <p className="blog-card-title">{p.title}</p>
                  <p className="blog-card-excerpt">{stripMarkdown(p.body).slice(0, 140)}…</p>
                  <span className="blog-card-read">Read post →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
