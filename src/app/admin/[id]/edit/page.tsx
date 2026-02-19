"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ContentForm } from "@/components/admin/content-form";
import { getContent, updateContent } from "@/lib/content-store";
import type { ContentEntry, ContentFormData } from "@/types";

export default function AdminEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [entry, setEntry] = useState<ContentEntry | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const found = getContent(id);
    if (found) {
      setEntry(found);
    } else {
      setNotFound(true);
    }
  }, [id]);

  const handleSubmit = (data: ContentFormData) => {
    updateContent(id, data);
    router.push("/admin");
  };

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold mb-2">콘텐츠를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground">요청하신 콘텐츠가 존재하지 않습니다.</p>
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">콘텐츠 수정</h1>
      <ContentForm initialData={entry} onSubmit={handleSubmit} submitLabel="저장" />
    </div>
  );
}
