"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarBlank, BookOpenText, User, FileArrowDown, ShareNetwork, Check, YoutubeLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { YouTubeEmbed } from "./youtube-embed";
import { getContent } from "@/lib/content-store";
import { fetchStaticCategory } from "@/lib/static-content-store";
import { CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { ContentEntry, ContentCategory } from "@/types";

const SIBLING_LABELS: Record<ContentCategory, { prev: string; next: string }> = {
  "sunday-sermon": { prev: "이전 주일설교", next: "다음 주일설교" },
  "dawn-prayer": { prev: "이전 새벽기도", next: "다음 새벽기도" },
  "friday-prayer": { prev: "이전 금요기도회", next: "다음 금요기도회" },
  catechism: { prev: "이전 교리문답", next: "다음 교리문답" },
  "psalm-song": { prev: "이전 시편찬송", next: "다음 시편찬송" },
  bulletin: { prev: "이전 주보", next: "다음 주보" },
  notices: { prev: "이전 소식", next: "다음 소식" },
};

interface ContentDetailProps {
  id: string;
  category: ContentCategory;
}

export function ContentDetail({ id, category }: ContentDetailProps) {
  const router = useRouter();
  const [entry, setEntry] = useState<ContentEntry | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [siblings, setSiblings] = useState<{ prev: ContentEntry | null; next: ContentEntry | null }>({
    prev: null,
    next: null,
  });
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: entry?.title ?? "관악교회 설교",
          text: [entry?.preacher && `${entry.preacher} 목사`, entry?.scriptureReference].filter(Boolean).join(" | "),
          url,
        });
        return;
      } catch {
        // 사용자가 취소한 경우 무시
        return;
      }
    }
    // 네이티브 공유 미지원 시 클립보드 복사
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    if (!entry) return;
    fetchStaticCategory(category, true).then((allEntries) => {
      const sorted = [...allEntries].sort((a, b) => b.date.localeCompare(a.date));
      const idx = sorted.findIndex((e) => e.id === entry.id);
      if (idx < 0) return;
      setSiblings({
        next: idx > 0 ? (sorted[idx - 1] ?? null) : null,
        prev: idx < sorted.length - 1 ? (sorted[idx + 1] ?? null) : null,
      });
    });
  }, [entry, category]);

  useEffect(() => {
    // First check localStorage
    const found = getContent(id);
    if (found && found.category === category) {
      setEntry(found);
      return;
    }

    // Then check static data
    fetchStaticCategory(category).then((entries) => {
      const staticEntry = entries.find((e) => e.id === id);
      if (staticEntry) {
        setEntry(staticEntry);
      } else {
        setNotFound(true);
      }
    });
  }, [id, category]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold mb-2">콘텐츠를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-6">요청하신 콘텐츠가 존재하지 않거나 삭제되었습니다.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft weight="light" className="mr-2 h-4 w-4" />
          돌아가기
        </Button>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="h-5 w-32 animate-pulse rounded bg-muted mb-8" />
        <div className="space-y-3 mb-6">
          <div className="h-9 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
        </div>
        <div className="aspect-video animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  const cat = CATEGORIES[entry.category];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* 뒤로가기 — 크고 명확하게 */}
      <div className="mb-6">
        <Link
          href={cat.path}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-base font-medium text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft weight="regular" className="h-5 w-5" />
          {cat.label} 목록으로
        </Link>
      </div>

      <article>
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">{cat.label}</Badge>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
              aria-label="공유하기"
            >
              {copied ? (
                <>
                  <Check weight="bold" className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">복사됨</span>
                </>
              ) : (
                <>
                  <ShareNetwork weight="light" className="h-4 w-4" />
                  공유하기
                </>
              )}
            </button>
          </div>
          <h1 className="text-2xl font-bold leading-snug sm:text-3xl">{entry.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-base text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarBlank weight="light" className="h-5 w-5 shrink-0" />
              {formatDate(entry.date)}
            </span>
            {entry.preacher && (
              <span className="flex items-center gap-2">
                <User weight="light" className="h-5 w-5 shrink-0" />
                {entry.preacher} 목사
              </span>
            )}
            {entry.scriptureReference && (
              <span className="flex items-center gap-2">
                <BookOpenText weight="light" className="h-5 w-5 shrink-0" />
                {entry.scriptureReference}
              </span>
            )}
          </div>
        </header>

        {entry.youtubeVideoId && (
          <div className="mb-6">
            <YouTubeEmbed videoId={entry.youtubeVideoId} title={entry.title} />
            <div className="mt-3 flex justify-end">
              <a
                href={`https://www.youtube.com/watch?v=${entry.youtubeVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <YoutubeLogo weight="fill" className="h-4 w-4" />
                YouTube 앱에서 보기
              </a>
            </div>
          </div>
        )}

        {entry.content.trim() && (
          <>
            <Separator className="my-6" />
            <div className="space-y-4">
              {entry.content.trim().split("\n").map((paragraph, i) => (
                <p key={`p-${i}`} className="text-base leading-relaxed text-foreground/90">
                  {paragraph}
                </p>
              ))}
            </div>
          </>
        )}

        {/* Attachments section */}
        {entry.attachments && entry.attachments.length > 0 && (
          <>
            <Separator className="my-6" />
            <div>
              <h3 className="text-base font-semibold mb-4">
                {entry.category === "psalm-song" ? "악보" : "첨부파일"}
              </h3>
              <div className="space-y-4">
                {entry.attachments.map((att, i) => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(att.name);
                  return (
                    <div key={`att-${i}`}>
                      {isImage ? (
                        <a href={att.url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={att.url}
                            alt={att.name}
                            className="w-full max-w-full rounded border hover:opacity-90 transition-opacity cursor-pointer"
                            loading="lazy"
                          />
                          <p className="mt-1 text-sm text-muted-foreground">{att.name} (클릭하여 크게 보기)</p>
                        </a>
                      ) : (
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-base text-primary hover:underline py-1"
                        >
                          <FileArrowDown weight="light" className="h-5 w-5" />
                          {att.name}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </article>

      {/* Prev / Next navigation — 더 크고 명확하게 */}
      {(siblings.prev || siblings.next) && (
        <>
          <Separator className="my-8" />
          <div className="flex gap-3">
            {siblings.prev ? (
              <Link href={`${cat.path}/${siblings.prev.id}`} className="flex-1">
                <div className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50 min-h-[4.5rem]">
                  <ArrowLeft weight="regular" className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">{SIBLING_LABELS[entry.category].prev}</p>
                    <p className="text-sm font-semibold line-clamp-2 leading-snug">{siblings.prev.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(siblings.prev.date)}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {siblings.next && (
              <Link href={`${cat.path}/${siblings.next.id}`} className="flex-1">
                <div className="flex items-center justify-end gap-3 rounded-lg border p-4 text-right transition-colors hover:border-primary/50 hover:bg-muted/50 min-h-[4.5rem]">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">{SIBLING_LABELS[entry.category].next}</p>
                    <p className="text-sm font-semibold line-clamp-2 leading-snug">{siblings.next.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(siblings.next.date)}</p>
                  </div>
                  <ArrowRight weight="regular" className="h-5 w-5 shrink-0 text-muted-foreground" />
                </div>
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
