import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/data";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }
    if (newPassword.length > 10) {
      return NextResponse.json({ error: "Password maksimal 10 karakter" }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9]+$/.test(newPassword)) {
      return NextResponse.json({ error: "Password hanya boleh huruf dan angka" }, { status: 400 });
    }

    const content = await getContent();
    if (!(await verifyPassword(currentPassword, content.admin.password))) {
      return NextResponse.json({ error: "Password saat ini salah" }, { status: 400 });
    }

    content.admin.password = await hashPassword(newPassword);
    await saveContent(content);

    return NextResponse.json({ success: true, message: "Password berhasil diubah!" });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
