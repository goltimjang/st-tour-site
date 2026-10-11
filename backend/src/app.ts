import { csv, HttpError, statuses, type Dependencies, type Env } from "./types";
import { hash } from "./security";
import { readJson, validate } from "./validation";
import { drain } from "./notifications";
import { purgeExpired } from "./retention";
import { mailTest } from "./mail-test";
import { drainAlimtalk } from "./alimtalk";
import { ownerTestReady, ownerTestInput, ownerTestPage } from "./owner-test";
async function drainAll(env: Env, deps: Dependencies, onlyId = "") {
  await Promise.allSettled([
    drain(env, deps, onlyId),
    drainAlimtalk(env, deps.sendAlimtalk, onlyId),
  ]);
}
const json = (data: unknown, status = 200) => Response.json(data, { status });
const secureHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex, nofollow",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
};
export function app(deps: Dependencies) {
  return {
    async fetch(
      request: Request,
      env: Env,
      ctx: ExecutionContext,
    ): Promise<Response> {
      const url = new URL(request.url);
      const origin = request.headers.get("Origin") || "";
      const publicRoute = url.pathname === "/v1/inquiries";
      let response: Response;
      try {
        if (publicRoute) {
          if (!csv(env.ALLOWED_ORIGINS).includes(origin))
            throw new HttpError(403, "origin_not_allowed");
          if (request.method === "OPTIONS")
            response = new Response(null, { status: 204 });
          else if (request.method === "POST")
            response = await intake(request, env, deps, ctx);
          else throw new HttpError(405, "method_not_allowed");
        } else if (url.pathname.startsWith("/admin")) {
          const actor = await deps.admin(request, env);
          if (!actor) throw new HttpError(401, "admin_login_required");
          if (
            !["GET", "HEAD"].includes(request.method) &&
            origin !== url.origin
          )
            throw new HttpError(403, "origin_not_allowed");
          if (url.pathname === "/admin/mail-test")
            response = await mailTest(request, env, deps, actor);
          else if (
            url.pathname === "/admin/owner-test" &&
            request.method === "GET"
          )
            response = ownerTestPage();
          else if (url.pathname.startsWith("/admin/api/"))
            response = await adminApi(request, url, env, deps, ctx, actor);
          else if (request.method === "GET" || request.method === "HEAD") {
            if (
              ![
                "/admin/",
                "/admin",
                "/admin/admin.js",
                "/admin/admin.css",
                "/admin/owner-test.js",
                "/admin/mail-test.js",
              ].includes(url.pathname)
            )
              throw new HttpError(404, "not_found");
            const assetURL = new URL(url);
            assetURL.pathname =
              url.pathname === "/admin" || url.pathname === "/admin/"
                ? "/"
                : url.pathname.replace("/admin", "");
            response = await env.ASSETS.fetch(new Request(assetURL, request));
          } else throw new HttpError(405, "method_not_allowed");
        } else if (url.pathname === "/health" && request.method === "GET")
          response = json({ ok: true, service: "st-tour-intake" });
        else throw new HttpError(404, "not_found");
      } catch (e) {
        // Never log payloads, tokens, phone numbers, or database error text.
        const status = e instanceof HttpError ? e.status : 503;
        response = json(
          {
            ok: false,
            error: e instanceof HttpError ? e.code : "temporarily_unavailable",
          },
          status,
        );
      }
      const headers = new Headers(response.headers);
      for (const [k, v] of Object.entries(secureHeaders)) headers.set(k, v);
      if (url.pathname === "/admin/owner-test" && response.ok)
        headers.set(
          "Content-Security-Policy",
          secureHeaders["Content-Security-Policy"].replace(
            "script-src 'self'",
            "script-src 'self' https://challenges.cloudflare.com",
          ) + "; frame-src https://challenges.cloudflare.com",
        );
      if (publicRoute && csv(env.ALLOWED_ORIGINS).includes(origin)) {
        headers.set("Access-Control-Allow-Origin", origin);
        headers.set("Vary", "Origin");
        headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type");
      }
      return new Response(response.body, { status: response.status, headers });
    },
    async scheduled(
      _event: ScheduledController,
      env: Env,
      ctx: ExecutionContext,
    ) {
      ctx.waitUntil(
        (async () => {
          await purgeExpired(env);
          await drainAll(env, deps);
        })(),
      );
    },
  };
}
async function intake(
  request: Request,
  env: Env,
  deps: Dependencies,
  ctx: ExecutionContext,
  ownerTest = false,
) {
  if (env.INTAKE_ENABLED !== "true")
    throw new HttpError(503, "intake_not_enabled");
  const input = validate(await readJson(request));
  const digest = await hash(input.canonical);
  // Stable UUID + content hash lets a timed-out request recover its receipt without reusing a consumed CAPTCHA.
  const existing = await env.DB.prepare(
    "SELECT receipt,content_hash FROM inquiries WHERE request_key=?",
  )
    .bind(input.requestKey)
    .first<{ receipt: string; content_hash: string }>();
  if (existing) {
    if (existing.content_hash !== digest)
      throw new HttpError(409, "request_key_conflict");
    return json({
      ok: true,
      receipt: existing.receipt,
      stored: true,
      duplicate: true,
    });
  }
  if (!env.RATE_SALT) throw new HttpError(503, "intake_not_configured");
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = Date.now();
  const bucket = await hash(
    `${env.RATE_SALT}:${ip}:${Math.floor(now / 600000)}`,
  );
  const rate = await env.DB.prepare(
    "INSERT INTO rate_limits(bucket,count,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1 RETURNING count",
  )
    .bind(bucket, now + 1200000)
    .first<{ count: number }>();
  if (!rate || rate.count > 20) throw new HttpError(429, "try_again_later");
  if (!(await deps.captcha(input.token, request, env)))
    throw new HttpError(400, "verification_required");
  const id = crypto.randomUUID();
  const date = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  const receipt = `ST-${date.replaceAll("-", "")}-${id.replaceAll("-", "").slice(0, 12).toUpperCase()}`;
  try {
    // One transaction: either both the inquiry and its durable notification job exist, or neither exists.
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO inquiries(id,receipt,request_key,content_hash,kind,name,phone,email,payload,consent_version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`,
      ).bind(
        id,
        receipt,
        input.requestKey,
        digest,
        input.kind,
        input.name,
        input.phone,
        input.email,
        JSON.stringify(input.payload),
        input.consentVersion,
        now,
        now,
      ),
      env.DB.prepare(
        "INSERT INTO notifications(inquiry_id,next_at,updated_at) VALUES(?,?,?)",
      ).bind(id, now, now),
      ...(env.ALIMTALK_ENABLED === "true" &&
      deps.sendAlimtalk &&
      input.kind === "tour"
        ? [
            env.DB.prepare(
              "INSERT INTO alimtalk_jobs(inquiry_id,template_key,created_at,updated_at) VALUES(?,'tour_received_v1',?,?)",
            ).bind(id, now, now),
          ]
        : []),
    ]);
  } catch (error) {
    const duplicate = await env.DB.prepare(
      "SELECT receipt,content_hash FROM inquiries WHERE request_key=?",
    )
      .bind(input.requestKey)
      .first<{ receipt: string; content_hash: string }>();
    if (duplicate) {
      if (duplicate.content_hash !== digest)
        throw new HttpError(409, "request_key_conflict");
      return json({
        ok: true,
        receipt: duplicate.receipt,
        stored: true,
        duplicate: true,
      });
    }
    throw error;
  }
  ctx.waitUntil(drainAll(env, deps, ownerTest ? id : ""));
  return json({ ok: true, receipt, stored: true }, 201);
}
async function adminApi(
  request: Request,
  url: URL,
  env: Env,
  deps: Dependencies,
  ctx: ExecutionContext,
  actor: string,
) {
  if (url.pathname === "/admin/api/owner-test") {
    ownerTestReady(env);
    if (request.method === "GET") {
      const existing = await env.DB.prepare(
        "SELECT receipt FROM inquiries WHERE request_key=?",
      )
        .bind(env.TEST_REQUEST_KEY)
        .first<{ receipt: string }>();
      return json({
        siteKey: env.TURNSTILE_SITE_KEY,
        recipient: `010-****-${env.TEST_PHONE!.slice(-4)}`,
        mailTo: env.MAIL_TO,
        receipt: existing?.receipt || null,
      });
    }
    if (request.method !== "POST")
      throw new HttpError(405, "method_not_allowed");
    if (!deps.sendAlimtalk)
      throw new HttpError(503, "owner_test_not_configured");
    const body = await readJson(request);
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new HttpError(400, "invalid_inquiry");
    const testRequest = new Request(request.url, {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify(ownerTestInput(env, body)),
    });
    return intake(
      testRequest,
      { ...env, INTAKE_ENABLED: "true", ALIMTALK_ENABLED: "true" },
      deps,
      ctx,
      true,
    );
  }
  if (url.pathname === "/admin/api/inquiries" && request.method === "GET") {
    const status = url.searchParams.get("status") || "";
    if (status && !statuses.includes(status))
      throw new HttpError(400, "invalid_status");
    const offset = Number(url.searchParams.get("offset") || 0);
    if (!Number.isSafeInteger(offset) || offset < 0 || offset > 100000)
      throw new HttpError(400, "invalid_offset");
    const rows = await env.DB.prepare(
      `SELECT i.id,i.receipt,i.kind,i.name,i.created_at,i.status,i.version,json_extract(i.payload,'$.지역') AS region,json_extract(i.payload,'$.골프장') AS course,n.status AS notification,n.error_code FROM inquiries i LEFT JOIN notifications n ON n.inquiry_id=i.id WHERE (?='' OR i.status=?) ORDER BY i.created_at DESC,i.id DESC LIMIT 26 OFFSET ?`,
    )
      .bind(status, status, offset)
      .all();
    const counts = await env.DB.prepare(
      "SELECT status,COUNT(*) AS count FROM inquiries GROUP BY status",
    ).all();
    const alerts = await env.DB.prepare(
      "SELECT COUNT(*) AS count FROM inquiries i WHERE EXISTS (SELECT 1 FROM notifications n WHERE n.inquiry_id=i.id AND (n.status IN ('retry','failed','blocked') OR (n.status='processing' AND n.lease_until<?))) OR EXISTS (SELECT 1 FROM alimtalk_jobs a WHERE a.inquiry_id=i.id AND a.status IN ('blocked','failed','unknown'))",
    )
      .bind(Date.now())
      .first();
    return json({
      items: rows.results.slice(0, 25),
      hasMore: rows.results.length > 25,
      counts: counts.results,
      alerts,
    });
  }
  const match = url.pathname.match(
    /^\/admin\/api\/inquiries\/([a-f0-9-]{36})(\/retry)?$/,
  );
  if (!match) throw new HttpError(404, "not_found");
  const id = match[1];
  if (request.method === "GET" && !match[2]) {
    const record = await env.DB.prepare("SELECT * FROM inquiries WHERE id=?")
      .bind(id)
      .first();
    if (!record) throw new HttpError(404, "not_found");
    const notification = await env.DB.prepare(
      "SELECT status,attempts,provider_id,error_code,updated_at,next_at FROM notifications WHERE inquiry_id=?",
    )
      .bind(id)
      .first();
    const audit = await env.DB.prepare(
      "SELECT actor,action,created_at FROM audit_events WHERE inquiry_id=? ORDER BY id DESC LIMIT 20",
    )
      .bind(id)
      .all();
    // Request keys and content hashes never leave the backend.
    const { request_key, content_hash, ...inquiry } = record;
    const alimtalk = await env.DB.prepare(
      "SELECT status,attempts,provider_group_id,error_code,updated_at FROM alimtalk_jobs WHERE inquiry_id=?",
    )
      .bind(id)
      .first();
    return json({ inquiry, notification, alimtalk, audit: audit.results });
  }
  if (request.method === "PATCH" && !match[2]) {
    const b = await readJson(request);
    if (
      !statuses.includes(b?.status) ||
      typeof b.note !== "string" ||
      b.note.length > 2000 ||
      !Number.isSafeInteger(b.version)
    )
      throw new HttpError(400, "invalid_update");
    const now = Date.now();
    const result = await env.DB.batch([
      env.DB.prepare(
        "UPDATE inquiries SET status=?,note=?,version=version+1,updated_at=? WHERE id=? AND version=? RETURNING id",
      ).bind(b.status, b.note, now, id, b.version),
      env.DB.prepare(
        "INSERT INTO audit_events(inquiry_id,actor,action,created_at) SELECT ?,?,?,? WHERE changes()=1",
      ).bind(id, actor, `status:${b.status};note_updated`, now),
    ]);
    if (!result[0].results.length)
      throw new HttpError(409, "updated_elsewhere");
    return json({ ok: true });
  }
  if (request.method === "POST" && match[2]) {
    const now = Date.now();
    // After provider's 24h idempotency window, do not automatically risk a duplicate email.
    const result = await env.DB.batch([
      env.DB.prepare(
        "UPDATE notifications SET status='pending',next_at=?,error_code=NULL,updated_at=? WHERE inquiry_id=? AND status IN ('retry','failed','blocked') AND attempts<5 AND (first_attempt_at IS NULL OR first_attempt_at>?) RETURNING inquiry_id",
      ).bind(now, now, id, now - 23 * 3600000),
      env.DB.prepare(
        "INSERT INTO audit_events(inquiry_id,actor,action,created_at) SELECT ?,?,'retry_requested',? WHERE changes()=1",
      ).bind(id, actor, now),
    ]);
    if (!result[0].results.length)
      throw new HttpError(409, "retry_requires_review");
    ctx.waitUntil(drain(env, deps));
    return json({ ok: true });
  }
  throw new HttpError(405, "method_not_allowed");
}
