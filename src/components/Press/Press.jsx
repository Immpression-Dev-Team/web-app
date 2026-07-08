import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { API_URL } from "../../API_URL";
import "./Press.css";

function stripMarkdown(md = "") {
  return md.replace(/[#*_`\[\]>~]/g, "").replace(/\n+/g, " ").trim();
}

export default function Press() {
  const [articles, setArticles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/articles`).then((r) => r.json()).catch(() => ({ success: false })),
      fetch(`${API_URL}/api/blog`).then((r) => r.json()).catch(() => ({ success: false })),
    ]).then(([artData, blogData]) => {
      if (artData.success) setArticles(artData.data);
      if (blogData.success) setPosts(blogData.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="press-page">
      <Helmet>
        <title>Blog &amp; Press | Immpression</title>
        <meta name="description" content="Immpression blog posts, press coverage, and guest features — the art search engine and marketplace." />
        <link rel="canonical" href="https://www.immpression.art/press" />
        <meta property="og:title" content="Blog &amp; Press | Immpression" />
        <meta property="og:description" content="Blog posts, press coverage, and guest features from Immpression." />
        <meta property="og:url" content="https://www.immpression.art/press" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Immpression" />
        <meta property="og:image" content="https://www.immpression.art/Immpression_BannerTemp.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <header className="press-hero">
        <p className="press-eyebrow">Immpression</p>
        <h1 className="press-title">Blog &amp; Press</h1>
        <p className="press-subtitle">Our posts, features, and coverage from around the web.</p>
      </header>

      <div className="press-inner">
        {loading ? (
          <div className="press-loading">Loading…</div>
        ) : (
          <>
            {/* ── Our blog posts ── */}
            {posts.length > 0 && (
              <section className="press-section">
                <div className="press-section-label">
                  <span className="press-label-pill press-label-ours">From Us</span>
                  <span className="press-label-text">Written by Immpression</span>
                </div>
                <div className="press-grid">
                  {posts.map((p) => (
                    <Link key={p._id} to={`/blog/${p.slug}`} className="press-card press-card--blog">
                      <div className="press-card-img-wrap">
                        <img src={p.coverImageUrl} alt={p.title} className="press-card-img" loading="lazy" />
                      </div>
                      <div className="press-card-body">
                        <span className="press-card-type">Blog Post</span>
                        <p className="press-card-title">{p.title}</p>
                        <p className="press-card-excerpt">{stripMarkdown(p.body).slice(0, 110)}…</p>
                        {p.publishedAt && (
                          <span className="press-card-date">
                            {new Date(p.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── Guest posts / press ── */}
            {articles.length > 0 && (
              <section className={`press-section ${posts.length > 0 ? "press-section--divided" : ""}`}>
                <div className="press-section-label">
                  <span className="press-label-pill press-label-guest">Guest Posts</span>
                  <span className="press-label-text">Features &amp; coverage from around the web</span>
                </div>
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
                          {new Date(a.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {posts.length === 0 && articles.length === 0 && (
              <div className="press-empty">Nothing here yet — check back soon.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
