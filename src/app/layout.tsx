import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notoSansKR, geistMono } from "@/lib/fonts";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

const BASE_URL = "https://gwanak-church-homepage.vercel.app";

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: BASE_URL,
    siteName: SITE_CONFIG.name,
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#1b4332",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased flex flex-col">
        <ThemeProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
