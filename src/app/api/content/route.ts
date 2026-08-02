import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent, type SiteContent } from "@/lib/data";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function GET() {
  try {
    const content = await getContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Gagal membaca data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify auth for PUT
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: SiteContent = await request.json();
    await saveContent(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}
