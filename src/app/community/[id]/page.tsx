"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  CalendarBlank,
  ChatCircle,
  Trash,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  getCommunityPost,
  addComment,
  deleteCommunityPost,
  subscribeCommunity,
} from "@/lib/community-store";
import { formatDate } from "@/lib/utils";
import type { CommunityPost } from "@/lib/community-store";

export default function CommunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    function load() {
      const found = getCommunityPost(id);
      if (found) {
        setPost(found);
      } else {
        setNotFound(true);
      }
    }
    load();
    const unsub = subscribeCommunity(load);
    return unsub;
  }, [id]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentContent.trim()) return;
    addComment(id, { author: commentAuthor.trim(), content: commentContent.trim() });
    setCommentContent("");
  };

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold mb-2">글을 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-6">요청하신 글이 존재하지 않거나 삭제되었습니다.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft weight="light" className="mr-2 h-4 w-4" />
          돌아가기
        </Button>
      </div>
    );
  }

  if (!post) {
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
          href="/community"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft weight="light" className="h-4 w-4" />
          글 목록
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
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{post.title}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User weight="light" className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarBlank weight="light" className="h-4 w-4" />
              {formatDate(post.createdAt)}
            </span>
          </div>
        </header>

        <div className="prose prose-neutral max-w-none">
          {post.content.split("\n").map((p, i) => (
            <p key={`p-${i}`} className="mb-4 leading-relaxed text-foreground/90">{p}</p>
          ))}
        </div>
      </article>

      <Separator className="my-8" />

      {/* Comments section */}
      <div>
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <ChatCircle weight="light" className="h-5 w-5" />
          댓글 {post.comments.length}개
        </h3>

        {post.comments.length > 0 && (
          <div className="space-y-3 mb-6">
            {post.comments.map((comment) => (
              <Card key={comment.id} className="py-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <User weight="light" className="h-3.5 w-3.5" />
                      {comment.author}
                    </span>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add comment form */}
        <form onSubmit={handleAddComment} className="space-y-3">
          <div>
            <Input
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder="이름"
              className="w-full sm:max-w-[200px]"
              required
            />
          </div>
          <div className="flex gap-2">
            <Textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 작성해주세요."
              rows={2}
              className="flex-1"
              required
            />
            <Button type="submit" size="icon" className="h-11 w-11 self-end shrink-0">
              <PaperPlaneTilt weight="light" className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="글 삭제"
        description="이 글을 삭제하시겠습니까? 삭제된 글은 복구할 수 없습니다."
        confirmLabel="삭제"
        destructive
        onConfirm={() => {
          deleteCommunityPost(post.id);
          router.push("/community");
        }}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
