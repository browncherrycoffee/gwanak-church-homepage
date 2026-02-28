"use client";

import Link from "next/link";
import { Cross, MapPin, Phone, Envelope, YoutubeLogo, NavigationArrow } from "@phosphor-icons/react";
import { SITE_CONFIG } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Cross weight="fill" className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">
                {SITE_CONFIG.denomination} {SITE_CONFIG.name}
              </span>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <MapPin weight="light" className="h-3.5 w-3.5 shrink-0" />
                {SITE_CONFIG.address}
              </p>
              <p className="flex items-center gap-1.5">
                <Phone weight="light" className="h-3.5 w-3.5 shrink-0" />
                {SITE_CONFIG.phone}
              </p>
              <p className="flex items-center gap-1.5">
                <Envelope weight="light" className="h-3.5 w-3.5 shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-primary transition-colors">
                  {SITE_CONFIG.email}
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground">온라인 채널</p>
            <a
              href="https://www.youtube.com/@gwanakchurch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <YoutubeLogo weight="fill" className="h-4 w-4 text-red-500" />
              유튜브 채널
            </a>
            <a
              href={SITE_CONFIG.cafeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-[#00C4FF] text-white text-[9px] font-bold shrink-0">D</span>
              다음 카페
            </a>
            <a
              href="https://map.kakao.com/?q=서울+관악구+대학길+52"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <NavigationArrow weight="light" className="h-4 w-4 shrink-0" />
              위치 안내 (카카오맵)
            </a>
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              교회 소개
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
