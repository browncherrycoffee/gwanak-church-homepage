"use client";

import Link from "next/link";
import { CalendarBlank, Image as ImageIcon } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { GalleryPhoto } from "@/lib/gallery-store";

interface GalleryCardProps {
  photo: GalleryPhoto;
}

export function GalleryCard({ photo }: GalleryCardProps) {
  return (
    <Link href={`/gallery/${photo.id}`}>
      <Card className="group transition-all hover:border-primary/30 hover:shadow-md overflow-hidden py-0">
        {photo.imageUrl ? (
          <div className="relative aspect-video overflow-hidden bg-muted">
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-secondary">
            <ImageIcon weight="light" className="h-10 w-10 text-primary/40" />
          </div>
        )}
        <CardContent className="p-4">
          <span className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <CalendarBlank weight="light" className="h-3 w-3" />
            {formatDate(photo.date)}
          </span>
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {photo.title}
          </h3>
          {photo.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{photo.description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
