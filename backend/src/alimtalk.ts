import type { Env } from "./types";

// Only the template verified as approved on 2026-10-11 is allowed here.
export const TOUR_TEMPLATE = "KA01TP261001093029785w7gQUNn1jJz";
export const TOUR_CHANNEL = "KA01PF261001092819617mb3FHOSOk2i";
export type AlimtalkJob = { id: string; receipt: string; phone: string };
export type AlimtalkResult = { groupId: string };
export class AlimtalkError extends Error {
  constructor(
    public state: "blocked" | "failed" | "unknown",
    code: string,
  ) {
    super(code);
  }
}
export async function solapiAuthorization(key: string, secret: string) {
  const date = new Date().toISOString();
  const salt = crypto.randomUUID().replaceAll("-", "");
  const encoder = new TextEncoder();
  const hmac = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const bytes = await crypto.subtle.sign(
    "HMAC",
    hmac,
    encoder.encode(date + salt),
  );
  const signature = Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
  return `HMAC-SHA256 apiKey=${key}, date=${date}, salt=${salt}, signature=${signature}`;
}
export async function sendAlimtalk(
  env: Env,
  job: AlimtalkJob,
  transport: typeof fetch = fetch,
): Promise<AlimtalkResult> {
  if (
    env.ALIMTALK_ENABLED !== "true" ||
    !env.SOLAPI_API_KEY ||
    !env.SOLAPI_API_SECRET
  )
    throw new AlimtalkError("blocked", "alimtalk_not_configured");
  if (
    !/^010\d{8}$/.test(job.phone) ||
    !/^ST-\d{8}-[A-F0-9]{12}$/.test(job.receipt)
  )
    throw new AlimtalkError("failed", "alimtalk_invalid_recipient");
  let response: Response;
  try {
    response = await transport(
      "https://api.solapi.com/messages/v4/send-many/detail",
      {
        method: "POST",
        headers: {
          Authorization: await solapiAuthorization(
            env.SOLAPI_API_KEY,
            env.SOLAPI_API_SECRET,
          ),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              to: job.phone,
              country: "82",
              type: "ATA",
              kakaoOptions: {
                pfId: TOUR_CHANNEL,
                templateId: TOUR_TEMPLATE,
                disableSms: true,
                variables: { "#{접수번호}": job.receipt },
              },
              customFields: { inquiryId: job.id },
            },
          ],
          strict: true,
          allowDuplicates: false,
          showMessageList: false,
        }),
        signal: AbortSignal.timeout(10000),
      },
    );
  } catch {
    throw new AlimtalkError("unknown", "alimtalk_response_unknown");
  }
  if (!response.ok) {
    // Never retry ambiguous sends automatically: allowDuplicates is not a request idempotency key.
    throw new AlimtalkError(
      response.status >= 500 || response.status === 408 ? "unknown" : "failed",
      "alimtalk_provider_error",
    );
  }
  let data: {
    groupInfo?: { groupId?: string; count?: { registeredSuccess?: number } };
    failedMessageList?: unknown[];
  };
  try {
    data = await response.json();
  } catch {
    throw new AlimtalkError("unknown", "alimtalk_response_unknown");
  }
  if (data.failedMessageList?.length)
    throw new AlimtalkError("failed", "alimtalk_rejected");
  if (!data.groupInfo?.groupId || data.groupInfo.count?.registeredSuccess !== 1)
    throw new AlimtalkError("unknown", "alimtalk_response_unknown");
  // API acceptance is not delivery. Provider log reconciliation is required.
  return { groupId: data.groupInfo.groupId };
}
export async function drainAlimtalk(
  env: Env,
  send?: (env: Env, job: AlimtalkJob) => Promise<AlimtalkResult>,
  onlyId = "",
) {
  if (env.ALIMTALK_ENABLED !== "true" || !send) return;
  const now = Date.now();
  // A crashed worker might already have sent. Do not reclaim and resend.
  await env.DB.prepare(
    "UPDATE alimtalk_jobs SET status='unknown',error_code='alimtalk_response_unknown',updated_at=? WHERE status='processing' AND lease_until<=? AND (?='' OR inquiry_id=?)",
  )
    .bind(now, now, onlyId, onlyId)
    .run();
  // Do not surprise customers with old receipt alerts after delayed configuration.
  await env.DB.prepare(
    "UPDATE alimtalk_jobs SET status='failed',error_code='alimtalk_expired',updated_at=? WHERE status IN ('pending','blocked') AND created_at<? AND (?='' OR inquiry_id=?)",
  )
    .bind(now, now - 3600000, onlyId, onlyId)
    .run();
  if (!env.SOLAPI_API_KEY || !env.SOLAPI_API_SECRET) {
    await env.DB.prepare(
      "UPDATE alimtalk_jobs SET status='blocked',error_code='alimtalk_not_configured',updated_at=? WHERE status='pending' AND (?='' OR inquiry_id=?)",
    )
      .bind(now, onlyId, onlyId)
      .run();
    return;
  }
  const { results } = await env.DB.prepare(
    "SELECT inquiry_id FROM alimtalk_jobs WHERE status IN ('pending','blocked') AND (?='' OR inquiry_id=?) ORDER BY created_at LIMIT 4",
  )
    .bind(onlyId, onlyId)
    .all<{ inquiry_id: string }>();
  for (const { inquiry_id: id } of results) {
    const token = crypto.randomUUID();
    const claim = await env.DB.prepare(
      "UPDATE alimtalk_jobs SET status='processing',attempts=attempts+1,lease_token=?,lease_until=?,updated_at=? WHERE inquiry_id=? AND status IN ('pending','blocked') AND attempts=0 RETURNING inquiry_id",
    )
      .bind(token, now + 120000, now, id)
      .first();
    if (!claim) continue;
    let status = "unknown",
      code: string | null = null,
      group: string | null = null;
    try {
      const job = await env.DB.prepare(
        "SELECT id,receipt,phone FROM inquiries WHERE id=? AND kind='tour'",
      )
        .bind(id)
        .first<AlimtalkJob>();
      if (!job) throw new AlimtalkError("failed", "alimtalk_inquiry_missing");
      group = (await send(env, job)).groupId;
      status = "accepted";
    } catch (error) {
      status = error instanceof AlimtalkError ? error.state : "unknown";
      code =
        error instanceof AlimtalkError
          ? error.message
          : "alimtalk_response_unknown";
    }
    await env.DB.prepare(
      "UPDATE alimtalk_jobs SET status=?,error_code=?,provider_group_id=?,lease_token=NULL,lease_until=0,updated_at=? WHERE inquiry_id=? AND lease_token=? AND status='processing'",
    )
      .bind(status, code, group, Date.now(), id, token)
      .run();
  }
}
