import { NextRequest, NextResponse } from "next/server";
import { getContent } from "@/lib/data";
import { createResetToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    const content = await getContent();

    if (!content.admin.resetCode || !content.admin.resetExpiry) {
      return NextResponse.json({ error: "Tidak ada kode reset aktif" }, { status: 400 });
    }
    if (Date.now() > content.admin.resetExpiry) {
      return NextResponse.json({ error: "Kode sudah kadaluarsa" }, { status: 400 });
    }
    if (code !== content.admin.resetCode) {
      return NextResponse.json({ error: "Kode salah" }, { status: 400 });
    }

    // Signed token: cannot be forged client-side
    const resetToken = await createResetToken();

    return NextResponse.json({ success: true, resetToken });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
