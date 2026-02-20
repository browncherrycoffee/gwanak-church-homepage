"use client";

export interface GalleryPhoto {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  date: string;
  createdAt: string;
}

const STORAGE_KEY = "gwanak-gallery";
const VERSION_KEY = "gwanak-gallery-version";
const DATA_VERSION = 1;

const samplePhotos: GalleryPhoto[] = [
  {
    id: "photo-christmas-2025",
    title: "2025 성탄절 예배",
    imageUrl: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&h=600&fit=crop",
    description: "2025년 12월 25일 성탄절 예배 및 찬양 콘서트",
    date: "2025-12-25",
    createdAt: "2025-12-25T12:00:00.000Z",
  },
  {
    id: "photo-worship-2025",
    title: "주일예배 모습",
    imageUrl: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=600&fit=crop",
    description: "관악교회 주일예배 모습",
    date: "2025-10-12",
    createdAt: "2025-10-12T12:00:00.000Z",
  },
  {
    id: "photo-fellowship-2025",
    title: "교제 모임",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    description: "부서별 교제 모임",
    date: "2025-09-14",
    createdAt: "2025-09-14T12:00:00.000Z",
  },
];

function loadFromStorage(): GalleryPhoto[] {
  if (typeof window === "undefined") return [...samplePhotos];
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion !== String(DATA_VERSION)) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
      return [...samplePhotos];
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as GalleryPhoto[];
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
  return [...samplePhotos];
}

function saveToStorage(data: GalleryPhoto[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
  } catch {
    // ignore
  }
}

let photos: GalleryPhoto[] = loadFromStorage();
let listeners: Array<() => void> = [];

function notify() {
  saveToStorage(photos);
  for (const listener of listeners) {
    listener();
  }
}

export function getGalleryPhotos(): GalleryPhoto[] {
  return photos;
}

export function getGalleryPhoto(id: string): GalleryPhoto | undefined {
  return photos.find((p) => p.id === id);
}

export function addGalleryPhoto(data: Omit<GalleryPhoto, "id" | "createdAt">): GalleryPhoto {
  const newPhoto: GalleryPhoto = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  photos = [newPhoto, ...photos];
  notify();
  return newPhoto;
}

export function deleteGalleryPhoto(id: string): boolean {
  const before = photos.length;
  photos = photos.filter((p) => p.id !== id);
  if (photos.length < before) {
    notify();
    return true;
  }
  return false;
}

export function subscribeGallery(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
