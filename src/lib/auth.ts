const COOKIE_NAME = "admin_session";
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export function createToken(): string {
  const payload = {
    user: "admin",
    exp: Date.now() + TOKEN_EXPIRY,
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function verifyToken(token: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
