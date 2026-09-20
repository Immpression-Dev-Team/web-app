import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../../API_URL";

export default function RailBlogSection() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/blog`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setPosts(data.data.slice(0, 3)); })
      .catch(() => {});
  }, []);

  if (!posts.length) return null;

  return (
    <div className="mp-rail-section">
      <div className="mp-rail-section-head">
        <h3 className="mp-rail-title">From Immpression</h3>
        <Link to="/blog" className="mp-rail-link">View all</Link>
      </div>
      <ul className="mp-blog-rail-list">
        {posts.map((p) => (
          <li key={p._id}>
            <Link to={`/blog/${p.slug}`} className="mp-blog-rail-item">
              <div className="mp-blog-rail-img-wrap">
                <img src={p.coverImageUrl} alt={p.title} loading="lazy" />
              </div>
              <div className="mp-blog-rail-body">
                <span className="mp-blog-rail-label">Blog Post</span>
                <p className="mp-blog-rail-headline">{p.title}</p>
                {p.publishedAt && (
                  <span className="mp-blog-rail-date">
                    {new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
