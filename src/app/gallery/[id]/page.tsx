"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarBlank, Trash, Image as ImageIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getGalleryPhoto, deleteGalleryPhoto } from "@/lib/gallery-store";
import { formatDate } from "@/lib/utils";
import type { GalleryPhoto } from "@/lib/gallery-store";

export default function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [photo, setPhoto] = useState<GalleryPhoto | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const found = getGalleryPhoto(id);
    if (found) {
      setPhoto(found);
    } else {
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold mb-2">사진을 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-6">요청하신 사진이 존재하지 않거나 삭제되었습니다.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft weight="light" className="mr-2 h-4 w-4" />
          돌아가기
        </Button>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft weight="light" className="h-4 w-4" />
          사진 목록
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => setShowDelete(true)}
        >
          <Trash weight="light" className="mr-1 h-4 w-4" />
          삭제
        </Button>
      </div>

      <article>
        <header className="mb-6">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{photo.title}</h1>
          <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarBlank weight="light" className="h-4 w-4" />
            {formatDate(photo.date)}
          </div>
        </header>

        {photo.imageUrl ? (
          <div className="rounded-lg overflow-hidden bg-muted mb-6">
            <img src={photo.imageUrl} alt={photo.title} className="w-full" />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-secondary rounded-lg mb-6">
            <ImageIcon weight="light" className="h-16 w-16 text-primary/40" />
          </div>
        )}

        {photo.description && (
          <>
            <Separator className="my-6" />
            <div className="prose prose-neutral max-w-none">
              {photo.description.split("\n").map((p, i) => (
                <p key={`p-${i}`} className="mb-4 leading-relaxed text-foreground/90">{p}</p>
              ))}
            </div>
          </>
        )}
      </article>

      <ConfirmDialog
        open={showDelete}
        title="사진 삭제"
        description="이 사진을 삭제하시겠습니까? 삭제된 사진은 복구할 수 없습니다."
        confirmLabel="삭제"
        destructive
        onConfirm={() => {
          deleteGalleryPhoto(photo.id);
          router.push("/gallery");
        }}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
