"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { GalleryCard } from "@/components/gallery/gallery-card";
import { useGalleryPhotos } from "@/hooks/use-gallery";

export default function GalleryPage() {
  const photos = useGalleryPhotos();

  const sorted = useMemo(
    () => [...photos].sort((a, b) => b.date.localeCompare(a.date)),
    [photos],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">활동 사진</h1>
          <p className="mt-1 text-muted-foreground">관악교회의 활동 모습을 사진으로 만나보세요.</p>
        </div>
        <Button asChild>
          <Link href="/gallery/new">
            <Plus weight="light" className="mr-2 h-4 w-4" />
            사진 추가
          </Link>
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p>등록된 사진이 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((photo) => (
            <GalleryCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}
    </div>
  );
}
