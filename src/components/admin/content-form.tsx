"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FloppyDisk, ArrowLeft } from "@phosphor-icons/react";
import { CATEGORIES } from "@/lib/constants";
import type { ContentEntry, ContentFormData, ContentCategory } from "@/types";

interface ContentFormProps {
  initialData?: ContentEntry;
  onSubmit: (data: ContentFormData) => void;
  submitLabel: string;
}

const categoryOptions = Object.entries(CATEGORIES) as [ContentCategory, { label: string }][];

export function ContentForm({ initialData, onSubmit, submitLabel }: ContentFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ContentFormData>({
    category: initialData?.category ?? "sunday-sermon",
    title: initialData?.title ?? "",
    date: initialData?.date ?? new Date().toISOString().slice(0, 10),
    youtubeUrl: initialData?.youtubeUrl ?? "",
    scriptureReference: initialData?.scriptureReference ?? "",
    content: initialData?.content ?? "",
    preacher: initialData?.preacher ?? "",
  });

  const handleChange = (field: keyof ContentFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">기본 정보</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  카테고리 <span className="text-destructive">*</span>
                </label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                >
                  {categoryOptions.map(([value, { label }]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  날짜 <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1.5 block">
                  제목 <span className="text-destructive">*</span>
                </label>
                <Input
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="설교/기도/교리문답 제목"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">설교자</label>
                <Input
                  value={form.preacher}
                  onChange={(e) => handleChange("preacher", e.target.value)}
                  placeholder="설교자 이름"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">성경 본문</label>
                <Input
                  value={form.scriptureReference}
                  onChange={(e) => handleChange("scriptureReference", e.target.value)}
                  placeholder="예: 로마서 8:28-30"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">콘텐츠</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">YouTube URL</label>
                <Input
                  value={form.youtubeUrl}
                  onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                  placeholder="https://youtu.be/... 또는 https://youtube.com/watch?v=..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">본문 내용</label>
                <Textarea
                  value={form.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  placeholder="설교 요약, 기도 내용, 교리문답 등"
                  rows={8}
                />
              </div>
            </div>
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
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
