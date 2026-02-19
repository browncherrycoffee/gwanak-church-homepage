"use client";

import { useMemo } from "react";
import { useContents } from "@/hooks/use-contents";
import { ContentCard } from "./content-card";
import type { ContentCategory } from "@/types";

interface ContentListPageProps {
  category: ContentCategory;
  title: string;
  description: string;
}

export function ContentListPage({ category, title, description }: ContentListPageProps) {
  const allContents = useContents();

  const filtered = useMemo(
    () =>
      allContents
        .filter((c) => c.category === category)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [allContents, category],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p>등록된 콘텐츠가 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => (
            <ContentCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
