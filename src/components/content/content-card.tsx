"use client";

import Link from "next/link";
import { BookOpen, CalendarBlank, YoutubeLogo } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { getThumbnailUrl } from "@/lib/youtube";
import type { ContentEntry } from "@/types";

interface ContentCardProps {
  entry: ContentEntry;
}

export function ContentCard({ entry }: ContentCardProps) {
  const category = CATEGORIES[entry.category];
  const href = `${category.path}/${entry.id}`;
  const thumbnail = getThumbnailUrl(entry.youtubeVideoId);

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
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <YoutubeLogo weight="fill" className="h-12 w-12 text-white" />
            </div>
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-secondary">
            <BookOpen weight="light" className="h-10 w-10 text-primary/40" />
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {category.label}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarBlank weight="light" className="h-3 w-3" />
              {formatDate(entry.date)}
            </span>
          </div>
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {entry.title}
          </h3>
          {entry.scriptureReference && (
            <p className="mt-1 text-sm text-muted-foreground">{entry.scriptureReference}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
