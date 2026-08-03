import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { getImageKit, isImageKitConfigured } from "@/lib/imagekit";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
/** Route-handler bodies are capped by the platform, so this is the server path only. */
const MAX_VIDEO_BYTES = 4 * 1024 * 1024;

async function isAuthed(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return !!token && (await verifyToken(token));
}

function notConfigured() {
  return NextResponse.json(
    {
      error:
        "ImageKit belum dikonfigurasi. Set IMAGEKIT_PUBLIC_KEY dan IMAGEKIT_PRIVATE_KEY.",
    },
    { status: 500 }
  );
}

/**
 * Signed upload credentials for the browser. Videos are far larger than the
 * serverless request body limit, so the admin panel uploads straight to
 * ImageKit and only asks this endpoint to authorise it.
 */
export async function GET(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isImageKitConfigured()) return notConfigured();

  try {
    const auth = getImageKit().getAuthenticationParameters();
    return NextResponse.json(
      { ...auth, publicKey: process.env.IMAGEKIT_PUBLIC_KEY },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gagal membuat izin upload";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Server-side upload fallback, used when direct upload isn't available. */
export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthed(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isImageKitConfigured()) return notConfigured();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
    }

    const isImage = IMAGE_TYPES.includes(file.type);
    const isVideo = VIDEO_TYPES.includes(file.type);
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: "Tipe file tidak didukung" }, { status: 400 });
    }

    const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > limit) {
      return NextResponse.json(
        {
          error: `Ukuran file maksimal ${Math.round(limit / (1024 * 1024))}MB`,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || (isVideo ? "mp4" : "jpg");
    const filename = `${isVideo ? "vid" : "img"}_${Date.now()}.${ext}`;

    const uploaded = await getImageKit().upload({
      file: buffer,
      fileName: filename,
      folder: isVideo ? "/central-laundry/video" : "/central-laundry",
      useUniqueFileName: true,
    });

    return NextResponse.json({
      success: true,
      url: uploaded.url,
      filename: uploaded.name,
      fileId: uploaded.fileId,
      thumbnailUrl: uploaded.thumbnailUrl,
      type: isVideo ? "video" : "image",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gagal upload file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
