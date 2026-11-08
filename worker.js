/**
 * Cloudflare Worker: NYT Spelling Bee puzzle-data proxy
 *
 * Deploy this file as a Worker, then point index.html's PUZZLE_API_BASE
 * constant at the Worker URL.
 */
const ALLOWED_ORIGIN = "https://cmdrnudnik.github.io";
const NYT_API = "https://www.nytimes.com/svc/spelling-bee/v1/";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Accept",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "GET") {
      return json({ error: "Method not allowed. Use GET." }, 405, origin);
    }
    if (origin && origin !== ALLOWED_ORIGIN) {
      return json({ error: "Origin not allowed." }, 403, origin);
    }

    const date = url.searchParams.get("date") || "";
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(date)) {
      return json({ error: "Provide date as YYYY-MM-DD." }, 400, origin);
    }
    const parsed = new Date(date + "T00:00:00Z");
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
      return json({ error: "Invalid calendar date." }, 400, origin);
    }

    try {
      const upstream = await fetch(NYT_API + date + ".json", {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; BeeBadgeGenerator/1.0)"
        },
        cf: { cacheTtl: 300, cacheEverything: true }
      });
      if (!upstream.ok) {
        return json(
          { error: "NYT puzzle lookup failed.", upstreamStatus: upstream.status },
          upstream.status === 404 ? 404 : 502,
          origin
        );
      }
      const payload = await upstream.json();
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: {
          ...corsHeaders(origin),
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=300"
        }
      });
    } catch (error) {
      return json({ error: "Could not retrieve puzzle data from NYT." }, 502, origin);
    }
  }
};
