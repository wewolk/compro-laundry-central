import ImageKit from "imagekit";

export const IMAGEKIT_URL_ENDPOINT =
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
  "https://ik.imagekit.io/cloyptjl8";

let client: ImageKit | null = null;

/** Server-side ImageKit client. Throws if the keys aren't configured. */
export function getImageKit(): ImageKit {
  if (client) return client;

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    throw new Error(
      "IMAGEKIT_PUBLIC_KEY / IMAGEKIT_PRIVATE_KEY belum diset (cek .env.local)"
    );
  }

  client = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
  });
  return client;
}

export function isImageKitConfigured(): boolean {
  return !!(process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY);
}
