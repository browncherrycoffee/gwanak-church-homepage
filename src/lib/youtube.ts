/**
 * YouTube URL에서 video ID를 추출한다.
 * 지원 형식: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/live/ID
 */
export function extractVideoId(url: string): string {
  if (!url) return "";

  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch?.[1]) return shortMatch[1];

  // youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch?.[1]) return watchMatch[1];

  // youtube.com/embed/ID or youtube.com/live/ID
  const pathMatch = url.match(/youtube\.com\/(?:embed|live)\/([a-zA-Z0-9_-]{11})/);
  if (pathMatch?.[1]) return pathMatch[1];

  return "";
}

export function getEmbedUrl(videoId: string): string {
  if (!videoId) return "";
  return `https://www.youtube.com/embed/${videoId}`;
}

export function getThumbnailUrl(videoId: string): string {
  if (!videoId) return "";
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}
