import { createRemoteJWKSet, jwtVerify } from "jose";
import { csv, type Env } from "./types";
const keys = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
export async function admin(
  request: Request,
  env: Env,
): Promise<string | null> {
  if (
    !/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(
      env.ACCESS_ISSUER || "",
    ) ||
    !env.ACCESS_AUDIENCE
  )
    return null;
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return null;
  try {
    let key = keys.get(env.ACCESS_ISSUER);
    if (!key) {
      key = createRemoteJWKSet(
        new URL(`${env.ACCESS_ISSUER}/cdn-cgi/access/certs`),
      );
      keys.set(env.ACCESS_ISSUER, key);
    }
    const { payload } = await jwtVerify(token, key, {
      issuer: env.ACCESS_ISSUER,
      audience: env.ACCESS_AUDIENCE,
      algorithms: ["RS256"],
      requiredClaims: ["exp", "iat", "email", "sub"],
    });
    return typeof payload.email === "string" &&
      csv(env.ADMIN_EMAILS).includes(payload.email.toLowerCase())
      ? payload.email.toLowerCase()
      : null;
  } catch {
    return null;
  }
}
export async function captcha(token: string, request: Request, env: Env) {
  if (!env.TURNSTILE_SECRET || !token) return false;
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: request.headers.get("CF-Connecting-IP") || undefined,
      }),
      signal: AbortSignal.timeout(10000),
    },
  );
  const data = (await res.json()) as {
    success?: boolean;
    hostname?: string;
    action?: string;
  };
  return (
    res.ok &&
    data.success === true &&
    data.action === "inquiry" &&
    csv(env.TURNSTILE_HOSTNAMES).includes(data.hostname || "")
  );
}
export async function hash(value: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(bytes), (x) =>
    x.toString(16).padStart(2, "0"),
  ).join("");
}
