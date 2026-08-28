import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { API_URL } from "../../API_URL";
import "./Invite.css";

export default function Invite() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | valid | invalid

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_URL}/api/invite/${code}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.success) {
          setStatus("invalid");
          return;
        }
        if (data.data.redirected) {
          navigate(`/invite/${data.data.code}`, { replace: true });
          return;
        }
        setStatus("valid");
      })
      .catch(() => { if (!cancelled) setStatus("invalid"); });

    return () => { cancelled = true; };
  }, [code, navigate]);

  return (
    <div className="invite-wrapper">
      <Helmet>
        <title>You're invited to Immpression</title>
        <meta name="description" content="You're invited to join Immpression." />
        <meta property="og:title" content="You're invited to Immpression" />
        <meta property="og:description" content="You're invited to join Immpression." />
      </Helmet>

      {status === "loading" && <p className="invite-status">Loading…</p>}

      {status === "invalid" && (
        <div className="invite-card">
          <h1>This invite link is no longer valid</h1>
          <button className="invite-cta" onClick={() => navigate("/")}>Go to Immpression</button>
        </div>
      )}

      {status === "valid" && (
        <div className="invite-card">
          <h1>You're invited to Immpression</h1>
          <p>Discover and collect original art from emerging artists.</p>
          <button className="invite-cta" onClick={() => navigate("/")}>Get Started</button>
        </div>
      )}
    </div>
  );
}
