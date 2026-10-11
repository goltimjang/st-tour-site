export interface Env {
  INTAKE_ENABLED?: string;
  RETENTION_ENABLED?: string;
  // A single, owner-approved live test. Never enables the public intake route.
  TEST_INTAKE_ENABLED?: string;
  TEST_EXPIRES_AT?: string;
  TEST_REQUEST_KEY?: string;
  TEST_PHONE?: string;
  MAIL_TEST_EXPIRES_AT?: string;
  TURNSTILE_SITE_KEY?: string;
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
  ALIMTALK_ENABLED?: string;
  SOLAPI_API_KEY?: string;
  SOLAPI_API_SECRET?: string;
  RESEND_API_KEY?: string;
  MAIL_FROM: string;
  MAIL_TO: string;
}
export interface Dependencies {
  sendAlimtalk?: (
    env: Env,
    job: import("./alimtalk").AlimtalkJob,
  ) => Promise<import("./alimtalk").AlimtalkResult>;
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
