import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { API_URL } from "../../API_URL";
import "./BlogPost.css";

function stripMarkdown(md = "") {
  return md.replace(/[#*_`\[\]>~]/g, "").replace(/\n+/g, " ").trim();
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/blog/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPost(data.data);
        else setError("Post not found.");
      })
      .catch(() => setError("Could not load this post."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="bp-wrapper">
        <div className="bp-loading"><div className="bp-spinner" /><p>Loading…</p></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bp-wrapper">
        <div className="bp-error">
          <p>{error || "Post not found."}</p>
          <button className="bp-back-btn" onClick={() => navigate("/blog")}>Back to Blog</button>
        </div>
      </div>
    );
  }

  const excerpt = stripMarkdown(post.body).slice(0, 155);
  const pageUrl = `https://www.immpression.art/blog/${post.slug}`;

  return (
    <div className="bp-wrapper">
      <Helmet>
        <title>{post.title} | Immpression Blog</title>
        <meta name="description" content={excerpt} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:image" content={post.coverImageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Immpression" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={excerpt} />
        <meta name="twitter:image" content={post.coverImageUrl} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bp-breadcrumb">
        <Link to="/blog" className="bp-back-link">← Blog</Link>
        <span className="bp-breadcrumb-sep">/</span>
        <span className="bp-breadcrumb-title">{post.title}</span>
      </div>

      {/* Hero image */}
      <div className="bp-hero-wrap">
        <img src={post.coverImageUrl} alt={post.title} className="bp-hero-img" />
      </div>

      {/* Article */}
      <article className="bp-article">
        <header className="bp-article-header">
          {post.publishedAt && (
            <time className="bp-date">
              {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          )}
          <h1 className="bp-title">{post.title}</h1>
        </header>

        <div className="bp-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.body}
          </ReactMarkdown>
        </div>

        <footer className="bp-footer">
          <Link to="/blog" className="bp-footer-link">← Back to Blog</Link>
        </footer>
      </article>
    </div>
  );
}
