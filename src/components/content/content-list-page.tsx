"use client";

import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { CaretLeft, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useContents } from "@/hooks/use-contents";
import { useStaticContents } from "@/hooks/use-static-contents";
import { ContentCard } from "./content-card";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const { data: staticContents, loading } = useStaticContents(category, true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlQuery = searchParams.get("q") ?? "";
  const urlYear = searchParams.get("year") ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  // Local state for search input (for responsive feel)
  const [query, setQuery] = useState(urlQuery);

  // Refs to avoid stale closures in debounce
  const pathnameRef = useRef(pathname);
  const searchParamsRef = useRef(searchParams);
  const routerRef = useRef(router);
  useEffect(() => {
    pathnameRef.current = pathname;
    searchParamsRef.current = searchParams;
    routerRef.current = router;
  });

  // Sync local input if URL changes externally
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // Debounce URL update when typing in search box
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      params.delete("page");
      routerRef.current.replace(`${pathnameRef.current}?${params.toString()}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Merge local (localStorage) + static (JSON), dedupe by ID, sort by date desc
  const merged = useMemo(() => {
    const idSet = new Set<string>();
    const all = [...localContents.filter((c) => c.category === category)];
    for (const entry of all) idSet.add(entry.id);
    for (const entry of staticContents) {
      if (!idSet.has(entry.id)) {
        all.push(entry);
        idSet.add(entry.id);
      }
    }
    all.sort((a, b) => b.date.localeCompare(a.date));
    return all;
  }, [localContents, staticContents, category]);

  // Extract available years from data
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    for (const entry of merged) {
      const y = entry.date.slice(0, 4);
      if (y) years.add(y);
    }
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [merged]);

  // Filter by year + search query
  const filtered = useMemo(() => {
    let result = merged;
    if (urlYear) {
      result = result.filter((e) => e.date.startsWith(urlYear));
    }
    if (urlQuery) {
      const q = urlQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.scriptureReference ?? "").toLowerCase().includes(q) ||
          (e.preacher ?? "").toLowerCase().includes(q),
      );
    }
    return result;
  }, [merged, urlQuery, urlYear]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Build URL preserving current filters, changing only page
  function buildPageUrl(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (p === 1) {
      params.delete("page");
    } else {
      params.set("page", String(p));
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  // Year change
  function handleYearChange(year: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (year) {
      params.set("year", year);
    } else {
      params.delete("year");
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  // Clear search
  function clearSearch() {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  const isFiltered = urlQuery !== "" || urlYear !== "";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>

      {/* Search + Year Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <MagnifyingGlass
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            weight="bold"
          />
          <Input
            type="search"
            placeholder="제목, 성경구절 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="검색 초기화"
            >
              <X weight="bold" className="h-4 w-4" />
            </button>
          )}
        </div>

        {availableYears.length > 1 && (
          <select
            value={urlYear}
            onChange={(e) => handleYearChange(e.target.value)}
            className="border-input bg-background text-foreground h-11 rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          >
            <option value="">전체 연도</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Result count */}
      {!loading && (
        <p className="mb-4 text-xs text-muted-foreground/70">
          {isFiltered ? (
            <>
              <span className="font-medium text-foreground">{filtered.length}</span>개 검색됨
              {" "}(전체 {merged.length}개)
              {" · "}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  router.push(pathname);
                }}
                className="underline hover:no-underline"
              >
                필터 초기화
              </button>
            </>
          ) : (
            <>총 <span className="font-medium">{merged.length}</span>개</>
          )}
        </p>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`skel-${i}`} className="h-48 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          {isFiltered ? (
            <>
              <p>검색 결과가 없습니다.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  router.push(pathname);
                }}
                className="mt-2 text-sm underline hover:no-underline"
              >
                전체 보기
              </button>
            </>
          ) : (
            <p>등록된 콘텐츠가 없습니다.</p>
          )}
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
                size="default"
                asChild={safePage > 1}
                disabled={safePage <= 1}
              >
                {safePage > 1 ? (
                  <Link href={buildPageUrl(safePage - 1)}>
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
                size="default"
                asChild={safePage < totalPages}
                disabled={safePage >= totalPages}
              >
                {safePage < totalPages ? (
                  <Link href={buildPageUrl(safePage + 1)}>
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
