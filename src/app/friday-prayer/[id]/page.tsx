import type { Metadata } from "next";
import { ContentDetail } from "@/components/content/content-detail";

const BASE_URL = "https://gwanak-church-homepage.vercel.app";

async function getSlimEntry(category: string, id: string) {
  try {
    const res = await fetch(`${BASE_URL}/data/${category}-index.json`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const entries = (await res.json()) as Array<{
      id: string;
      youtubeVideoId?: string;
      title: string;
      scriptureReference?: string;
      preacher?: string;
    }>;
    return entries.find((e) => e.id === id) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = await getSlimEntry("friday-prayer", id);
  if (!entry) return {};
  const parts = [entry.preacher, entry.scriptureReference].filter(Boolean);
  const description = parts.join(" · ") || undefined;
  return {
    title: entry.title,
    description,
    openGraph: {
      title: entry.title,
      description,
      ...(entry.youtubeVideoId
        ? { images: [{ url: `https://img.youtube.com/vi/${entry.youtubeVideoId}/hqdefault.jpg`, width: 480, height: 360 }] }
        : {}),
    },
  };
}

export default async function FridayPrayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ContentDetail id={id} category="friday-prayer" />;
}
