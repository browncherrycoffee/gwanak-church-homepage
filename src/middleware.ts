import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken } from "@/lib/auth";

const ADMIN_PUBLIC_PATHS = ["/admin/login"];
const API_PATHS = ["/api/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow login page and auth API
  if (
    ADMIN_PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    API_PATHS.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("gwanak-admin-auth");
  if (!authCookie?.value || !(await verifyAuthToken(authCookie.value))) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
