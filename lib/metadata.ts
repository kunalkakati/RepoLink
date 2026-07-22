export const METADATA_PROXY_BASE_URL = "https://r.jina.ai/http://";

export const readTitle = (html: string) => {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match?.[1]?.trim() ?? "";
};

export const normalizeUrl = (value: string, baseUrl: string) => {
  if (!value) return undefined;
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return undefined;
  }
};

export const readMeta = (html: string, name: string) => {
  const regex = new RegExp(
    `<meta\\s+(?:name|property)=["']${name}["'][^>]*content=["']([^"']+)["']`,
    "i",
  );
  const match = html.match(regex);
  return match?.[1]?.trim() ?? "";
};

export const buildMetadataFetchUrls = (targetUrl: string) => {
  const withoutScheme = targetUrl.replace(/^https?:\/\//i, "");
  return [targetUrl, `${METADATA_PROXY_BASE_URL}${withoutScheme}`];
};

export const extractMetadataFromHtml = (html: string, targetUrl: string) => {
  const title = readMeta(html, "og:title") || readTitle(html);
  const description =
    readMeta(html, "og:description") || readMeta(html, "description") || "";
  const image = normalizeUrl(
    readMeta(html, "og:image") || readMeta(html, "twitter:image"),
    targetUrl,
  );
  const domain = new URL(targetUrl).hostname.replace(/^www\./, "");

  return { title, description, domain, image };
};
