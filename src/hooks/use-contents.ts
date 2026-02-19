"use client";

import { useSyncExternalStore } from "react";
import { getContents, subscribe } from "@/lib/content-store";

export function useContents() {
  return useSyncExternalStore(subscribe, getContents, getContents);
}
