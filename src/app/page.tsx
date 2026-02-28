"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Cross,
  ArrowRight,
  BookOpenText,
  Church,
  Newspaper,
  CalendarBlank,
  MusicNotes,
  Clock,
  YoutubeLogo,
  SunHorizon,
  Flame,
  Bell,
  ChatCircle,
  Images,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContentCard } from "@/components/content/content-card";
import { useContents } from "@/hooks/use-contents";
import { useStaticContents } from "@/hooks/use-static-contents";
import { CATEGORIES, SITE_CONFIG } from "@/lib/constants";
import { getThumbnailUrl } from "@/lib/youtube";
import { formatDate } from "@/lib/utils";
import type { ContentCategory, ContentEntry } from "@/types";

const QUICK_LINK_GROUPS = [
  {
    label: "말씀 & 기도",
    items: [
      { label: "새벽기도", href: "/dawn-prayer", icon: Cross, description: "월~금 오전 6시, 토 오전 7시 말씀 영상 (유튜브)" },
      { label: "금요기도회", href: "/friday-prayer", icon: Flame, description: "매주 금요일 저녁 기도회 말씀" },
      { label: "교리문답", href: "/catechism", icon: BookOpenText, description: "웨스트민스터 대교리문답 / 하이델베르크 요리문답" },
      { label: "시편찬송", href: "/psalm-song", icon: MusicNotes, description: "시편에 기반한 찬송과 악보 자료" },
    ],
  },
  {
    label: "교회 안내",
    items: [
      { label: "교회 소개", href: "/about", icon: Church, description: "2009년 설립, 관악교회의 역사와 신앙고백" },
      { label: "교회소식", href: "/notices", icon: Bell, description: "교회 소개, 예배 안내 및 모임 소식" },
      { label: "주보", href: "/bulletin", icon: Newspaper, description: "매 주일 발행되는 교회 주보" },
    ],
  },
  {
    label: "교인 공간",
    items: [
      { label: "교인 커뮤니티", href: "/community", icon: ChatCircle, description: "교인들의 기도 제목과 나눔 게시판" },
      { label: "활동 사진", href: "/gallery", icon: Images, description: "교회 행사 및 모임 사진 모음" },
      { label: "교회 일정", href: "/calendar", icon: CalendarBlank, description: "예배, 모임, 행사 일정 달력" },
    ],
  },
] as const;

const WORSHIP_SCHEDULE = [
  { label: "주일 오전 예배", time: "매 주일 오전 11시", icon: Church },
  { label: "새벽기도회", time: "월~금 오전 6시, 토 7시", icon: SunHorizon },
  { label: "금요기도회", time: "매주 금요일 저녁 8시", icon: Clock },
] as const;

function useMergedCategory(category: ContentCategory, count: number) {
  const localContents = useContents();
  const { data: staticContents } = useStaticContents(category, true);

  return useMemo(() => {
    const idSet = new Set<string>();
    const all: ContentEntry[] = [];
    for (const c of localContents) {
      if (c.category === category) {
        all.push(c);
        idSet.add(c.id);
      }
    }
    for (const c of staticContents) {
      if (!idSet.has(c.id)) {
        all.push(c);
        idSet.add(c.id);
      }
    }
    all.sort((a, b) => b.date.localeCompare(a.date));
    return all.slice(0, count);
  }, [localContents, staticContents, category, count]);
}

