"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FloppyDisk, ArrowLeft } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { addGalleryPhoto } from "@/lib/gallery-store";

export default function NewGalleryPhotoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addGalleryPhoto(form);
    router.push("/gallery");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">새 사진 추가</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                제목 <span className="text-destructive">*</span>
              </label>
              <Input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="사진 제목"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                이미지 URL <span className="text-destructive">*</span>
              </label>
              <Input
                type="url"
                value={form.imageUrl}
                onChange={(e) => handleChange("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                외부 이미지 URL을 입력해주세요.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">날짜</label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">설명</label>
              <Textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="사진에 대한 설명"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            <ArrowLeft weight="light" className="mr-2 h-4 w-4" />
            취소
          </Button>
          <Button type="submit">
            <FloppyDisk weight="light" className="mr-2 h-4 w-4" />
            사진 추가
          </Button>
        </div>
      </form>
    </div>
  );
}
