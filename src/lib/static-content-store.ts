import type { ContentCategory, ContentEntry } from "@/types";

/**
 * Module-level cache for static content fetched from public/data/*.json
 * Each category is fetched once and cached for the lifetime of the page.
 */
const cache = new Map<ContentCategory, ContentEntry[]>();
const inflight = new Map<ContentCategory, Promise<ContentEntry[]>>();

/**
 * Fetches static content for a category from public/data/{category}.json.
 * Results are cached in memory. Returns [] if the file doesn't exist.
 */
export async function fetchStaticCategory(category: ContentCategory): Promise<ContentEntry[]> {
  const cached = cache.get(category);
  if (cached) return cached;

  // Deduplicate concurrent requests
  const existing = inflight.get(category);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const res = await fetch(`/data/${category}.json`, { cache: "force-cache" });
      if (!res.ok) return [];
      const data = (await res.json()) as ContentEntry[];
      if (!Array.isArray(data)) return [];
      cache.set(category, data);
      return data;
    } catch {
      return [];
    } finally {
      inflight.delete(category);
    }
  })();

  inflight.set(category, promise);
  return promise;
}

/**
 * Clears the cache for a specific category or all categories.
 */
export function clearStaticCache(category?: ContentCategory) {
  if (category) {
    cache.delete(category);
  } else {
    cache.clear();
  }
}
