import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent, type SiteContent } from "@/lib/data";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function GET() {
  try {
    const content = await getContent();
    // Never expose the admin block (password hash, reset code) publicly
    const publicContent = { ...content } as Partial<SiteContent>;
    delete publicContent.admin;
    return NextResponse.json(publicContent);
  } catch {
    return NextResponse.json({ error: "Gagal membaca data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify auth for PUT
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: Omit<SiteContent, "admin"> = await request.json();

    // Preserve the server-side admin block: clients must not be able to
    // overwrite the password hash or reset code through this endpoint.
    const current = await getContent();
    await saveContent({ ...body, admin: current.admin });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}
