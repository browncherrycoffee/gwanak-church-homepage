"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useContents } from "@/hooks/use-contents";
import { useStaticContents } from "@/hooks/use-static-contents";
import { ContentCard } from "./content-card";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import type { ContentCategory } from "@/types";

interface ContentListPageProps {
  category: ContentCategory;
  title: string;
  description: string;
}

export function ContentListPage(props: ContentListPageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">{props.title}</h1>
            <p className="mt-1 text-muted-foreground">{props.description}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`skel-${i}`} className="h-48 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      }
    >
      <ContentListPageInner {...props} />
    </Suspense>
  );
}

function ContentListPageInner({ category, title, description }: ContentListPageProps) {
  const localContents = useContents();
  const { data: staticContents, loading } = useStaticContents(category);
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const merged = useMemo(() => {
    // Combine static (from JSON) + local (from localStorage), dedupe by ID
    const idSet = new Set<string>();
    const all = [...localContents.filter((c) => c.category === category)];
    for (const entry of all) {
      idSet.add(entry.id);
    }
    for (const entry of staticContents) {
      if (!idSet.has(entry.id)) {
        all.push(entry);
        idSet.add(entry.id);
      }
    }
    // Sort by date descending
    all.sort((a, b) => b.date.localeCompare(a.date));
    return all;
  }, [localContents, staticContents, category]);

  const totalPages = Math.max(1, Math.ceil(merged.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
  const pageItems = merged.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-muted-foreground">{description}</p>
        {merged.length > 0 && (
          <p className="mt-1 text-xs text-muted-foreground/60">
            총 {merged.length}개
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`skel-${i}`}
              className="h-48 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      ) : merged.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p>등록된 콘텐츠가 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((entry) => (
              <ContentCard key={entry.id} entry={entry} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild={safePage > 1}
                disabled={safePage <= 1}
              >
                {safePage > 1 ? (
                  <Link href={`?page=${safePage - 1}`}>
                    <CaretLeft weight="bold" className="h-4 w-4" />
                  </Link>
                ) : (
                  <span>
                    <CaretLeft weight="bold" className="h-4 w-4" />
                  </span>
                )}
              </Button>
              <span className="px-3 text-sm text-muted-foreground">
                {safePage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                asChild={safePage < totalPages}
                disabled={safePage >= totalPages}
              >
                {safePage < totalPages ? (
                  <Link href={`?page=${safePage + 1}`}>
                    <CaretRight weight="bold" className="h-4 w-4" />
                  </Link>
                ) : (
                  <span>
                    <CaretRight weight="bold" className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
