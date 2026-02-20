"use client";

import Link from "next/link";
import { Cross, ArrowRight, BookOpenText, Church, Newspaper, CalendarBlank } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContentCard } from "@/components/content/content-card";
import { useContents } from "@/hooks/use-contents";
import { CATEGORIES, SITE_CONFIG } from "@/lib/constants";
import type { ContentCategory } from "@/types";

const QUICK_LINKS = [
  { label: "교회 소개", href: "/about", icon: Church, description: "2009년 설립, 관악교회의 역사와 신앙고백" },
  {
    label: "새벽기도",
    href: "/dawn-prayer",
    icon: Cross,
    description: "매일 새벽 6시 말씀 영상 (유튜브)",
  },
  {
    label: "교리문답",
    href: "/catechism",
    icon: BookOpenText,
    description: "웨스트민스터 대교리문답 / 하이델베르크 요리문답",
  },
  {
    label: "주보",
    href: "/bulletin",
    icon: Newspaper,
    description: "매 주일 발행되는 교회 주보",
  },
] as const;

export default function HomePage() {
  const allContents = useContents();

  const getLatest = (category: ContentCategory, count: number) =>
    allContents
      .filter((c) => c.category === category)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, count);

  const latestSermons = getLatest("sunday-sermon", 3);
  const latestDawn = getLatest("dawn-prayer", 3);
  const latestBulletin = getLatest("bulletin", 1);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24 text-center">
          <Cross weight="light" className="mx-auto mb-4 h-10 w-10 opacity-80" />
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{SITE_CONFIG.name}</h1>
          <p className="mt-3 text-lg text-primary-foreground/80">
            {SITE_CONFIG.denomination}
          </p>
          <p className="mt-2 text-sm text-primary-foreground/60">
            2026 표어: &ldquo;모여서 함께 예배, 흩어져 삶의 예배&rdquo; (로마서 12:1)
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="secondary" size="lg">
              <Link href="/about">교회 소개</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/sunday-sermon">주일설교 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="group transition-all hover:border-primary/30 hover:shadow-md h-full">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <link.icon weight="light" className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {link.label}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{link.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* This Week's Bulletin */}
      {latestBulletin.length > 0 && latestBulletin[0] && (
        <section className="mx-auto max-w-5xl px-4 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CalendarBlank weight="light" className="h-5 w-5" />
              이번 주 주보
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/bulletin" className="gap-1">
                전체 보기 <ArrowRight weight="light" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Link href={`/bulletin/${latestBulletin[0].id}`}>
            <Card className="group transition-all hover:border-primary/30 hover:shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {latestBulletin[0].title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {latestBulletin[0].scriptureReference && `본문: ${latestBulletin[0].scriptureReference}`}
                </p>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">
                  {latestBulletin[0].content}
                </p>
              </CardContent>
            </Card>
          </Link>
        </section>
      )}

      {/* Latest Sermons */}
      {latestSermons.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">최근 주일설교</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/sunday-sermon" className="gap-1">
                전체 보기 <ArrowRight weight="light" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestSermons.map((entry) => (
              <ContentCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Dawn Prayers */}
      {latestDawn.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">최근 새벽기도</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href={CATEGORIES["dawn-prayer"].path} className="gap-1">
                전체 보기 <ArrowRight weight="light" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestDawn.map((entry) => (
              <ContentCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
