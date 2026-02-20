"use client";

import { useSyncExternalStore } from "react";
import { getCalendarEvents, subscribeCalendar } from "@/lib/calendar-store";

export function useCalendarEvents() {
  return useSyncExternalStore(subscribeCalendar, getCalendarEvents, getCalendarEvents);
}
