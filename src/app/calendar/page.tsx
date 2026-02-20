"use client";

import Link from "next/link";
import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { CalendarView } from "@/components/calendar/calendar-view";
import { useCalendarEvents } from "@/hooks/use-calendar";

export default function CalendarPage() {
  const events = useCalendarEvents();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">교회 일정</h1>
          <p className="mt-1 text-muted-foreground">관악교회 월별 일정을 확인하세요.</p>
        </div>
        <Button asChild>
          <Link href="/calendar/new">
            <Plus weight="light" className="mr-2 h-4 w-4" />
            일정 추가
          </Link>
        </Button>
      </div>
      <CalendarView events={events} />
    </div>
  );
}
