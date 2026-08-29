// Reusable sanitation/normalization layer for public-domain artwork metadata
// displayed to users. Museum APIs (and Wikimedia Commons in particular) can
// return raw provider artifacts — Wikidata "QuickStatement" qualifiers,
// malformed ISO date fragments, embedded HTML, duplicated phrases, or plain
// JS junk like "undefined"/"[object Object]" — that must never reach the UI.
//
// Every function here returns either a clean, human-readable string or null.
// null means "no usable value" — callers should hide that field entirely
// rather than render a blank/placeholder.

const JSON_LOOKING_RE = /^\s*[{[][\s\S]*[}\]]\s*$/;
const WIKIDATA_ARTIFACT_RE = /\bQS:P?\d+\b|P\d+,\s*[+-]?\d{1,4}-\d{2}-\d{2}T[\d:]+Z\/\d+/i;
const LITERAL_JUNK = new Set(["undefined", "null", "nan", "[object object]", "n/a", "-", "—"]);

// Commons sometimes concatenates the same phrase twice in one field once
// hidden markup is removed (e.g. "Polish: Mona Lisa Mona Lisa"). Collapse an
// exact, case-insensitive whole-word-phrase repeated at the end of the
// string — "X Y Y" -> "X Y" — without touching normal prose.
function collapseTrailingDuplicate(s) {
  const words = s.split(" ");
  const maxPhraseLen = Math.floor(words.length / 2);
  for (let phraseLen = maxPhraseLen; phraseLen >= 1; phraseLen--) {
    const tail = words.slice(-phraseLen).join(" ").toLowerCase();
    const beforeTail = words.slice(-(phraseLen * 2), -phraseLen).join(" ").toLowerCase();
    if (tail && tail === beforeTail) {
      return words.slice(0, -phraseLen).join(" ");
    }
  }
  return s;
}

function stripHtmlAndEntities(s) {
  let out = s.replace(/<[^>]*>/g, " ");
  out = out
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
  return out;
}

/**
 * Generic reusable cleaner for any public-domain metadata field. Handles
 * non-string values, HTML, leaked Wikidata qualifiers, malformed date
 * fragments, JSON-looking strings, and literal "undefined"/"null" tokens.
 * Returns a clean trimmed string, or null if nothing usable survives.
 */
export function sanitizeText(value) {
  if (value === null || value === undefined) return null;
  // A raw object/array should never reach a display field — never render it
  // (that's exactly how "[object Object]" or dumped JSON leaks into the UI).
  if (typeof value === "object") return null;

  let s = String(value);
  if (JSON_LOOKING_RE.test(s)) return null;

  s = stripHtmlAndEntities(s);

  // Defense in depth: the backend already cleans Wikidata QuickStatement
  // artifacts at the source for Wikimedia, but strip them again here in case
  // of older cached data or any other source that leaks similar structured
  // qualifiers (e.g. "date QS:P571,+1503-00-00T00:00:00Z/8,..."). No leading
  // \b — some historical data has the keyword glued directly onto the
  // preceding word with no space (e.g. "1506date QS:P571,...").
  s = s.replace(/(?:date|title|label|creator|depicts)\s+QS:P?\d*(?:,[^\s<]+)*/gi, " ");
  s = s.replace(/\bQS:P?\d+(?:,[^\s<]+)*/gi, " ");

  s = s.replace(/\s+/g, " ").trim();
  if (!s) return null;
  if (LITERAL_JUNK.has(s.toLowerCase())) return null;
  if (WIKIDATA_ARTIFACT_RE.test(s)) return null;

  s = collapseTrailingDuplicate(s);
  return s || null;
}

/**
 * Date/year field cleanup. Adds light human-readable formatting on top of
 * sanitizeText — e.g. "between 1503 and 1506" -> "1503–1506".
 */
export function sanitizeYear(value) {
  const s = sanitizeText(value);
  if (!s) return null;
  const between = s.match(/^between\s+(\d{3,4})\s+and\s+(\d{3,4})$/i);
  if (between) return `${between[1]}–${between[2]}`;
  return s;
}

/**
 * Longer free-text fields (description, object summary). Same cleanup as
 * sanitizeText, then truncated at a sensible length on a word boundary so a
 * raw museum API description never dumps an enormous wall of text onto the page.
 */
export function sanitizeDescription(value, maxLen = 700) {
  const s = sanitizeText(value);
  if (!s) return null;
  if (s.length <= maxLen) return s;
  const cut = s.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : maxLen)}…`;
}

/** Returns a normalized absolute http(s) URL, or null if missing/invalid. */
export function sanitizeUrl(value) {
  if (!value || typeof value !== "string") return null;
  try {
    const u = new URL(value);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

/**
 * Builds the ordered list of {label, value} rows for the artwork DETAILS
 * section — only fields with a clean, non-empty value are included.
 */
export function buildDetailRows(artwork) {
  if (!artwork) return [];
  const rows = [
    ["Date", sanitizeYear(artwork.year)],
    ["Medium", sanitizeText(artwork.medium)],
    ["Dimensions", sanitizeText(artwork.dimensions)],
    ["Culture", sanitizeText(artwork.culture)],
    ["Period", sanitizeText(artwork.period)],
    ["Department", sanitizeText(artwork.department)],
    ["Classification", sanitizeText(artwork.classification)],
    ["Museum / Collection", sanitizeText(artwork.institution)],
    ["Credit Line", sanitizeText(artwork.creditLine)],
  ];
  return rows
    .filter(([, value]) => !!value)
    .map(([label, value]) => ({ label, value }));
}

/** Short secondary line for a compact artwork row (sidebar, cards, etc.). */
export function pickSecondaryDetail(artwork) {
  if (!artwork) return null;
  return (
    sanitizeText(artwork.institution) ||
    sanitizeYear(artwork.year) ||
    sanitizeText(artwork.department) ||
    sanitizeText(artwork.period) ||
    null
  );
}
