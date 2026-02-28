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
const DATA_VERSION = 2;

const samplePhotos: GalleryPhoto[] = [];

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
