"use client";

import { useEffect, useState } from "react";
import { fetchStaticCategory } from "@/lib/static-content-store";
import type { ContentCategory, ContentEntry } from "@/types";

/**
 * React hook to load static content for a category from public/data/*.json.
 * Pass slim=true to load the index file (no content field) — faster for list pages.
 * Returns { data, loading } where data is the array of entries.
 */
export function useStaticContents(category: ContentCategory, slim = false) {
  const [data, setData] = useState<ContentEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchStaticCategory(category, slim).then((entries) => {
      if (!cancelled) {
        setData(entries);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [category, slim]);

  return { data, loading };
}
