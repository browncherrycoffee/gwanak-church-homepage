"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X, Cross, GearSix } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";

const NAV_ITEMS = [
  { label: "교회 소개", href: "/about" },
  { label: "새벽기도", href: "/dawn-prayer" },
  { label: "주일설교", href: "/sunday-sermon" },
  { label: "교리문답", href: "/catechism" },
  { label: "시편찬송", href: "/psalm-song" },
  { label: "주보", href: "/bulletin" },
  { label: "커뮤니티", href: "/community" },
  { label: "활동 사진", href: "/gallery" },
  { label: "교회 일정", href: "/calendar" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <Cross weight="fill" className="h-5 w-5 text-primary" />
          <span className="font-semibold text-primary">{SITE_CONFIG.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent",
                pathname.startsWith(item.href)
                  ? "text-primary font-medium bg-accent"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className={cn(
              "ml-1 p-2 rounded-md transition-colors hover:bg-accent",
              pathname.startsWith("/admin")
                ? "text-primary bg-accent"
                : "text-muted-foreground",
            )}
            aria-label="관리자"
          >
            <GearSix weight="light" className="h-4 w-4" />
          </Link>
        </nav>

        {/* Mobile toggle + admin */}
        <div className="flex items-center gap-1 md:hidden">
          <Link
            href="/admin"
            className={cn(
              "p-2 rounded-md transition-colors hover:bg-accent",
              pathname.startsWith("/admin")
                ? "text-primary bg-accent"
                : "text-muted-foreground",
            )}
            aria-label="관리자"
            onClick={() => setMobileOpen(false)}
          >
            <GearSix weight="light" className="h-5 w-5" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {mobileOpen ? <X weight="light" className="h-5 w-5" /> : <List weight="light" className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t bg-background px-4 pb-4 pt-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-3 py-2.5 text-sm rounded-md transition-colors",
                pathname.startsWith(item.href)
                  ? "text-primary font-medium bg-accent"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
