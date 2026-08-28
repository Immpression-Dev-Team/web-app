// Vercel Edge Middleware.
//
// This is a static Vite SPA with no SSR: social crawlers (Discord, iMessage,
// Facebook, etc.) request the raw HTML and never execute the client-side
// react-helmet-async tags, so they only ever see index.html's generic
// fallback metadata. For /invite/:code specifically we need crawler-visible,
// invite-specific Open Graph tags in the *raw* response — so this middleware
// intercepts those requests, fetches the built index.html, and swaps in
// invite metadata before the response is sent.
//
// The content here is intentionally the same for every code: referral
// name/internalLabel must never appear in public metadata.

export const config = {
  matcher: "/invite/:code",
};

const TITLE = "You're Invited to Immpression";
const DESCRIPTION = "Discover artists, collect original art, and join the Immpression community.";
const IMAGE = "https://www.immpression.art/Immpression_Invite_Banner.png";

export default async function middleware(request) {
  try {
    const requestUrl = request.url;
    const origin = new URL(requestUrl).origin;

    const res = await fetch(`${origin}/index.html`);
    const html = (await res.text())
      .replace(/<title>.*?<\/title>/, `<title>${TITLE}</title>`)
      .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${DESCRIPTION}" />`)
      .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${TITLE}" />`)
      .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${DESCRIPTION}" />`)
      .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${IMAGE}" />`)
      .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${requestUrl}" />`)
      .replace(
        "</head>",
        `  <meta name="twitter:title" content="${TITLE}" />\n` +
          `  <meta name="twitter:description" content="${DESCRIPTION}" />\n` +
          `  <meta name="twitter:image" content="${IMAGE}" />\n` +
          "</head>"
      );

    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("invite middleware error:", err);
    // Fall through to normal SPA routing rather than breaking the page.
    return undefined;
  }
}
