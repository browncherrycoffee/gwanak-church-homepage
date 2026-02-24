import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "gwanak-admin-auth";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(COOKIE_NAME);
  if (authCookie?.value === "authenticated") {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body as { password?: string };

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "서버 설정 오류" },
      { status: 500 },
    );
  }

  if (!password || password !== adminPassword) {
    return NextResponse.json(
      { error: "비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
