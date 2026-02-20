"use client";

import Link from "next/link";
import { User, ChatCircle, CalendarBlank } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { CommunityPost } from "@/lib/community-store";

interface CommunityCardProps {
  post: CommunityPost;
}

export function CommunityCard({ post }: CommunityCardProps) {
  return (
    <Link href={`/community/${post.id}`}>
      <Card className="group transition-all hover:border-primary/30 hover:shadow-md py-0">
        <CardContent className="p-5">
          <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{post.content}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User weight="light" className="h-3.5 w-3.5" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <CalendarBlank weight="light" className="h-3.5 w-3.5" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <ChatCircle weight="light" className="h-3.5 w-3.5" />
              {post.comments.length}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
