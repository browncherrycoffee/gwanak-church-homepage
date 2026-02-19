"use client";

import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary mx-auto mb-4">
        <MagnifyingGlass weight="light" className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold mb-2">페이지를 찾을 수 없습니다</h1>
      <p className="text-muted-foreground mb-8">
        요청하신 페이지가 존재하지 않거나, 이동되었을 수 있습니다.
      </p>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  );
}
