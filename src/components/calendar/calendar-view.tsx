"use client";

import { useState } from "react";
import { CaretLeft, CaretRight, Clock } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/calendar-store";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

interface CalendarViewProps {
  events: CalendarEvent[];
}

export function CalendarView({ events }: CalendarViewProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(
    toDateStr(today.getFullYear(), today.getMonth(), today.getDate()),
  );

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    const existing = eventsByDate.get(ev.date);
    if (existing) {
      existing.push(ev);
    } else {
      eventsByDate.set(ev.date, [ev]);
    }
  }

  const selectedEvents = (eventsByDate.get(selectedDate) ?? []).sort((a, b) =>
    a.time.localeCompare(b.time),
  );

  const goPrev = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const goNext = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const cells: Array<{ day: number; dateStr: string } | null> = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, dateStr: toDateStr(year, month, d) });
  }

  return (
    <div className="space-y-6">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={goPrev} aria-label="이전 달">
          <CaretLeft weight="light" className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">
          {year}년 {month + 1}월
        </h2>
        <Button variant="ghost" size="icon" onClick={goNext} aria-label="다음 달">
          <CaretRight weight="light" className="h-5 w-5" />
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {WEEKDAYS.map((wd, i) => (
          <div
            key={wd}
            className={cn(
              "bg-muted py-2 text-center text-xs font-medium",
              i === 0 && "text-red-500",
              i === 6 && "text-blue-500",
            )}
          >
            {wd}
          </div>
        ))}
        {cells.map((cell, i) => {
          if (!cell) {
            return <div key={`empty-${i}`} className="bg-background p-1 min-h-[3.5rem] sm:min-h-[4rem]" />;
          }
          const hasEvents = eventsByDate.has(cell.dateStr);
          const isToday = cell.dateStr === todayStr;
          const isSelected = cell.dateStr === selectedDate;
          const dayOfWeek = (firstDay + cell.day - 1) % 7;

          return (
            <button
              key={cell.dateStr}
              onClick={() => setSelectedDate(cell.dateStr)}
              className={cn(
                "bg-background p-1 min-h-[3.5rem] sm:min-h-[4rem] text-left transition-colors hover:bg-accent relative",
                isSelected && "bg-primary/10 ring-1 ring-primary",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  isToday && "bg-primary text-primary-foreground font-bold",
                  dayOfWeek === 0 && !isToday && "text-red-500",
                  dayOfWeek === 6 && !isToday && "text-blue-500",
                )}
              >
                {cell.day}
              </span>
              {hasEvents && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day events */}
      <div>
        <h3 className="font-semibold mb-3">
          {selectedDate.replace(/-/g, ".")} 일정
        </h3>
        {selectedEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">해당 날짜에 일정이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {selectedEvents.map((ev) => (
              <Card key={ev.id} className="py-0">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0 pt-0.5">
                      <Clock weight="light" className="h-4 w-4" />
                      {ev.time}
                    </div>
                    <div>
                      <h4 className="font-medium">{ev.title}</h4>
                      {ev.description && (
                        <p className="text-sm text-muted-foreground mt-0.5">{ev.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
