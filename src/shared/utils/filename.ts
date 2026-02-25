const UNSAFE_CHARS_RE = /[<>:"/\\|?*\x00-\x1f]/g;
const MAX_NAME_LENGTH = 60;

export function safeFolderName(name: string): string {
  return (name || "unknown")
    .replace(UNSAFE_CHARS_RE, "_")
    .trim()
    .slice(0, MAX_NAME_LENGTH);
}

export function buildDownloadPath(
  basePath: string,
  author: string,
  videoId: string,
): string {
  return `${basePath}/${safeFolderName(author)}/tiktok_${videoId}.mp4`;
}

export function extractVideoId(url: string): string | null {
  return url.match(/\/video\/(\d+)/)?.[1] ?? null;
}
