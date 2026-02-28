import type { ContentCategory, ContentEntry } from "@/types";

/**
 * Module-level cache for static content fetched from public/data/*.json
 * Each category is fetched once and cached for the lifetime of the page.
 */
const cache = new Map<string, ContentEntry[]>();
const inflight = new Map<string, Promise<ContentEntry[]>>();

/**
 * Fetches static content for a category from public/data/{category}.json.
 * Pass slim=true to load the index file (no content field) for list pages.
 * Results are cached in memory. Returns [] if the file doesn't exist.
 */
export async function fetchStaticCategory(
  category: ContentCategory,
  slim = false,
): Promise<ContentEntry[]> {
  const key = slim ? `${category}-index` : category;
  const cached = cache.get(key);
  if (cached) return cached;

  const existing = inflight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const filename = slim ? `${category}-index.json` : `${category}.json`;
      const res = await fetch(`/data/${filename}`, { cache: "force-cache" });
      if (!res.ok) return [];
      const data = (await res.json()) as ContentEntry[];
      if (!Array.isArray(data)) return [];
      cache.set(key, data);
      return data;
    } catch {
      return [];
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
}

/**
 * Clears the cache for a specific category or all categories.
 */
export function clearStaticCache(category?: ContentCategory) {
  if (category) {
    cache.delete(category);
    cache.delete(`${category}-index`);
  } else {
    cache.clear();
  }
}
