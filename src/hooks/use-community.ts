"use client";

import { useSyncExternalStore } from "react";
import { getCommunityPosts, subscribeCommunity } from "@/lib/community-store";

export function useCommunityPosts() {
  return useSyncExternalStore(subscribeCommunity, getCommunityPosts, getCommunityPosts);
}
