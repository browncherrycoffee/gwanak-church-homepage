import type { ContentCategory } from "@/types";

export const SITE_CONFIG = {
  name: "관악교회",
  description: "대한예수교장로회(합신) 관악교회 홈페이지",
  address: "서울특별시 관악구 관악로 206, 2층",
  phone: "02-883-2083",
} as const;

export const CATEGORIES: Record<ContentCategory, { label: string; path: string }> = {
  "dawn-prayer": { label: "새벽기도", path: "/dawn-prayer" },
  "sunday-sermon": { label: "주일설교", path: "/sunday-sermon" },
  catechism: { label: "교리문답", path: "/catechism" },
} as const;

export const ADMIN_PIN_KEY = "gwanak-admin-pin";

export const ITEMS_PER_PAGE = 12;
