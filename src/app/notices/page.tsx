"use client";

import { ContentListPage } from "@/components/content/content-list-page";

export default function NoticesPage() {
  return (
    <ContentListPage
      category="notices"
      title="교회소식"
      description="교회 소개와 예배 안내, 모임 관련 소식입니다."
    />
  );
}
