"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarBlank, BookOpenText, User, FileArrowDown } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { YouTubeEmbed } from "./youtube-embed";
import { getContent } from "@/lib/content-store";
import { fetchStaticCategory } from "@/lib/static-content-store";
import { CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { ContentEntry, ContentCategory } from "@/types";

interface ContentDetailProps {
  id: string;
  category: ContentCategory;
}

export function ContentDetail({ id, category }: ContentDetailProps) {
  const router = useRouter();
  const [entry, setEntry] = useState<ContentEntry | null>(null);
  const [notFound, setNotFound] = useState(false);

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
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">
        불러오는 중...
      </div>
    );
  }

  const cat = CATEGORIES[entry.category];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Link
          href={cat.path}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft weight="light" className="h-4 w-4" />
          {cat.label} 목록
        </Link>
      </div>

      <article>
        <header className="mb-6">
          <Badge variant="secondary" className="mb-3">
            {cat.label}
          </Badge>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{entry.title}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarBlank weight="light" className="h-4 w-4" />
              {formatDate(entry.date)}
            </span>
            {entry.preacher && (
              <span className="flex items-center gap-1.5">
                <User weight="light" className="h-4 w-4" />
                {entry.preacher}
              </span>
            )}
            {entry.scriptureReference && (
              <span className="flex items-center gap-1.5">
                <BookOpenText weight="light" className="h-4 w-4" />
                {entry.scriptureReference}
              </span>
            )}
          </div>
        </header>

        {entry.youtubeVideoId && (
          <div className="mb-6">
            <YouTubeEmbed videoId={entry.youtubeVideoId} title={entry.title} />
          </div>
        )}

        <Separator className="my-6" />

        <div className="prose prose-neutral max-w-none">
          {entry.content.split("\n").map((paragraph, i) => (
            <p key={`p-${i}`} className="mb-4 leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Attachments section */}
        {entry.attachments && entry.attachments.length > 0 && (
          <>
            <Separator className="my-6" />
            <div>
              <h3 className="text-sm font-semibold mb-3">첨부파일</h3>
              <ul className="space-y-2">
                {entry.attachments.map((att, i) => (
                  <li key={`att-${i}`}>
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <FileArrowDown weight="light" className="h-4 w-4" />
                      {att.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </article>
    </div>
  );
}
