import type { Env } from "./types";

// Ordinary inquiry records expire one year after their last contact/update.
// Confirmed reservations retain related records for five years.
export async function purgeExpired(env: Env, now = Date.now()) {
  if (env.RETENTION_ENABLED !== "true") return;
  const cutoff = (years: number) => {
    const date = new Date(now);
    date.setUTCFullYear(date.getUTCFullYear() - years);
    return date.getTime();
  };
  const booked =
    "(status='booked' OR EXISTS(SELECT 1 FROM audit_events a WHERE a.inquiry_id=inquiries.id AND a.action LIKE 'status:booked;%'))";
  const predicate = `((NOT ${booked} AND updated_at<?) OR (${booked} AND updated_at<?))`;
  const params = [cutoff(1), cutoff(5)];
  const { results } = await env.DB.prepare(
    `SELECT id,updated_at,version FROM inquiries WHERE ${predicate} ORDER BY updated_at LIMIT 1`,
  )
    .bind(...params)
    .all<{ id: string; updated_at: number; version: number }>();
  for (const record of results) {
    // Every statement checks the same version so concurrent staff edits keep all data.
    const ids =
      "SELECT id FROM inquiries WHERE id=? AND version=? AND updated_at=?";
    const args = [record.id, record.version, record.updated_at];
    await env.DB.batch([
      ...["notifications", "alimtalk_jobs", "audit_events"].map((table) =>
        env.DB.prepare(
          `DELETE FROM ${table} WHERE inquiry_id IN (${ids})`,
        ).bind(...args),
      ),
      env.DB.prepare(
        "DELETE FROM inquiries WHERE id=? AND version=? AND updated_at=?",
      ).bind(...args),
    ]);
  }
  await env.DB.prepare("DELETE FROM rate_limits WHERE expires_at<?")
    .bind(now)
    .run();
}
