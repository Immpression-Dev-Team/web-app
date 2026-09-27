import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { API_URL } from "../../API_URL";
import BlogMarketplaceRail from "./BlogMarketplaceRail.jsx";
import "./BlogPost.css";

function stripMarkdown(md = "") {
  return md.replace(/[#*_`\[\]>~]/g, "").replace(/\n+/g, " ").trim();
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [otherPosts, setOtherPosts] = useState([]);
  const [marketplaceItems, setMarketplaceItems] = useState([]);
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

  useEffect(() => {
    fetch(`${API_URL}/api/blog`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) return;
        const sorted = [...data.data].sort(
          (a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
        );
        setOtherPosts(sorted.filter((p) => p.slug !== slug).slice(0, 3));
      })
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    const params = new URLSearchParams({ page: 1, limit: 6, sort: "newest" });
    fetch(`${API_URL}/marketplace?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) return;
        setMarketplaceItems(data.images.filter((img) => !img.isSold).slice(0, 2));
      })
      .catch(() => {});
  }, []);

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
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": excerpt,
          ...(post.coverImageUrl && { "image": post.coverImageUrl }),
          "url": pageUrl,
          ...((post.publishedAt || post.createdAt) && { "datePublished": post.publishedAt || post.createdAt }),
          "author": { "@type": "Organization", "name": "Immpression" },
          "publisher": { "@id": "https://www.immpression.art/#organization" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Immpression", "item": "https://www.immpression.art" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.immpression.art/blog" },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": pageUrl },
          ],
        })}</script>
      </Helmet>

      {/* Breadcrumb */}
      <div className="bp-breadcrumb">
        <Link to="/blog" className="bp-back-link">← Blog</Link>
        <span className="bp-breadcrumb-sep">/</span>
        <span className="bp-breadcrumb-title">{post.title}</span>
      </div>

      <div className="bp-layout">
        {/* Marketplace discovery rail (far left, desktop-only, wide viewports) */}
        <BlogMarketplaceRail artworks={marketplaceItems} className="bp-marketplace-rail-desktop" />

        {/* Article (left column) */}
        <article className="bp-main">
          <div className="bp-hero-wrap">
            <img src={post.coverImageUrl} alt={post.title} className="bp-hero-img" />
          </div>

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

          {/* Compact fallback: same rail, shown between the article and the
              "More From Immpression" sidebar on narrower/mobile viewports. */}
          <BlogMarketplaceRail artworks={marketplaceItems} className="bp-marketplace-mobile" />
        </article>

        {/* More from Immpression (right column) */}
        {otherPosts.length > 0 && (
          <aside className="bp-sidebar">
            <h2 className="bp-sidebar-heading">More From Immpression</h2>
            <div className="bp-sidebar-list">
              {otherPosts.map((p) => (
                <Link key={p._id} to={`/blog/${p.slug}`} className="bp-sidebar-card">
                  <div className="bp-sidebar-img-wrap">
                    <img src={p.coverImageUrl} alt={p.title} className="bp-sidebar-img" loading="lazy" />
                  </div>
                  <div className="bp-sidebar-body">
                    {p.publishedAt && (
                      <span className="bp-sidebar-date">
                        {new Date(p.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                    )}
                    <p className="bp-sidebar-title">{p.title}</p>
                    <span className="bp-sidebar-read">Read post →</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/blog" className="bp-sidebar-viewall">View all posts →</Link>
          </aside>
        )}
      </div>
    </div>
  );
}
