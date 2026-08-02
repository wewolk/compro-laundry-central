import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/data";
import { verifyResetToken } from "@/lib/auth";
import { hashPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    const { newPassword, resetToken } = await request.json();

    // Validate password rules: max 10 chars, only letters and numbers
    if (!newPassword || newPassword.length < 1) {
      return NextResponse.json({ error: "Password tidak boleh kosong" }, { status: 400 });
    }
    if (newPassword.length > 10) {
      return NextResponse.json({ error: "Password maksimal 10 karakter" }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9]+$/.test(newPassword)) {
      return NextResponse.json({ error: "Password hanya boleh huruf (besar/kecil) dan angka" }, { status: 400 });
    }

    // Verify the HMAC-signed reset token issued by /api/auth/verify-code
    if (typeof resetToken !== "string" || !(await verifyResetToken(resetToken))) {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 400 });
    }

    const content = await getContent();

    // Reject if no reset flow is active (token already consumed)
    if (!content.admin.resetCode) {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 400 });
    }

    content.admin.password = await hashPassword(newPassword);
    content.admin.resetCode = null;
    content.admin.resetExpiry = null;
    await saveContent(content);

    return NextResponse.json({ success: true, message: "Password berhasil diubah!" });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
