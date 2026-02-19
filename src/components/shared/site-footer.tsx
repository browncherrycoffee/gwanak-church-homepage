"use client";

import { Cross, MapPin, Phone } from "@phosphor-icons/react";
import { SITE_CONFIG } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cross weight="fill" className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">대한예수교장로회(합신) {SITE_CONFIG.name}</span>
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
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
