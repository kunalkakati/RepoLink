import { NextResponse } from "next/server";

const METADATA_CACHE_TTL = 1000 * 60 * 30; // 30 minutes
const metadataCache = new Map<
  string,
  {
    createdAt: number;
    data: { title: string; description: string; domain: string };
  }
>();

const readTitle = (html: string) => {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match?.[1]?.trim() ?? "";
};

const readMeta = (html: string, name: string) => {
  const regex = new RegExp(
    `<meta\\s+(?:name|property)=[\"']${name}[\"'][^>]*content=[\"']([^\"']+)[\"']`,
    "i",
  );
  const match = html.match(regex);
  return match?.[1]?.trim() ?? "";
};

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get("url")?.trim();

  if (!url) {
    return NextResponse.json({ error: "Missing url query" }, { status: 400 });
  }

  let targetUrl: string;
  try {
    targetUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const cached = metadataCache.get(targetUrl);
  if (cached && Date.now() - cached.createdAt < METADATA_CACHE_TTL) {
    return NextResponse.json(cached.data, { status: 200 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Seedlink/1.0; +https://example.com)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to fetch metadata" },
        { status: 502 },
      );
    }

    const html = await response.text();
    const title = readMeta(html, "og:title") || readTitle(html);
    const description =
      readMeta(html, "og:description") || readMeta(html, "description") || "";
    const domain = new URL(targetUrl).hostname.replace(/^www\./, "");
    const data = { title, description, domain };
    metadataCache.set(targetUrl, { createdAt: Date.now(), data });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return NextResponse.json(
      { error: "Metadata fetch failed" },
      { status: 500 },
    );
  }
}
