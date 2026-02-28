"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { CommunityCard } from "@/components/community/community-card";
import { useCommunityPosts } from "@/hooks/use-community";

export default function CommunityPage() {
  const posts = useCommunityPosts();

  const sorted = useMemo(
    () => [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [posts],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">교인 커뮤니티</h1>
          <p className="mt-1 text-muted-foreground">교인들을 위한 나눔과 교제의 공간입니다.</p>
        </div>
        <Button asChild className="self-start shrink-0">
          <Link href="/community/new">
            <Plus weight="light" className="mr-2 h-4 w-4" />
            글 작성
          </Link>
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p>등록된 글이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((post) => (
            <CommunityCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
