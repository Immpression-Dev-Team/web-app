import { useEffect, useState } from "react";
import { API_URL } from "../../../API_URL";

const MEDIUMS = [
  "paintings",
  "photography",
  "graphic design",
  "illustrations",
  "sculptures",
  "woodwork",
  "graffiti",
  "stencil",
];

const formatLabel = (m) => m.charAt(0).toUpperCase() + m.slice(1);

export default function MediumList({ category, setCategory }) {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      MEDIUMS.map((m) =>
        fetch(`${API_URL}/marketplace?category=${encodeURIComponent(m)}&limit=1`)
          .then((r) => r.json())
          .then((data) => [m, data.success ? data.totalImages : null])
          .catch(() => [m, null])
      )
    ).then((entries) => {
      if (!cancelled) setCounts(Object.fromEntries(entries));
    });

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="mp-left-section">
      <h3 className="mp-left-title">Browse by Medium</h3>
      <ul className="mp-medium-list">
        {MEDIUMS.map((m) => {
          const isActive = category === m;
          const count = counts[m];
          return (
            <li key={m}>
              <button
                type="button"
                className={`mp-medium-item${isActive ? " active" : ""}`}
                onClick={() => setCategory(isActive ? "All" : m)}
              >
                <span className="mp-medium-label">{formatLabel(m)}</span>
                <span className="mp-medium-count">{count != null ? count : ""}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
