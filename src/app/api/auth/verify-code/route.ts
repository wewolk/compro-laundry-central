import { NextRequest, NextResponse } from "next/server";
import { getContent } from "@/lib/data";

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

    const resetToken = Buffer.from(JSON.stringify({
      verified: true,
      exp: Date.now() + 10 * 60 * 1000,
    })).toString("base64");

    return NextResponse.json({ success: true, resetToken });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
