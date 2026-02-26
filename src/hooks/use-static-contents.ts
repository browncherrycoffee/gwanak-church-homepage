"use client";

import { useEffect, useState } from "react";
import { fetchStaticCategory } from "@/lib/static-content-store";
import type { ContentCategory, ContentEntry } from "@/types";

/**
 * React hook to load static content for a category from public/data/*.json.
 * Returns { data, loading } where data is the array of entries.
 */
export function useStaticContents(category: ContentCategory) {
  const [data, setData] = useState<ContentEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchStaticCategory(category).then((entries) => {
      if (!cancelled) {
        setData(entries);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [category]);

  return { data, loading };
}
