"use client";

import Link from "next/link";
import { BookOpen, CalendarBlank, PlayCircle, MusicNote, FileText, User, BookOpenText, ArrowRight } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { getThumbnailUrl } from "@/lib/youtube";
import type { ContentEntry, ContentCategory } from "@/types";

const FEATURED_CTA_LABELS: Record<ContentCategory, string> = {
  "sunday-sermon": "지금 시청하기",
  "dawn-prayer": "지금 시청하기",
  "friday-prayer": "지금 시청하기",
  catechism: "강의 듣기",
  "psalm-song": "찬송 보기",
  bulletin: "주보 보기",
  notices: "소식 보기",
};

interface ContentCardProps {
  entry: ContentEntry;
  showCategory?: boolean;
  featured?: boolean;
}

export function ContentCard({ entry, showCategory = true, featured = false }: ContentCardProps) {
  const category = CATEGORIES[entry.category];
  const href = `${category.path}/${entry.id}`;
  const thumbnail = getThumbnailUrl(entry.youtubeVideoId);
  const hasAttachments = entry.attachments && entry.attachments.length > 0;
  const isPsalmSong = entry.category === "psalm-song";
  const showPlaceholder = !["notices", "bulletin"].includes(entry.category);

  // 히어로(최신) 카드 — 전폭 가로 레이아웃
  if (featured) {
    return (
      <Link href={href}>
        <Card className="group transition-all hover:border-primary/40 hover:shadow-lg overflow-hidden border-primary/20 bg-secondary/20">
          <div className="flex flex-col sm:flex-row">
            {/* 썸네일 */}
            {thumbnail ? (
              <div className="relative sm:w-1/2 aspect-video overflow-hidden bg-muted shrink-0">
                <img
                  src={thumbnail}
                  alt={entry.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/40 transition-colors">
                  <PlayCircle weight="fill" className="h-16 w-16 text-white opacity-85 group-hover:opacity-100 drop-shadow-xl transition-opacity" />
                </div>
              </div>
            ) : showPlaceholder ? (
              <div className="flex sm:w-1/2 aspect-video items-center justify-center bg-secondary shrink-0">
                {isPsalmSong ? (
                  <MusicNote weight="light" className="h-12 w-12 text-primary/40" />
                ) : (
                  <BookOpen weight="light" className="h-12 w-12 text-primary/40" />
                )}
              </div>
            ) : null}

            {/* 콘텐츠 */}
            <CardContent className={`${(thumbnail || showPlaceholder) ? "sm:w-1/2" : "w-full"} p-5 sm:p-6 flex flex-col justify-between gap-4`}>
              <div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">최신</span>
                  {showCategory && (
                    <Badge variant="secondary" className="text-xs">{category.label}</Badge>
                  )}
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarBlank weight="light" className="h-3.5 w-3.5" />
                    {formatDate(entry.date)}
                  </span>
                </div>
                <h3 className="text-xl font-bold line-clamp-3 group-hover:text-primary transition-colors leading-snug">
                  {entry.title}
                </h3>
                {entry.scriptureReference && (
                  <p className="mt-2 text-base text-muted-foreground flex items-center gap-1.5">
                    <BookOpenText weight="light" className="h-4 w-4 shrink-0" />
                    {entry.scriptureReference}
                  </p>
                )}
                {entry.preacher && (
                  <p className="mt-1.5 text-base font-medium text-primary/80 flex items-center gap-1.5">
                    <User weight="light" className="h-4 w-4 shrink-0" />
                    {entry.preacher} 목사
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                {entry.youtubeVideoId ? (
                  <PlayCircle weight="fill" className="h-5 w-5" />
                ) : (
                  <ArrowRight weight="bold" className="h-5 w-5" />
                )}
                {FEATURED_CTA_LABELS[entry.category]}
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  // 일반 카드
  return (
    <Link href={href}>
      <Card className="group transition-all hover:border-primary/30 hover:shadow-md overflow-hidden py-0">
        {thumbnail ? (
          <div className="relative aspect-video overflow-hidden bg-muted">
            <img
              src={thumbnail}
              alt={entry.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors">
              <PlayCircle
                weight="fill"
                className="h-14 w-14 text-white opacity-80 group-hover:opacity-100 drop-shadow-lg transition-opacity"
              />
            </div>
          </div>
        ) : showPlaceholder ? (
          <div className="flex aspect-video items-center justify-center bg-secondary">
            {isPsalmSong ? (
              <MusicNote weight="light" className="h-10 w-10 text-primary/40" />
            ) : (
              <BookOpen weight="light" className="h-10 w-10 text-primary/40" />
            )}
          </div>
        ) : null}
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {showCategory && (
              <Badge variant="secondary" className="text-xs">
                {category.label}
              </Badge>
            )}
            {hasAttachments && isPsalmSong && (
              <Badge variant="outline" className="text-xs gap-1">
                <FileText weight="light" className="h-3 w-3" />
                악보
              </Badge>
            )}
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarBlank weight="light" className="h-3.5 w-3.5" />
              {formatDate(entry.date)}
            </span>
          </div>
          <h3 className="text-base font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {entry.title}
          </h3>
          {entry.scriptureReference && (
            <p className="mt-1.5 text-sm text-muted-foreground">{entry.scriptureReference}</p>
          )}
          {entry.preacher && (
            <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
              <User weight="light" className="h-3.5 w-3.5" />
              {entry.preacher}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
