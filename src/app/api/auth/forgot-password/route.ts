import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/data";

export async function POST() {
  try {
    const content = await getContent();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000;

    content.admin.resetCode = code;
    content.admin.resetExpiry = expiry;
    await saveContent(content);

    // Build wa.me link with code
    const waLink = content.settings.waLink;
    const phoneMatch = waLink.match(/wa\.me\/([0-9]+)/);
    const phone = phoneMatch ? phoneMatch[1] : "6285181840082";
    const msg = encodeURIComponent(
      `Kode Verifikasi Reset Password Admin\n\nKode: ${code}\n\nBerlaku 5 menit. Jangan bagikan!`
    );
    const resetWaLink = `https://wa.me/${phone}?text=${msg}`;

    return NextResponse.json({ success: true, waLink: resetWaLink, expiresIn: 300 });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
