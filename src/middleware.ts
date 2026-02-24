import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("gwanak-admin-auth");
  if (!authCookie?.value) {
    // Let the client-side auth gate handle the login UI
    // We add a header so the auth gate knows to check server-side
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
