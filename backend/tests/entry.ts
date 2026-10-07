import { app } from "../src/app";
import { admin } from "../src/security";
import { drain } from "../src/notifications";
import type { Dependencies, Env } from "../src/types";
const deps: Dependencies = {
  admin: async (request) =>
    request.headers.get("X-Test-Admin") === "allowed"
      ? "test-admin@example.invalid"
      : null,
  captcha: async (token) => token === "test-valid-token",
  send: async (env, receipt, key) => {
    const mode = await env.DB.prepare(
      "SELECT mode FROM test_mail LIMIT 1",
    ).first<{ mode: string }>();
    if (mode?.mode === "blocked") throw new Error("mail_not_configured");
    if (mode?.mode === "fail") throw new Error("mail_temporary_error");
    await env.DB.prepare(
      "INSERT OR IGNORE INTO test_sent(key,receipt) VALUES(?,?)",
    )
      .bind(key, receipt)
      .run();
    return { id: "mock-" + key };
  },
};
const handler = app(deps);
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const path = new URL(request.url).pathname;
    if (path === "/__test/drain") {
      await drain(env, deps);
      return new Response("ok");
    }
    if (path === "/__test/production-auth") {
      return new Response(String(await admin(request, env)));
    }
    return handler.fetch(request, env, ctx);
  },
};
