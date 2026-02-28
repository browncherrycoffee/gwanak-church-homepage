import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function parseDateStr(date: string): Date {
  // YYYY-MM-DD strings are parsed as UTC by spec — use "/" to force local time
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(date.replace(/-/g, "/"))
    : new Date(date);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? parseDateStr(date) : date;
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? parseDateStr(date) : date;
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
