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
  SunHorizon,
  Flame,
  Bell,
  ChatCircle,
  Images,
  MapPin,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContentCard } from "@/components/content/content-card";
import { YouTubeEmbed } from "@/components/content/youtube-embed";
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
  const latestNotices = useMergedCategory("notices", 3);

  const todayDawn = latestDawn[0] ?? null;
  const moreDawn = latestDawn.slice(1, 4);

  const featuredSermon = latestSermons[0] ?? null;
  const moreSermons = latestSermons.slice(1);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        {/* Subtle radial gradient overlay for depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 60%, rgba(255,255,255,0.06) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(255,255,255,0.04) 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-foreground/10 mb-5 mx-auto ring-1 ring-primary-foreground/20">
            <Cross weight="fill" className="h-8 w-8 text-primary-foreground/90" />
          </div>
          <h1 className="text-3xl font-bold sm:text-5xl lg:text-6xl tracking-tight">{SITE_CONFIG.name}</h1>
          <p className="mt-3 text-base sm:text-lg text-primary-foreground/75">
            {SITE_CONFIG.denomination}
          </p>
          <p className="mt-3 inline-block rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/85">
            &ldquo;{SITE_CONFIG.motto}&rdquo; &nbsp;{SITE_CONFIG.mottoVerse}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="secondary" size="lg" className="font-semibold shadow-lg">
              <Link href="/sunday-sermon">주일설교 보기</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground font-semibold"
            >
              <Link href="/about">교회 소개</Link>
            </Button>
          </div>
          {/* Worship time quick info */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            {WORSHIP_SCHEDULE.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs text-primary-foreground/80 ring-1 ring-primary-foreground/15"
              >
                <item.icon weight="light" className="h-3.5 w-3.5 shrink-0" />
                <span className="font-medium">{item.label}</span>
                <span className="text-primary-foreground/60">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mx-auto max-w-5xl px-4 py-12 space-y-6 sm:space-y-8">
        {/* 말씀 & 기도 — 4열 그리드 */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {QUICK_LINK_GROUPS[0].label}
          </p>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            {QUICK_LINK_GROUPS[0].items.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="group flex h-full items-start gap-3 rounded-xl border border-primary/20 bg-secondary/60 p-4 transition-all hover:border-primary/50 hover:bg-secondary hover:shadow-md">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
                    <link.icon weight="light" className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{link.label}</h3>
                    <p className="mt-0.5 hidden text-xs text-muted-foreground line-clamp-2 sm:block">{link.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 교회 안내 + 교인 공간 — 나란히 */}
        <div className="grid gap-6 sm:grid-cols-2">
          {([QUICK_LINK_GROUPS[1], QUICK_LINK_GROUPS[2]] as const).map((group) => (
            <div key={group.label}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-2">
                {group.items.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div className="group flex items-center gap-4 rounded-xl border border-primary/20 bg-secondary/60 p-4 transition-all hover:border-primary/50 hover:bg-secondary hover:shadow-md">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
                        <link.icon weight="light" className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{link.label}</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{link.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notices */}
      {latestNotices.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Bell weight="light" className="h-5 w-5" />
              교회소식
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/notices" className="gap-1">
                전체 보기 <ArrowRight weight="light" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="divide-y rounded-xl border overflow-hidden">
            {latestNotices.map((notice) => (
              <Link key={notice.id} href={`/notices/${notice.id}`} className="block group">
                <div className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                      {notice.title}
                    </p>
                    {notice.scriptureReference && (
                      <p className="text-xs text-muted-foreground mt-0.5">{notice.scriptureReference}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDate(notice.date)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
          {/* Featured: YouTube embed + meta */}
          <Card className="overflow-hidden mb-6">
            <CardContent className="p-4 sm:p-6">
              {featuredSermon.youtubeVideoId && (
                <div className="mb-4">
                  <YouTubeEmbed videoId={featuredSermon.youtubeVideoId} title={featuredSermon.title} />
                </div>
              )}
              <span className="text-xs text-muted-foreground">
                <CalendarBlank weight="light" className="inline h-3 w-3 mr-1" />
                {formatDate(featuredSermon.date)}
              </span>
              <Link href={`/sunday-sermon/${featuredSermon.id}`} className="group block mt-1">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-3">
                  {featuredSermon.title}
                </h3>
              </Link>
              {featuredSermon.scriptureReference && (
                <p className="mt-1 text-sm text-muted-foreground">{featuredSermon.scriptureReference}</p>
              )}
              {featuredSermon.preacher && (
                <p className="mt-1 text-sm font-medium text-primary/80">{featuredSermon.preacher}</p>
              )}
            </CardContent>
          </Card>
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Featured today's dawn prayer — YouTube embed */}
            <div className="md:col-span-1 lg:col-span-2">
              <Card className="overflow-hidden h-full">
                <CardContent className="p-4">
                  {todayDawn.youtubeVideoId && (
                    <div className="mb-3">
                      <YouTubeEmbed videoId={todayDawn.youtubeVideoId} title={todayDawn.title} />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">최신</span>
                    <span className="text-xs text-muted-foreground">{formatDate(todayDawn.date)}</span>
                  </div>
                  <Link href={`/dawn-prayer/${todayDawn.id}`} className="group block">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {todayDawn.title}
                    </h3>
                  </Link>
                  {todayDawn.scriptureReference && (
                    <p className="mt-1 text-sm text-muted-foreground">{todayDawn.scriptureReference}</p>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* 3 more recent dawn prayers */}
            <div className="md:col-span-1 lg:col-span-2 grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1">
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
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-xl font-bold mb-6">예배 안내</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {WORSHIP_SCHEDULE.map((item) => (
              <div key={item.label} className="rounded-xl bg-primary-foreground/10 ring-1 ring-primary-foreground/20 p-5 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15 text-primary-foreground">
                  <item.icon weight="light" className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.label}</h3>
                  <p className="text-sm text-primary-foreground/70">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-primary-foreground/60 flex items-center gap-1.5">
            <MapPin weight="light" className="h-3.5 w-3.5 shrink-0" />
            {SITE_CONFIG.address}
          </p>
        </div>
      </section>
    </>
  );
}
