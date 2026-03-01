"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X, Cross, GearSix } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { useAdmin } from "@/hooks/use-admin";

const NAV_ITEMS = [
  { label: "교회 소개", href: "/about" },
  { label: "교회소식", href: "/notices" },
  { label: "주일설교", href: "/sunday-sermon" },
  { label: "새벽기도", href: "/dawn-prayer" },
  { label: "금요기도회", href: "/friday-prayer" },
  { label: "교리문답", href: "/catechism" },
  { label: "시편찬송", href: "/psalm-song" },
  { label: "주보", href: "/bulletin" },
  { label: "교인 커뮤니티", href: "/community" },
  { label: "활동 사진", href: "/gallery" },
  { label: "교회 일정", href: "/calendar" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin, loading } = useAdmin();

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.reload();
  };

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
          {!loading && !isAdmin && (
            <Link
              href="/admin/login"
              className="ml-1 rounded-full border border-primary/70 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              관리자 로그인
            </Link>
          )}
          {!loading && isAdmin && (
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
            >
              로그아웃
            </button>
          )}
        </nav>

        {/* Mobile toggle + admin */}
        <div className="flex items-center gap-1 md:hidden">
          <Link
            href="/admin"
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-accent",
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
            className="h-11 w-11"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {mobileOpen ? <X weight="light" className="h-5 w-5" /> : <List weight="light" className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t bg-background px-4 pb-4 pt-2 overflow-y-auto max-h-[calc(100dvh-3.5rem)]">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-3 py-3 text-sm rounded-md transition-colors",
                pathname.startsWith(item.href)
                  ? "text-primary font-medium bg-accent"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {item.label}
            </Link>
          ))}
          {!loading && (
            <div className="mt-2 border-t pt-2">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-md px-3 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted"
                >
                  로그아웃
                </button>
              ) : (
                <Link
                  href="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-3 text-sm font-medium text-primary transition-colors hover:bg-muted"
                >
                  관리자 로그인
                </Link>
              )}
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
