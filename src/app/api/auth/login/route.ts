import { NextRequest, NextResponse } from "next/server";
import { createToken, COOKIE_NAME } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/data";
import { hashPassword, verifyPassword, isHashed } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (typeof password !== "string" || password.length === 0) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    const content = await getContent();
    const stored = content.admin.password;

    if (!(await verifyPassword(password, stored))) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // Upgrade legacy plaintext passwords to a hash on first successful login
    if (!isHashed(stored)) {
      content.admin.password = await hashPassword(password);
      await saveContent(content);
    }

    const token = await createToken();
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
