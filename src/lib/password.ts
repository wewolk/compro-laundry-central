// Password hashing using PBKDF2 via Web Crypto (Edge/Node compatible).
// Stored format: pbkdf2$<iterations>$<saltBase64>$<hashBase64>

const ITERATIONS = 100_000;
const KEY_LENGTH = 32; // bytes
const PREFIX = "pbkdf2";

const encoder = new TextEncoder();

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

async function derive(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as unknown as ArrayBuffer,
      iterations,
      hash: "SHA-256",
    },
    key,
    KEY_LENGTH * 8
  );
  return new Uint8Array(bits);
}

/** True if the stored value is already a PBKDF2 hash (not legacy plaintext). */
export function isHashed(stored: string): boolean {
  return stored.startsWith(`${PREFIX}$`);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, ITERATIONS);
  return `${PREFIX}$${ITERATIONS}$${toBase64(salt)}$${toBase64(hash)}`;
}

/**
 * Verifies a password against a stored value.
 * Legacy plaintext values are compared directly so existing installs keep
 * working; callers should re-hash after a successful legacy match.
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  if (!isHashed(stored)) {
    // Legacy plaintext comparison (constant-time-ish on equal lengths)
    if (password.length !== stored.length) return false;
    let diff = 0;
    for (let i = 0; i < password.length; i++) {
      diff |= password.charCodeAt(i) ^ stored.charCodeAt(i);
    }
    return diff === 0;
  }

  const [, iterationsRaw, saltRaw, hashRaw] = stored.split("$");
  const iterations = Number(iterationsRaw);
  if (!iterations || !saltRaw || !hashRaw) return false;

  const expected = fromBase64(hashRaw);
  const actual = await derive(password, fromBase64(saltRaw), iterations);
  if (expected.length !== actual.length) return false;

  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ actual[i];
  return diff === 0;
}
