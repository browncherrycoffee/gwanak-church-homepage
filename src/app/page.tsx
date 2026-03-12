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
  Phone,
  NavigationArrow,
  PlayCircle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContentCard } from "@/components/content/content-card";
import { YouTubeEmbed } from "@/components/content/youtube-embed";
import { useContents } from "@/hooks/use-contents";
import { useStaticContents } from "@/hooks/use-static-contents";
import { useCalendarEvents } from "@/hooks/use-calendar";
import { CATEGORIES, SITE_CONFIG } from "@/lib/constants";
import { getThumbnailUrl } from "@/lib/youtube";
import { formatDate } from "@/lib/utils";
import type { ContentCategory, ContentEntry } from "@/types";

const WEEKDAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"] as const;

function getTodayStr(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

function formatKoreanDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y!, (m ?? 1) - 1, d);
  return `${m}월 ${d}일 (${WEEKDAY_NAMES[date.getDay()]})`;
}

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
  }, [localContents, staticContents, category]);
}

export default function HomePage() {
  const latestSermons = useMergedCategory("sunday-sermon", 3);
  const latestDawn = useMergedCategory("dawn-prayer", 4);
  const latestBulletin = useMergedCategory("bulletin", 1);
  const latestFriday = useMergedCategory("friday-prayer", 1);
  const latestNotices = useMergedCategory("notices", 5);
  const calendarEvents = useCalendarEvents();
  const upcomingEvents = useMemo(() => {
    const todayStr = getTodayStr();
    const t = new Date();
    t.setDate(t.getDate() + 14);
    const limitStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
    return [...calendarEvents]
      .filter((e) => e.date >= todayStr && e.date <= limitStr)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
      .slice(0, 6);
  }, [calendarEvents]);

  const fridayEntry = latestFriday[0] ?? null;
  const todayDawn = latestDawn[0] ?? null;
  const moreDawn = latestDawn.slice(1, 4);

  const featuredSermon = latestSermons[0] ?? null;
  const moreSermons = latestSermons.slice(1);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 60%, rgba(255,255,255,0.06) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(255,255,255,0.04) 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:py-24 text-center">
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
            <Button asChild variant="secondary" size="lg" className="font-semibold shadow-lg text-base h-12 px-6">
              <Link href="/sunday-sermon">
                <PlayCircle weight="fill" className="h-5 w-5 mr-2" />
                주일설교 보기
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground font-semibold text-base h-12 px-6"
            >
              <Link href="/about">교회 소개</Link>
            </Button>
          </div>
          {/* Worship time quick info */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {WORSHIP_SCHEDULE.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-primary-foreground/90 ring-1 ring-primary-foreground/15"
              >
                <item.icon weight="light" className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="font-semibold">{item.label}</span>
                <span className="text-primary-foreground/65">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 처음 오셨나요? — 방문자 환영 섹션 */}
      <section className="mx-auto max-w-5xl px-4 pt-10 pb-2">
        <div className="rounded-2xl overflow-hidden border border-primary/25">
          {/* 인트로 */}
          <div className="bg-primary/5 px-4 py-5 sm:px-8 sm:py-6">
            <p className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary mb-3">
              처음 오셨나요?
            </p>
            <h2 className="text-xl sm:text-2xl font-bold leading-snug mb-2">
              관악교회에 오신 것을 환영합니다
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
              관악교회는 서울 관악구에 위치한 대한예수교장로회(고신) 소속 교회입니다.
              하나님의 말씀과 개혁교회의 신앙 전통 위에서, 2009년 창립 이래
              함께 예배하고 교제하며 지역사회를 섬기는 공동체입니다.
            </p>
          </div>

          {/* 핵심 정보 3열 */}
          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x border-t border-primary/15">
            <div className="px-4 sm:px-6 py-3 sm:py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">주일 예배</p>
              <p className="text-base font-bold">매 주일 오전 11시</p>
              <p className="text-sm text-muted-foreground mt-0.5">예배당 (서울 관악구 신림동)</p>
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">목회자</p>
              <p className="text-base font-bold">유해신 목사 (담임)</p>
              <p className="text-sm text-muted-foreground mt-0.5">류영협 전도사 · 안광우 강도사 · 김인용 전도사</p>
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">교단 · 전통</p>
              <p className="text-base font-bold">대한예수교장로회 (고신)</p>
              <p className="text-sm text-muted-foreground mt-0.5">개혁 · 장로교 전통</p>
            </div>
          </div>

          {/* CTA 버튼 */}
          <div className="px-6 py-4 border-t border-primary/15 bg-background/50 flex flex-wrap gap-2 items-center">
            <Button asChild size="sm">
              <Link href="/about">
                <Church weight="light" className="mr-1.5 h-4 w-4" />
                교회 소개 자세히 보기
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href="https://map.kakao.com/?q=서울+관악구+대학길+52" target="_blank" rel="noopener noreferrer">
                <NavigationArrow weight="light" className="mr-1.5 h-4 w-4" />
                오시는 길
              </a>
            </Button>
            <a
              href={`tel:${SITE_CONFIG.phone}`}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
            >
              <Phone weight="light" className="h-4 w-4" />
              {SITE_CONFIG.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Featured Sermon — 핵심 콘텐츠 최우선 배치 */}
      {featuredSermon && (
        <section className="mx-auto max-w-5xl px-4 pt-10 pb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <PlayCircle weight="fill" className="h-6 w-6 text-primary" />
              이번 주 주일설교
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/sunday-sermon" className="gap-1 text-sm">
                전체 보기 <ArrowRight weight="light" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          {/* Featured: YouTube embed + meta */}
          <Card className="overflow-hidden mb-6 border-primary/20">
            <CardContent className="p-4 sm:p-6">
              {featuredSermon.youtubeVideoId && (
                <div className="mb-5">
                  <YouTubeEmbed videoId={featuredSermon.youtubeVideoId} title={featuredSermon.title} />
                </div>
              )}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">최신 설교</span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <CalendarBlank weight="light" className="inline h-3.5 w-3.5" />
                  {formatDate(featuredSermon.date)}
                </span>
              </div>
              <Link href={`/sunday-sermon/${featuredSermon.id}`} className="group block mt-1">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-snug">
                  {featuredSermon.title}
                </h3>
              </Link>
              {featuredSermon.scriptureReference && (
                <p className="mt-2 text-base text-muted-foreground flex items-center gap-1.5">
                  <BookOpenText weight="light" className="h-4 w-4 shrink-0" />
                  {featuredSermon.scriptureReference}
                </p>
              )}
              {featuredSermon.preacher && (
                <p className="mt-1 text-base font-medium text-primary/80">{featuredSermon.preacher} 목사</p>
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

      {/* Quick Links */}
      <section className="mx-auto max-w-5xl px-4 pb-10 space-y-6">
        {/* 말씀 & 기도 — 4열 그리드 */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {QUICK_LINK_GROUPS[0].label}
          </p>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            {QUICK_LINK_GROUPS[0].items.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="group flex h-full items-start gap-2.5 sm:gap-3 rounded-xl border border-primary/20 bg-secondary/60 p-3 sm:p-4 transition-all hover:border-primary/50 hover:bg-secondary hover:shadow-md">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
                    <link.icon weight="light" className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{link.label}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 hidden sm:block">{link.description}</p>
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
                    <div className="group flex items-center gap-3 sm:gap-4 rounded-xl border border-primary/20 bg-secondary/60 p-3 sm:p-4 transition-all hover:border-primary/50 hover:bg-secondary hover:shadow-md">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
                        <link.icon weight="light" className="h-4 w-4 sm:h-5 sm:w-5" />
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
        <section className="mx-auto max-w-5xl px-4 pb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Bell weight="light" className="h-6 w-6" />
              교회소식
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/notices" className="gap-1 text-sm">
                전체 보기 <ArrowRight weight="light" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="divide-y rounded-xl border overflow-hidden">
            {latestNotices.map((notice) => (
              <Link key={notice.id} href={`/notices/${notice.id}`} className="block group">
                <div className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-muted/50">
                  <div className="min-w-0">
                    <p className="text-base font-medium line-clamp-1 group-hover:text-primary transition-colors">
                      {notice.title}
                    </p>
                    {notice.scriptureReference && (
                      <p className="text-sm text-muted-foreground mt-0.5">{notice.scriptureReference}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground whitespace-nowrap">{formatDate(notice.date)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 다가오는 일정 */}
      {upcomingEvents.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <CalendarBlank weight="light" className="h-6 w-6" />
              다가오는 일정
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/calendar" className="gap-1 text-sm">
                전체 보기 <ArrowRight weight="light" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="divide-y rounded-xl border overflow-hidden">
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="px-4 py-3 hover:bg-muted/40">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-bold text-primary">{formatKoreanDate(ev.date)}</span>
                  {ev.time && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock weight="light" className="h-3 w-3" />
                      {ev.time}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium line-clamp-1">{ev.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* This Week's Bulletin */}
      {latestBulletin.length > 0 && latestBulletin[0] && (
        <section className="mx-auto max-w-5xl px-4 pb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Newspaper weight="light" className="h-6 w-6" />
              이번 주 주보
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/bulletin" className="gap-1 text-sm">
                전체 보기 <ArrowRight weight="light" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Link href={`/bulletin/${latestBulletin[0].id}`}>
            <Card className="group transition-all hover:border-primary/30 hover:shadow-md">
              <CardContent className="p-5 sm:p-6 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Newspaper weight="light" className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">{formatDate(latestBulletin[0].date)}</p>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors leading-snug">
                    {latestBulletin[0].title}
                  </h3>
                  {latestBulletin[0].scriptureReference && (
                    <p className="mt-1.5 text-base text-muted-foreground flex items-center gap-1.5">
                      <BookOpenText weight="light" className="h-4 w-4 shrink-0" />
                      {latestBulletin[0].scriptureReference}
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    주보 보기 <ArrowRight weight="bold" className="h-3.5 w-3.5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>
      )}

      {/* Latest Friday Prayer */}
      {fridayEntry && (
        <section className="mx-auto max-w-5xl px-4 pb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Flame weight="light" className="h-6 w-6" />
              이번 주 금요기도회
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/friday-prayer" className="gap-1 text-sm">
                전체 보기 <ArrowRight weight="light" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Link href={`/friday-prayer/${fridayEntry.id}`}>
            <Card className="group transition-all hover:border-primary/30 hover:shadow-md">
              <CardContent className="p-5 sm:p-6 flex items-start gap-4">
                {fridayEntry.youtubeVideoId ? (
                  <div className="relative shrink-0 w-28 sm:w-36 aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={getThumbnailUrl(fridayEntry.youtubeVideoId)}
                      alt={fridayEntry.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle weight="fill" className="h-8 w-8 text-white drop-shadow-md opacity-90" />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Flame weight="light" className="h-7 w-7" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">{formatDate(fridayEntry.date)}</p>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors leading-snug">
                    {fridayEntry.title}
                  </h3>
                  {fridayEntry.scriptureReference && (
                    <p className="mt-1.5 text-base text-muted-foreground flex items-center gap-1.5">
                      <BookOpenText weight="light" className="h-4 w-4 shrink-0" />
                      {fridayEntry.scriptureReference}
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    설교 보기 <ArrowRight weight="bold" className="h-3.5 w-3.5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>
      )}

      {/* Today's Dawn Prayer */}
      {todayDawn && (
        <section className="mx-auto max-w-5xl px-4 pb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <SunHorizon weight="light" className="h-6 w-6" />
              오늘의 새벽기도
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href={CATEGORIES["dawn-prayer"].path} className="gap-1 text-sm">
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
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">최신</span>
                    <span className="text-sm text-muted-foreground">{formatDate(todayDawn.date)}</span>
                  </div>
                  <Link href={`/dawn-prayer/${todayDawn.id}`} className="group block">
                    <h3 className="text-base font-semibold line-clamp-2 group-hover:text-primary transition-colors">
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
            <div className="md:col-span-1 lg:col-span-2 grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1">
              {moreDawn.map((entry) => (
                <Link key={entry.id} href={`/dawn-prayer/${entry.id}`}>
                  <Card className="group transition-all hover:border-primary/30 hover:shadow-md overflow-hidden">
                    <div className="flex gap-3 p-3">
                      {entry.youtubeVideoId && (
                        <div className="relative shrink-0 w-28 aspect-video rounded overflow-hidden bg-muted">
                          <img
                            src={getThumbnailUrl(entry.youtubeVideoId)}
                            alt={entry.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle weight="fill" className="h-8 w-8 text-white drop-shadow-md opacity-90" />
                          </div>
                        </div>
                      )}
                      <div className="min-w-0 flex flex-col justify-center">
                        <p className="text-xs text-muted-foreground">{formatDate(entry.date)}</p>
                        <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors mt-0.5 leading-snug">
                          {entry.title}
                        </h3>
                        {entry.scriptureReference && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{entry.scriptureReference}</p>
                        )}
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
          <h2 className="text-xl sm:text-2xl font-bold mb-6">예배 안내</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {WORSHIP_SCHEDULE.map((item) => (
              <div key={item.label} className="rounded-xl bg-primary-foreground/10 ring-1 ring-primary-foreground/20 p-5 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15 text-primary-foreground">
                  <item.icon weight="light" className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">{item.label}</h3>
                  <p className="text-sm text-primary-foreground/70 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-primary-foreground/15 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <p className="text-sm text-primary-foreground/70 flex items-start gap-1.5">
              <MapPin weight="light" className="h-4 w-4 shrink-0 mt-0.5" />
              {SITE_CONFIG.address}
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://map.kakao.com/?q=서울+관악구+대학길+52"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary-foreground/15 border border-primary-foreground/20 px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/25 transition-colors"
              >
                <NavigationArrow weight="light" className="h-4 w-4" />
                오시는 길
              </a>
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary-foreground/15 border border-primary-foreground/20 px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/25 transition-colors"
              >
                <Phone weight="light" className="h-4 w-4" />
                {SITE_CONFIG.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