export default function HomePage() {
  const latestSermons = useMergedCategory("sunday-sermon", 3);
  const latestDawn = useMergedCategory("dawn-prayer", 4);
  const latestBulletin = useMergedCategory("bulletin", 1);

  const todayDawn = latestDawn[0] ?? null;
  const moreDawn = latestDawn.slice(1, 4);

  const featuredSermon = latestSermons[0] ?? null;
  const moreSermons = latestSermons.slice(1);

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
            {SITE_CONFIG.mottoYear} 표어: &ldquo;{SITE_CONFIG.motto}&rdquo; ({SITE_CONFIG.mottoVerse})
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
      <section className="mx-auto max-w-5xl px-4 py-12 space-y-6 sm:space-y-8">
        {/* 말씀 & 기도 — 4열 그리드 */}
        <div className="rounded-xl bg-primary/10 p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary/70">
            {QUICK_LINK_GROUPS[0].label}
          </p>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            {QUICK_LINK_GROUPS[0].items.map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="group transition-all hover:border-primary/30 hover:shadow-md h-full">
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                      <link.icon weight="light" className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                        {link.label}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 hidden sm:block">{link.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* 교회 안내 + 교인 공간 — 나란히 */}
        <div className="grid gap-6 sm:grid-cols-2">
          {([QUICK_LINK_GROUPS[1], QUICK_LINK_GROUPS[2]] as const).map((group) => (
            <div key={group.label} className="rounded-xl bg-muted/70 p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-2">
                {group.items.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Card className="group transition-all hover:border-primary/30 hover:shadow-md">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                          <link.icon weight="light" className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                            {link.label}
                          </h3>
                          <p className="mt-0.5 text-xs text-muted-foreground truncate">{link.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
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

      {/* Featured Sermon */}
      {featuredSermon && (
        <section className="mx-auto max-w-5xl px-4 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">이번 주 주일설교</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/sunday-sermon" className="gap-1">
                전체 보기 <ArrowRight weight="light" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          {/* Featured: wide card with thumbnail */}
          <Link href={`/sunday-sermon/${featuredSermon.id}`} className="block mb-6">
            <Card className="group overflow-hidden transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex flex-col sm:flex-row">
                {featuredSermon.youtubeVideoId && (
                  <div className="relative sm:w-72 shrink-0 overflow-hidden bg-muted">
                    <div className="aspect-video sm:h-full sm:aspect-auto">
                      <img
                        src={getThumbnailUrl(featuredSermon.youtubeVideoId)}
                        alt={featuredSermon.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <YoutubeLogo weight="fill" className="h-14 w-14 text-white" />
                      </div>
                    </div>
                  </div>
                )}
                <CardContent className="flex flex-col justify-center p-6">
                  <span className="text-xs text-muted-foreground mb-2">
                    <CalendarBlank weight="light" className="inline h-3 w-3 mr-1" />
                    {formatDate(featuredSermon.date)}
                  </span>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-3">
                    {featuredSermon.title}
                  </h3>
                  {featuredSermon.scriptureReference && (
                    <p className="mt-2 text-sm text-muted-foreground">{featuredSermon.scriptureReference}</p>
                  )}
                  {featuredSermon.preacher && (
                    <p className="mt-1 text-sm font-medium text-primary/80">{featuredSermon.preacher}</p>
                  )}
                </CardContent>
              </div>
            </Card>
          </Link>
          {/* Recent 2 more */}
          {moreSermons.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              {moreSermons.map((entry) => (
                <ContentCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Today's Dawn Prayer */}
      {todayDawn && (
        <section className="mx-auto max-w-5xl px-4 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <SunHorizon weight="light" className="h-5 w-5" />
              오늘의 새벽기도
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href={CATEGORIES["dawn-prayer"].path} className="gap-1">
                전체 보기 <ArrowRight weight="light" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Featured today's dawn prayer */}
            <Link href={`/dawn-prayer/${todayDawn.id}`} className="lg:col-span-2">
              <Card className="group overflow-hidden transition-all hover:border-primary/30 hover:shadow-md h-full">
                {todayDawn.youtubeVideoId && (
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={getThumbnailUrl(todayDawn.youtubeVideoId)}
                      alt={todayDawn.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <YoutubeLogo weight="fill" className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute top-2 left-2 rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      최신
                    </div>
                  </div>
                )}
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{formatDate(todayDawn.date)}</p>
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {todayDawn.title}
                  </h3>
                  {todayDawn.scriptureReference && (
                    <p className="mt-1 text-sm text-muted-foreground">{todayDawn.scriptureReference}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
            {/* 3 more recent dawn prayers */}
            <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {moreDawn.map((entry) => (
                <Link key={entry.id} href={`/dawn-prayer/${entry.id}`}>
                  <Card className="group transition-all hover:border-primary/30 hover:shadow-md overflow-hidden">
                    <div className="flex gap-3 p-3">
                      {entry.youtubeVideoId && (
                        <div className="relative shrink-0 w-24 aspect-video rounded overflow-hidden bg-muted">
                          <img
                            src={getThumbnailUrl(entry.youtubeVideoId)}
                            alt={entry.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{formatDate(entry.date)}</p>
                        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors mt-0.5">
                          {entry.title}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Worship Schedule */}
      <section className="bg-secondary/50">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-xl font-bold mb-6">예배 안내</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {WORSHIP_SCHEDULE.map((item) => (
              <Card key={item.label}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background text-primary">
                    <item.icon weight="light" className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {SITE_CONFIG.address}
          </p>
        </div>
      </section>
    </>
  );
}
