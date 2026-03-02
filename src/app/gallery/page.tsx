"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Plus, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { GalleryCard } from "@/components/gallery/gallery-card";
import { useGalleryPhotos } from "@/hooks/use-gallery";
import { useAdmin } from "@/hooks/use-admin";

const ITEMS_PER_PAGE = 12;

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

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">활동 사진</h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`skel-${i}`} className="h-48 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      }
    >
      <GalleryPageInner />
    </Suspense>
  );
}

function GalleryPageInner() {
  const photos = useGalleryPhotos();
  const { isAdmin } = useAdmin();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const sorted = useMemo(
    () => [...photos].sort((a, b) => b.date.localeCompare(a.date)),
    [photos],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = sorted.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

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

  // router is used indirectly via buildPageUrl / Link — suppress lint
  void router;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">활동 사진</h1>
          <p className="mt-1 text-muted-foreground">관악교회의 활동 모습을 사진으로 만나보세요.</p>
        </div>
        {isAdmin && (
          <Button asChild className="self-start shrink-0">
            <Link href="/gallery/new">
              <Plus weight="light" className="mr-2 h-4 w-4" />
              사진 추가
            </Link>
          </Button>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p>등록된 사진이 없습니다.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-xs text-muted-foreground/70">
            총 <span className="font-medium">{sorted.length}</span>개
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((photo) => (
              <GalleryCard key={photo.id} photo={photo} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-1 flex-wrap">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
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
                    className="h-9 w-9"
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
                className="h-9 w-9"
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
