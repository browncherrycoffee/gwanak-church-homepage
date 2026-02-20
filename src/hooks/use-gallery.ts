"use client";

import { useSyncExternalStore } from "react";
import { getGalleryPhotos, subscribeGallery } from "@/lib/gallery-store";

export function useGalleryPhotos() {
  return useSyncExternalStore(subscribeGallery, getGalleryPhotos, getGalleryPhotos);
}
