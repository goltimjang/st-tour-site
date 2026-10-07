export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  ALLOWED_ORIGINS: string;
  ADMIN_ORIGIN: string;
  TURNSTILE_HOSTNAMES: string;
  TURNSTILE_SECRET: string;
  ACCESS_ISSUER: string;
  ACCESS_AUDIENCE: string;
  ADMIN_EMAILS: string;
  RATE_SALT: string;
  RESEND_API_KEY?: string;
  MAIL_FROM: string;
  MAIL_TO: string;
}
export interface Dependencies {
  admin(request: Request, env: Env): Promise<string | null>;
  captcha(token: string, request: Request, env: Env): Promise<boolean>;
  send(env: Env, receipt: string, key: string): Promise<{ id: string }>;
}
export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
export const statuses = [
  "new",
  "consulting",
  "quoted",
  "booked",
  "closed",
  "review",
];
export const csv = (value = "") =>
  value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
