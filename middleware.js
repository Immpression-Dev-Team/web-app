// Vercel Edge Middleware.
//
// This is a static Vite SPA with no SSR: social crawlers (Discord, iMessage,
// Facebook, etc.) request the raw HTML and never execute the client-side
// react-helmet-async tags, so they only ever see index.html's generic
// fallback metadata. This middleware intercepts crawler-relevant routes,
// fetches the built index.html, and swaps in route-specific Open Graph tags
// before the response is sent.

export const config = {
  matcher: ["/invite/:code", "/blog/:slug"],
};

const BACKEND_URL = "https://immpression-backend.vercel.app";
const FALLBACK_IMAGE = "https://www.immpression.art/Immpression_BannerTemp.png";

// The content here is intentionally the same for every invite code: referral
// name/internalLabel must never appear in public metadata.
const INVITE_TITLE = "You're Invited to Immpression";
const INVITE_DESCRIPTION = "Discover artists, collect original art, and join the Immpression community.";
const INVITE_IMAGE = "https://www.immpression.art/Immpression_Invite_Banner.png";

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripMarkdown(md = "") {
  return md.replace(/[#*_`\[\]>~]/g, "").replace(/\n+/g, " ").trim();
}

function injectMeta(html, { title, description, image, url, type = "website" }) {
  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${type}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(
      "</head>",
      `  <meta name="twitter:title" content="${title}" />\n` +
        `  <meta name="twitter:description" content="${description}" />\n` +
        `  <meta name="twitter:image" content="${image}" />\n` +
        "</head>"
    );
}

export default async function middleware(request) {
  try {
    const requestUrl = request.url;
    const { origin, pathname } = new URL(requestUrl);

    const res = await fetch(`${origin}/index.html`);
    let html = await res.text();

    if (pathname.startsWith("/blog/")) {
      const slug = pathname.split("/")[2];
      const apiRes = await fetch(`${BACKEND_URL}/api/blog/${slug}`);
      const { success, data: post } = await apiRes.json();

      // No matching post: fall through so the SPA renders its normal
      // "not found" state instead of us serving fabricated metadata.
      if (!success || !post) return undefined;

      const title = escapeHtml(`${post.title} | Immpression Blog`);
      const description = escapeHtml(stripMarkdown(post.body || "").slice(0, 155));
      const image = escapeHtml(post.coverImageUrl || FALLBACK_IMAGE);

      html = injectMeta(html, { title, description, image, url: requestUrl, type: "article" });
    } else {
      html = injectMeta(html, {
        title: INVITE_TITLE,
        description: INVITE_DESCRIPTION,
        image: INVITE_IMAGE,
        url: requestUrl,
      });
    }

    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("meta middleware error:", err);
    // Fall through to normal SPA routing rather than breaking the page.
    return undefined;
  }
}
