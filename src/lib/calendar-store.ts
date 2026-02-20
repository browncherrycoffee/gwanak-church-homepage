"use client";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  createdAt: string;
}

const STORAGE_KEY = "gwanak-calendar";
const VERSION_KEY = "gwanak-calendar-version";
const DATA_VERSION = 1;

const sampleEvents: CalendarEvent[] = [
  {
    id: "ev-sunday",
    title: "주일예배",
    date: "2026-02-22",
    time: "11:00",
    description: "오전 11시 주일예배",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-friday",
    title: "금요기도회",
    date: "2026-02-27",
    time: "20:00",
    description: "저녁 8시 금요기도회",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-dawn",
    title: "새벽기도 (유튜브)",
    date: "2026-02-20",
    time: "06:00",
    description: "매일 새벽 6시 말씀 영상 업로드 (토요일 오전 7시)",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-dept",
    title: "부서별 모임",
    date: "2026-02-22",
    time: "13:00",
    description: "오후 1시 부서별 모임: 제1남전도회, 제1여전도회, 제2여전도회, 제3남전도회, 제3여전도회, 제4남녀전도회, 대학청년부, 중고등부, 유초등부",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ev-sunday-mar1",
    title: "주일예배",
    date: "2026-03-01",
    time: "11:00",
    description: "오전 11시 주일예배",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

function loadFromStorage(): CalendarEvent[] {
  if (typeof window === "undefined") return [...sampleEvents];
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion !== String(DATA_VERSION)) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
      return [...sampleEvents];
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CalendarEvent[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  try {
    localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
  } catch {
    // ignore
  }
  return [...sampleEvents];
}

function saveToStorage(data: CalendarEvent[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
  } catch {
    // ignore
  }
}

let events: CalendarEvent[] = loadFromStorage();
let listeners: Array<() => void> = [];

function notify() {
  saveToStorage(events);
  for (const listener of listeners) {
    listener();
  }
}

export function getCalendarEvents(): CalendarEvent[] {
  return events;
}

export function getEventsByDate(date: string): CalendarEvent[] {
  return events.filter((e) => e.date === date);
}

export function addCalendarEvent(data: Omit<CalendarEvent, "id" | "createdAt">): CalendarEvent {
  const newEvent: CalendarEvent = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  events = [newEvent, ...events];
  notify();
  return newEvent;
}

export function deleteCalendarEvent(id: string): boolean {
  const before = events.length;
  events = events.filter((e) => e.id !== id);
  if (events.length < before) {
    notify();
    return true;
  }
  return false;
}

export function subscribeCalendar(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
