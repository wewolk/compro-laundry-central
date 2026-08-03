"use client";

/**
 * Client-side media helpers: image compression + direct-to-ImageKit upload.
 *
 * Uploads go straight from the browser to ImageKit (signed by /api/upload)
 * instead of through the Next.js route handler, so videos aren't capped by the
 * serverless request body limit (~4.5MB on Vercel).
 */

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

/** Post-compression cap for images. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
/** Videos are uploaded as-is; ImageKit rejects anything larger anyway. */
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export type MediaKind = "image" | "video";

export interface UploadResult {
  url: string;
  fileId: string;
  name: string;
  /** Poster frame for videos, served by ImageKit's thumbnail endpoint. */
  thumbnailUrl?: string;
}

interface CompressOptions {
  /** Longest edge of the output, in pixels. */
  maxDimension?: number;
  quality?: number;
}

export function detectKind(file: File): MediaKind | null {
  if (IMAGE_TYPES.includes(file.type)) return "image";
  if (VIDEO_TYPES.includes(file.type)) return "video";
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Downscales and re-encodes an image to WebP in the browser.
 * Animated GIFs are left alone (canvas would flatten them to one frame), and
 * the original is kept whenever compression fails to make the file smaller.
 */
export async function compressImage(
  file: File,
  { maxDimension = 1920, quality = 0.82 }: CompressOptions = {}
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp", lastModified: Date.now() });
  } finally {
    bitmap.close();
  }
}

interface AuthParams {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
}

async function getUploadAuth(): Promise<AuthParams> {
  const res = await fetch("/api/upload", { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal mengambil izin upload");
  return data as AuthParams;
}

/** Direct browser → ImageKit upload with progress reporting. */
function uploadDirect(
  file: File,
  auth: AuthParams,
  folder: string,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    form.append("fileName", file.name);
    form.append("folder", folder);
    form.append("useUniqueFileName", "true");
    form.append("publicKey", auth.publicKey);
    form.append("signature", auth.signature);
    form.append("expire", String(auth.expire));
    form.append("token", auth.token);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            url: data.url,
            fileId: data.fileId,
            name: data.name,
            thumbnailUrl: data.thumbnailUrl,
          });
        } else {
          reject(new Error(data.message || `Upload gagal (${xhr.status})`));
        }
      } catch {
        reject(new Error("Respons upload tidak valid"));
      }
    };
    xhr.onerror = () => reject(new Error("Koneksi terputus saat upload"));
    xhr.onabort = () => reject(new Error("Upload dibatalkan"));

    xhr.send(form);
  });
}

export interface UploadMediaOptions {
  onProgress?: (percent: number) => void;
  folder?: string;
}

/**
 * Validates, compresses (images only), and uploads a file to ImageKit.
 * Throws with a user-facing Indonesian message on any rejection.
 */
export async function uploadMedia(
  file: File,
  { onProgress, folder = "/central-laundry" }: UploadMediaOptions = {}
): Promise<UploadResult & { kind: MediaKind }> {
  const kind = detectKind(file);
  if (!kind) {
    throw new Error("Tipe file tidak didukung. Gunakan JPG/PNG/WebP/GIF atau MP4/WebM/MOV.");
  }

  if (kind === "video" && file.size > MAX_VIDEO_BYTES) {
    throw new Error(
      `Video maksimal ${formatBytes(MAX_VIDEO_BYTES)} — ukuran file ${formatBytes(file.size)}.`
    );
  }

  const prepared = kind === "image" ? await compressImage(file) : file;

  if (kind === "image" && prepared.size > MAX_IMAGE_BYTES) {
    throw new Error(
      `Foto masih ${formatBytes(prepared.size)} setelah dikompres, maksimal ${formatBytes(MAX_IMAGE_BYTES)}.`
    );
  }

  const auth = await getUploadAuth();
  const result = await uploadDirect(
    prepared,
    auth,
    kind === "video" ? `${folder}/video` : folder,
    onProgress
  );

  return { ...result, kind };
}

/** ImageKit serves a poster frame for any uploaded video at this path. */
export function videoPoster(url: string): string {
  return `${url}/ik-thumbnail.jpg`;
}
