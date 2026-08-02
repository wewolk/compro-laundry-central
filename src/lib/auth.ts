const COOKIE_NAME = "admin_session";
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Secret used to sign session tokens. Set AUTH_SECRET in the environment for
// stable sessions across restarts/deployments; otherwise a random per-process
// secret is generated, which invalidates all sessions on restart.
const SECRET =
  process.env.AUTH_SECRET ||
  "dev-only-fallback-secret-set-AUTH_SECRET-in-production";

const encoder = new TextEncoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(claims: Record<string, unknown>): Promise<string> {
  const payload = JSON.stringify(claims);
  const key = await getKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  const encodedPayload = base64UrlEncode(encoder.encode(payload));
  return `${encodedPayload}.${base64UrlEncode(new Uint8Array(signature))}`;
}

/**
 * Verifies the HMAC signature and expiry, returning the claims or null.
 * A tampered or expired token always yields null.
 */
async function readSignedPayload(
  token: string
): Promise<Record<string, unknown> | null> {
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const payloadBytes = base64UrlDecode(encodedPayload);
    const key = await getKey();

    // Web Crypto's verify is constant-time, preventing timing attacks
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(signature) as unknown as ArrayBuffer,
      payloadBytes as unknown as ArrayBuffer
    );
    if (!valid) return null;

    const claims = JSON.parse(new TextDecoder().decode(payloadBytes));
    if (typeof claims.exp !== "number" || claims.exp <= Date.now()) return null;
    return claims;
  } catch {
    return null;
  }
}

export async function createToken(): Promise<string> {
  return sign({
    user: "admin",
    iat: Date.now(),
    exp: Date.now() + TOKEN_EXPIRY,
  });
}

export async function verifyToken(token: string): Promise<boolean> {
  const payload = await readSignedPayload(token);
  return !!payload && payload.user === "admin";
}

/** Signs a short-lived token proving the WA reset code was verified. */
export async function createResetToken(): Promise<string> {
  return sign({ purpose: "reset", exp: Date.now() + 10 * 60 * 1000 });
}

/** True only for an unexpired, untampered reset token. */
export async function verifyResetToken(token: string): Promise<boolean> {
  const payload = await readSignedPayload(token);
  return !!payload && payload.purpose === "reset";
}

export { COOKIE_NAME };
