"use client";

import { ContentListPage } from "@/components/content/content-list-page";

export default function PsalmSongPage() {
  return (
    <ContentListPage
      category="psalm-song"
      title="시편찬송"
      description="시편찬송 악보 자료입니다. 각 글을 클릭하면 악보를 확인할 수 있습니다."
      featuredFirst
      columns={2}
    />
  );
}
