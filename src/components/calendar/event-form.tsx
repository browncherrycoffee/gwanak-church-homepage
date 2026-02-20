"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FloppyDisk, ArrowLeft } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EventFormData {
  title: string;
  date: string;
  time: string;
  description: string;
}

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
}

export function EventForm({ onSubmit }: EventFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<EventFormData>({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    time: "11:00",
    description: "",
  });

  const handleChange = (field: keyof EventFormData, value: string) => {
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
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              일정 제목 <span className="text-destructive">*</span>
            </label>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="예: 주일예배, 금요기도회"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
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
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                시간 <span className="text-destructive">*</span>
              </label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => handleChange("time", e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">설명</label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="일정에 대한 설명"
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
          일정 추가
        </Button>
      </div>
    </form>
  );
}
