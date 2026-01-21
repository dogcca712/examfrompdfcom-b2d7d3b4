import { API_BASE, getAccessToken } from "@/lib/api";

function appendCacheBuster(url: string) {
  const hasQuery = url.includes("?");
  return `${url}${hasQuery ? "&" : "?"}t=${Date.now()}`;
}

function resolveApiUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${API_BASE}${url}`;
  // Fallback: treat as relative API path
  return `${API_BASE}/${url}`;
}

function parseFilenameFromContentDisposition(header: string | null): string | null {
  if (!header) return null;

  // RFC 5987: filename*=UTF-8''...
  const utf8Match = header.match(/filename\*=(?:UTF-8'')?([^;]+)/i);
  if (utf8Match?.[1]) {
    const raw = utf8Match[1].trim().replace(/^"|"$/g, "");
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }

  const simpleMatch = header.match(/filename=([^;]+)/i);
  if (simpleMatch?.[1]) {
    return simpleMatch[1].trim().replace(/^"|"$/g, "");
  }

  return null;
}

export async function downloadPdfWithAuth(url: string, fallbackFileName: string) {
  const token = getAccessToken();
  const resolvedUrl = appendCacheBuster(resolveApiUrl(url));
  
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(resolvedUrl, { headers });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `下载失败（${response.status}）`);
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const fileName =
    parseFilenameFromContentDisposition(response.headers.get("content-disposition")) ||
    fallbackFileName;

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}
