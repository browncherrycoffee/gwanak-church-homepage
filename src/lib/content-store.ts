"use client";

import type { ContentEntry, ContentFormData, ContentCategory } from "@/types";
import { extractVideoId } from "./youtube";
import { sampleContents } from "./sample-data";

const STORAGE_KEY = "gwanak-contents";
const VERSION_KEY = "gwanak-contents-version";
const DATA_VERSION = 1;

function loadFromStorage(): ContentEntry[] {
  if (typeof window === "undefined") return [...sampleContents];
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion !== String(DATA_VERSION)) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
      return [...sampleContents];
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ContentEntry[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  try {
    localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
  } catch {
    // ignore
  }
  return [...sampleContents];
}

function saveToStorage(data: ContentEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
  } catch {
    // ignore storage errors
  }
}

let contents: ContentEntry[] = loadFromStorage();
let listeners: Array<() => void> = [];

function notify() {
  saveToStorage(contents);
  for (const listener of listeners) {
    listener();
  }
}

export function getContents(): ContentEntry[] {
  return contents;
}

export function getContentsByCategory(category: ContentCategory): ContentEntry[] {
  return contents
    .filter((c) => c.category === category)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getContent(id: string): ContentEntry | undefined {
  return contents.find((c) => c.id === id);
}

export function getLatestByCategory(category: ContentCategory, count: number): ContentEntry[] {
  return getContentsByCategory(category).slice(0, count);
}

export function addContent(data: ContentFormData): ContentEntry {
  const now = new Date().toISOString();
  const videoId = extractVideoId(data.youtubeUrl);
  const newEntry: ContentEntry = {
    id: crypto.randomUUID(),
    ...data,
    youtubeVideoId: videoId,
    createdAt: now,
    updatedAt: now,
  };
  contents = [newEntry, ...contents];
  notify();
  return newEntry;
}

export function updateContent(id: string, data: Partial<ContentFormData>): ContentEntry | null {
  const index = contents.findIndex((c) => c.id === id);
  if (index === -1) return null;
  const existing = contents[index];
  if (!existing) return null;

  const youtubeVideoId = data.youtubeUrl !== undefined
    ? extractVideoId(data.youtubeUrl)
    : existing.youtubeVideoId;

  const updated: ContentEntry = {
    ...existing,
    ...data,
    youtubeVideoId,
    updatedAt: new Date().toISOString(),
  };
  contents = [...contents.slice(0, index), updated, ...contents.slice(index + 1)];
  notify();
  return updated;
}

export function deleteContent(id: string): boolean {
  const before = contents.length;
  contents = contents.filter((c) => c.id !== id);
  if (contents.length < before) {
    notify();
    return true;
  }
  return false;
}

export function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
