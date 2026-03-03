"use client";

import { ContentListPage } from "@/components/content/content-list-page";

export default function DawnPrayerPage() {
  return (
    <ContentListPage
      category="dawn-prayer"
      title="새벽기도"
      description="매일 새벽, 말씀과 기도로 하루를 시작합니다."
      featuredFirst
      columns={2}
    />
  );
}
