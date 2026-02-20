"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FloppyDisk, ArrowLeft } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { addCommunityPost } from "@/lib/community-store";

export default function NewCommunityPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    author: "",
    title: "",
    content: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) return;
    addCommunityPost(form);
    router.push("/community");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">새 글 작성</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                작성자 <span className="text-destructive">*</span>
              </label>
              <Input
                value={form.author}
                onChange={(e) => handleChange("author", e.target.value)}
                placeholder="이름"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                제목 <span className="text-destructive">*</span>
              </label>
              <Input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="글 제목"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                내용 <span className="text-destructive">*</span>
              </label>
              <Textarea
                value={form.content}
                onChange={(e) => handleChange("content", e.target.value)}
                placeholder="나누고 싶은 이야기를 자유롭게 작성해주세요."
                rows={8}
                required
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
            등록
          </Button>
        </div>
      </form>
    </div>
  );
}
