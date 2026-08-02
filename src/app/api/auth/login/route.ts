import { NextRequest, NextResponse } from "next/server";
import { createToken, COOKIE_NAME } from "@/lib/auth";
import { getContent } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const content = await getContent();
    if (password !== content.admin.password) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    const token = createToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
