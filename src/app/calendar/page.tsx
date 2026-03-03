"use client";

import Link from "next/link";
import { Plus, CalendarBlank, Clock, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarView } from "@/components/calendar/calendar-view";
import { useCalendarEvents } from "@/hooks/use-calendar";
import { useAdmin } from "@/hooks/use-admin";
import type { CalendarEvent } from "@/lib/calendar-store";

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

export default function CalendarPage() {
  const events = useCalendarEvents();
  const { isAdmin } = useAdmin();
  const todayStr = getTodayStr();

  // 오늘 이후 일정 (최대 20개)
  const upcomingEvents = [...events]
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 20);

  // 날짜별 그룹핑
  const grouped = new Map<string, CalendarEvent[]>();
  for (const ev of upcomingEvents) {
    if (!grouped.has(ev.date)) grouped.set(ev.date, []);
    grouped.get(ev.date)!.push(ev);
  }
  const groupedEntries = Array.from(grouped.entries());

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* 헤더 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <CalendarBlank weight="light" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">교회 일정</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">관악교회 예배 및 모임 일정</p>
          </div>
        </div>
        {isAdmin && (
          <Button asChild className="self-start shrink-0">
            <Link href="/calendar/new">
              <Plus weight="light" className="mr-2 h-4 w-4" />
              일정 추가
            </Link>
          </Button>
        )}
      </div>

      {/* 다가오는 일정 — 상단에 바로 표시 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
          <ArrowRight weight="bold" className="h-5 w-5 text-primary" />
          다가오는 일정
        </h2>
        {groupedEntries.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
            <CalendarBlank weight="light" className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-base">다가오는 일정이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedEntries.map(([date, dateEvents]) => (
              <div key={date}>
                {/* 날짜 헤더 */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base font-bold text-foreground">
                    {formatKoreanDate(date)}
                  </span>
                  {date === todayStr && (
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                      오늘
                    </span>
                  )}
                </div>
                <div className="space-y-2 ml-1">
                  {dateEvents.map((ev) => (
                    <Card key={ev.id} className="py-0 border-l-4 border-l-primary/50 hover:border-l-primary transition-colors">
                      <CardContent className="p-4 flex items-start gap-4">
                        {ev.time && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Clock weight="light" className="h-4 w-4 text-primary" />
                            <span className="text-base font-semibold text-primary tabular-nums w-14">
                              {ev.time}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-base font-semibold">{ev.title}</p>
                          {ev.description && (
                            <p className="text-sm text-muted-foreground mt-0.5 break-keep">{ev.description}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Separator className="my-8" />

      {/* 월별 달력 */}
      <section>
        <h2 className="text-xl font-bold mb-5">월별 달력</h2>
        <CalendarView events={events} />
      </section>
    </div>
  );
}
