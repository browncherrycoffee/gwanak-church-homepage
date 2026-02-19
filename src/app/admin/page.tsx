"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, PencilSimple, Trash, CalendarBlank } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useContents } from "@/hooks/use-contents";
import { deleteContent } from "@/lib/content-store";
import { CATEGORIES } from "@/lib/constants";
import { formatShortDate } from "@/lib/utils";
import type { ContentCategory } from "@/types";

const categoryOptions: { value: "all" | ContentCategory; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "dawn-prayer", label: "새벽기도" },
  { value: "sunday-sermon", label: "주일설교" },
  { value: "catechism", label: "교리문답" },
];

export default function AdminDashboardPage() {
  const allContents = useContents();
  const [filter, setFilter] = useState<"all" | ContentCategory>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = filter === "all"
    ? [...allContents].sort((a, b) => b.date.localeCompare(a.date))
    : allContents
        .filter((c) => c.category === filter)
        .sort((a, b) => b.date.localeCompare(a.date));

  const handleDelete = () => {
    if (deleteId) {
      deleteContent(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">관리자</h1>
          <p className="text-sm text-muted-foreground mt-1">
            콘텐츠 {allContents.length}개
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/new">
            <Plus weight="light" className="mr-2 h-4 w-4" />
            새 콘텐츠
          </Link>
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categoryOptions.map((opt) => (
          <Button
            key={opt.value}
            variant={filter === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Content List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          등록된 콘텐츠가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => {
            const cat = CATEGORIES[entry.category];
            return (
              <Card key={entry.id} className="py-0">
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {cat.label}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <CalendarBlank weight="light" className="h-3 w-3" />
                        {formatShortDate(entry.date)}
                      </span>
                    </div>
                    <h3 className="font-medium truncate">{entry.title}</h3>
                    {entry.scriptureReference && (
                      <p className="text-xs text-muted-foreground truncate">
                        {entry.scriptureReference}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button asChild variant="ghost" size="icon-sm">
                      <Link href={`/admin/${entry.id}/edit`}>
                        <PencilSimple weight="light" className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDeleteId(entry.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash weight="light" className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="콘텐츠 삭제"
        description="이 콘텐츠를 삭제하시겠습니까? 삭제된 콘텐츠는 복구할 수 없습니다."
        confirmLabel="삭제"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
