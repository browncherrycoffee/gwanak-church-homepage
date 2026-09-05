"use client";

import { ContentListPage } from "@/components/content/content-list-page";

export default function DawnPrayerPage() {
  return (
    <ContentListPage
      category="dawn-prayer"
      title="새벽기도"
      description="매일 새벽, 말씀과 기도로 하루를 시작합니다. 새벽기도회는 예배당 모임 없이 유튜브 말씀 영상으로 드립니다."
      featuredFirst
      columns={2}
    />
  );
}
