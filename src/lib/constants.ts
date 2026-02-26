import type { ContentCategory } from "@/types";

export const SITE_CONFIG = {
  name: "관악교회",
  denomination: "대한예수교장로회(고신)",
  description: "대한예수교장로회(고신) 관악교회 - 개혁신앙에 뿌리를 둔 말씀 중심의 교회",
  address: "08819 서울특별시 관악구 대학길 52(신림동), 3층",
  phone: "070-8682-3991",
  fax: "02-876-3991",
  email: "gwanakchurch@gmail.com",
  website: "http://www.GwanakChurch.org",
  founded: "2009-05-17",
  pastor: "유해신 목사",
  cafeUrl: "https://cafe.daum.net/-goodchurch",
} as const;

export const CATEGORIES: Record<ContentCategory, { label: string; path: string }> = {
  "dawn-prayer": { label: "새벽기도", path: "/dawn-prayer" },
  "sunday-sermon": { label: "주일설교", path: "/sunday-sermon" },
  catechism: { label: "교리문답", path: "/catechism" },
  bulletin: { label: "주보", path: "/bulletin" },
  "psalm-song": { label: "시편찬송", path: "/psalm-song" },
} as const;


export const ITEMS_PER_PAGE = 12;
