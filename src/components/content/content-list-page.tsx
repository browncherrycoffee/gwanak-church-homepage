"use client";

import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  X,
  Church,
  SunHorizon,
  Flame,
  BookOpenText,
  MusicNotes,
  Newspaper,
  Bell,
} from "@phosphor-icons/react";
import { useContents } from "@/hooks/use-contents";
import { useStaticContents } from "@/hooks/use-static-contents";
import { ContentCard } from "./content-card";
import { ITEMS_PER_PAGE, CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import type { ContentCategory } from "@/types";
import type { Icon } from "@phosphor-icons/react";

const CATEGORY_ICONS: Record<ContentCategory, Icon> = {
  "sunday-sermon": Church,
  "dawn-prayer": SunHorizon,
  "friday-prayer": Flame,
  catechism: BookOpenText,
  "psalm-song": MusicNotes,
  bulletin: Newspaper,
  notices: Bell,
};

const CATEGORY_PREV_LABELS: Record<ContentCategory, string> = {
  "sunday-sermon": "이전 주일설교",
  "dawn-prayer": "이전 새벽기도",
  "friday-prayer": "이전 금요기도회",
  catechism: "이전 교리문답",
  "psalm-song": "이전 시편찬송",
  bulletin: "이전 주보",
  notices: "이전 소식",
};

function paginationRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const delta = 2;
  const left = current - delta;
  const right = current + delta;
  const pages: (number | "...")[] = [1];
  if (left > 2) pages.push("...");
  for (let i = Math.max(2, left); i <= Math.min(total - 1, right); i++) pages.push(i);
  if (right < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}

interface ContentListPageProps {
  category: ContentCategory;
  title: string;
  description: string;
  featuredFirst?: boolean;
  columns?: 2 | 3;
}

export function ContentListPage(props: ContentListPageProps) {
  const CategoryIcon = CATEGORY_ICONS[props.category];

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Header skeleton */}
          <div className="mb-8 flex items-center gap-3">
            <div className="h-11 w-11 animate-pulse rounded-xl bg-muted" />
            <div>
              <div className="h-7 w-32 animate-pulse rounded bg-muted mb-1" />
              <div className="h-4 w-56 animate-pulse rounded bg-muted" />
            </div>
          </div>
          {["notices", "bulletin"].includes(props.category) ? (
            <div className="divide-y rounded-xl border overflow-hidden">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`skel-${i}`} className="flex items-center justify-between px-4 py-4">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-6 sm:grid-cols-2 ${props.columns !== 2 ? "lg:grid-cols-3" : ""}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`skel-${i}`} className="h-56 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          )}
        </div>
      }
    >
      <ContentListPageInner {...props} CategoryIcon={CategoryIcon} />
    </Suspense>
  );
}

function ContentListPageInner({
  category,
  title,
  description,
  featuredFirst = false,
  columns = 3,
  CategoryIcon,
}: ContentListPageProps & { CategoryIcon: Icon }) {
  const localContents = useContents();
  const { data: staticContents, loading } = useStaticContents(category, true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlQuery = searchParams.get("q") ?? "";
  const urlYear = searchParams.get("year") ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [query, setQuery] = useState(urlQuery);

  const pathnameRef = useRef(pathname);
  const searchParamsRef = useRef(searchParams);
  const routerRef = useRef(router);
  useEffect(() => {
    pathnameRef.current = pathname;
    searchParamsRef.current = searchParams;
    routerRef.current = router;
  });

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

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

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    for (const entry of merged) {
      const y = entry.date.slice(0, 4);
      if (y) years.add(y);
    }
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [merged]);

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

  const isFiltered = urlQuery !== "" || urlYear !== "";
  // featuredFirst: 1페이지이고 필터 없을 때만 히어로 카드 적용
  const showFeatured = featuredFirst && safePage === 1 && !isFiltered && pageItems.length > 0;

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

  function clearSearch() {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  const gridCols = columns === 2 ? "grid gap-6 sm:grid-cols-2" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* 카테고리 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <CategoryIcon weight="light" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">{title}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
      </div>

      {/* 검색 + 연도 필터 */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <MagnifyingGlass
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            weight="bold"
          />
          <Input
            type="search"
            placeholder="제목, 성경구절, 설교자 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-9 h-11 text-base"
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
            className="w-full sm:w-auto border-input bg-background text-foreground h-11 rounded-md border px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
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

      {/* 결과 수 */}
      {!loading && (
        <p className="mb-5 text-sm text-muted-foreground/70">
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
        <div className={gridCols}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`skel-${i}`} className="h-56 animate-pulse rounded-xl bg-muted" />
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
          {["notices", "bulletin"].includes(category) ? (
            <div className="divide-y rounded-xl border overflow-hidden">
              {pageItems.map((entry) => (
                <Link
                  key={entry.id}
                  href={`${CATEGORIES[entry.category].path}/${entry.id}`}
                  className="block group"
                >
                  <div className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-muted/50">
                    <div className="min-w-0">
                      <p className="text-base font-medium line-clamp-1 group-hover:text-primary transition-colors">
                        {entry.title}
                      </p>
                      {(entry.scriptureReference || entry.preacher) && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {[entry.preacher, entry.scriptureReference].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-sm text-muted-foreground whitespace-nowrap">{formatDate(entry.date)}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : showFeatured ? (
            <>
              {/* 최신 히어로 카드 */}
              <div className="mb-6">
                <ContentCard entry={pageItems[0]!} showCategory={false} featured />
              </div>
              {/* 나머지 그리드 */}
              {pageItems.length > 1 && (
                <>
                  <p className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">{CATEGORY_PREV_LABELS[category]}</p>
                  <div className={gridCols}>
                    {pageItems.slice(1).map((entry) => (
                      <ContentCard key={entry.id} entry={entry} showCategory={false} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className={gridCols}>
              {pageItems.map((entry) => (
                <ContentCard key={entry.id} entry={entry} showCategory={false} />
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-1.5 flex-wrap">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                asChild={safePage > 1}
                disabled={safePage <= 1}
              >
                {safePage > 1 ? (
                  <Link href={buildPageUrl(safePage - 1)} aria-label="이전 페이지">
                    <CaretLeft weight="bold" className="h-4 w-4" />
                  </Link>
                ) : (
                  <span aria-hidden>
                    <CaretLeft weight="bold" className="h-4 w-4" />
                  </span>
                )}
              </Button>

              {paginationRange(safePage, totalPages).map((item, i) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground"
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={item}
                    variant={item === safePage ? "default" : "outline"}
                    size="icon"
                    className="h-10 w-10 text-base"
                    asChild={item !== safePage}
                    disabled={item === safePage}
                  >
                    {item !== safePage ? (
                      <Link href={buildPageUrl(item)}>{item}</Link>
                    ) : (
                      <span>{item}</span>
                    )}
                  </Button>
                ),
              )}

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                asChild={safePage < totalPages}
                disabled={safePage >= totalPages}
              >
                {safePage < totalPages ? (
                  <Link href={buildPageUrl(safePage + 1)} aria-label="다음 페이지">
                    <CaretRight weight="bold" className="h-4 w-4" />
                  </Link>
                ) : (
                  <span aria-hidden>
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
