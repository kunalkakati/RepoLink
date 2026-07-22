import { NextResponse } from "next/server";
import {
  buildMetadataFetchUrls,
  extractMetadataFromHtml,
} from "@/lib/metadata";

const METADATA_CACHE_TTL = 1000 * 60 * 30; // 30 minutes
const metadataCache = new Map<
  string,
  {
    createdAt: number;
    data: {
      title: string;
      description: string;
      domain: string;
      image?: string;
    };
  }
>();

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
    let html = "";
    let lastError: unknown;

    for (const candidateUrl of buildMetadataFetchUrls(targetUrl)) {
      try {
        const response = await fetch(candidateUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; Seedlink/1.0; +https://example.com)",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        html = await response.text();
        if (html) {
          break;
        }
      } catch (error) {
        lastError = error;
      }
    }

    if (!html) {
      throw lastError ?? new Error("No metadata HTML returned");
    }

    const data = extractMetadataFromHtml(html, targetUrl);
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
