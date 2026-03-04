"use client";

import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Plus, MagnifyingGlass, X, CaretLeft, CaretRight, ChatCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommunityCard } from "@/components/community/community-card";
import { useCommunityPosts } from "@/hooks/use-community";

const ITEMS_PER_PAGE = 10;

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

export default function CommunityPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">교인 커뮤니티</h1>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`skel-${i}`} className="h-24 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      }
    >
      <CommunityPageInner />
    </Suspense>
  );
}

function CommunityPageInner() {
  const posts = useCommunityPosts();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlQuery = searchParams.get("q") ?? "";
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

  const sorted = useMemo(
    () => [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [posts],
  );

  const filtered = useMemo(() => {
    if (!urlQuery) return sorted;
    const q = urlQuery.toLowerCase();
    return sorted.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q),
    );
  }, [sorted, urlQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

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

  function clearSearch() {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  const isFiltered = urlQuery !== "";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <ChatCircle weight="light" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">교인 커뮤니티</h1>
            <p className="text-sm text-muted-foreground mt-0.5">교인들을 위한 나눔과 교제의 공간입니다.</p>
          </div>
        </div>
        <Button asChild className="self-start shrink-0">
          <Link href="/community/new">
            <Plus weight="light" className="mr-2 h-4 w-4" />
            글 작성
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <MagnifyingGlass
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          weight="bold"
        />
        <Input
          type="search"
          placeholder="제목, 내용, 작성자 검색..."
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

      {/* Result count */}
      <p className="mb-4 text-sm text-muted-foreground/70">
        {isFiltered ? (
          <>
            <span className="font-medium text-foreground">{filtered.length}</span>개 검색됨
            {" "}(전체 {sorted.length}개)
            {" · "}
            <button
              type="button"
              onClick={() => { setQuery(""); router.push(pathname); }}
              className="underline hover:no-underline"
            >
              필터 초기화
            </button>
          </>
        ) : (
          <>총 <span className="font-medium">{sorted.length}</span>개</>
        )}
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          {isFiltered ? (
            <>
              <p>검색 결과가 없습니다.</p>
              <button
                type="button"
                onClick={() => { setQuery(""); router.push(pathname); }}
                className="mt-2 text-sm underline hover:no-underline"
              >
                전체 보기
              </button>
            </>
          ) : (
            <p>등록된 글이 없습니다.</p>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {pageItems.map((post) => (
              <CommunityCard key={post.id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-1 flex-wrap">
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
                  <span aria-hidden><CaretLeft weight="bold" className="h-4 w-4" /></span>
                )}
              </Button>

              {paginationRange(safePage, totalPages).map((item, i) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={item}
                    variant={item === safePage ? "default" : "outline"}
                    size="icon"
                    className="h-10 w-10"
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
                  <span aria-hidden><CaretRight weight="bold" className="h-4 w-4" /></span>
                )}
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
