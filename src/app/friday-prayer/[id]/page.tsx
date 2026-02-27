"use client";

import { use } from "react";
import { ContentDetail } from "@/components/content/content-detail";

export default function FridayPrayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ContentDetail id={id} category="friday-prayer" />;
}
