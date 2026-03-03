"use client";

import { ContentListPage } from "@/components/content/content-list-page";

export default function CatechismPage() {
  return (
    <ContentListPage
      category="catechism"
      title="교리문답"
      description="웨스트민스터 대교리문답과 하이델베르크 요리문답 강해 자료입니다."
      columns={2}
    />
  );
}
