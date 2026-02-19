"use client";

import { useRouter } from "next/navigation";
import { ContentForm } from "@/components/admin/content-form";
import { addContent } from "@/lib/content-store";
import type { ContentFormData } from "@/types";

export default function AdminNewPage() {
  const router = useRouter();

  const handleSubmit = (data: ContentFormData) => {
    addContent(data);
    router.push("/admin");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">새 콘텐츠 등록</h1>
      <ContentForm onSubmit={handleSubmit} submitLabel="등록" />
    </div>
  );
}
