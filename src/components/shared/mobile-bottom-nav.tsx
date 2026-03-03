"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Icon } from "@phosphor-icons/react";
import { House, Play, SunHorizon, Newspaper, CalendarBlank } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface BottomNavItem {
  label: string;
  href: string;
  icon: Icon;
  exact?: boolean;
}

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { label: "홈", href: "/", icon: House, exact: true },
  { label: "주일설교", href: "/sunday-sermon", icon: Play },
  { label: "새벽기도", href: "/dawn-prayer", icon: SunHorizon },
  { label: "주보", href: "/bulletin", icon: Newspaper },
  { label: "교회일정", href: "/calendar", icon: CalendarBlank },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch h-16">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon
                weight={isActive ? "fill" : "regular"}
                className="h-6 w-6 shrink-0"
              />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
