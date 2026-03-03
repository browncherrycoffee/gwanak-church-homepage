"use client";

import { ContentListPage } from "@/components/content/content-list-page";

export default function BulletinPage() {
  return (
    <ContentListPage
      category="bulletin"
      title="주보"
      description="매 주일 발행되는 교회 주보입니다."
      featuredFirst
      columns={2}
    />
  );
}
