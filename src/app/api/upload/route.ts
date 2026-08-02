import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { getImageKit, isImageKitConfigured } from "@/lib/imagekit";

export async function POST(request: NextRequest) {
  try {
    // Verify auth
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isImageKitConfigured()) {
      return NextResponse.json(
        {
          error:
            "ImageKit belum dikonfigurasi. Set IMAGEKIT_PUBLIC_KEY dan IMAGEKIT_PRIVATE_KEY.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipe file tidak didukung" }, { status: 400 });
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `img_${Date.now()}.${ext}`;

    const uploaded = await getImageKit().upload({
      file: buffer,
      fileName: filename,
      folder: "/central-laundry",
      useUniqueFileName: true,
    });

    return NextResponse.json({
      success: true,
      url: uploaded.url,
      filename: uploaded.name,
      fileId: uploaded.fileId,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gagal upload file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
