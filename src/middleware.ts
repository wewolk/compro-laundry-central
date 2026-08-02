import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/forgot-password",
];

const PUBLIC_API_PATHS = [
  "/api/auth/login",
  "/api/auth/forgot-password",
  "/api/auth/verify-code",
  "/api/auth/reset-password",
  "/api/content", // GET only
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin page routes
  if (pathname.startsWith("/admin") && !PUBLIC_ADMIN_PATHS.includes(pathname)) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || !verifyToken(token)) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      return response;
    }
  }

  // Add no-cache headers to admin pages
  if (pathname.startsWith("/admin")) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  // Protect admin API routes (except public ones)
  const isPublicApi = PUBLIC_API_PATHS.some((p) => pathname.startsWith(p));
  if (pathname.startsWith("/api/") && !isPublicApi) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
