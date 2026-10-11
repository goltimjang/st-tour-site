import { app } from "../src/app";
import { admin } from "../src/security";
import { drain } from "../src/notifications";
import type { Dependencies, Env } from "../src/types";
const deps: Dependencies = {
  sendAlimtalk: async () => ({ groupId: "MOCK-GROUP" }),
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
    if (
      path === "/admin/api/owner-test" &&
      request.headers.has("X-Test-Owner-Mode")
    ) {
      const mode = request.headers.get("X-Test-Owner-Mode");
      return handler.fetch(
        request,
        {
          ...env,
          INTAKE_ENABLED: "false",
          ALIMTALK_ENABLED: "false",
          TEST_INTAKE_ENABLED: mode === "disabled" ? "false" : "true",
          TEST_EXPIRES_AT: new Date(
            Date.now() + (mode === "expired" ? -1000 : 3600000),
          ).toISOString(),
          TEST_REQUEST_KEY: "4cdba823-ed2a-40d8-b214-9dd929952efe",
          TEST_PHONE: "01000000000",
          TURNSTILE_SITE_KEY: "mock-public-key",
          TURNSTILE_SECRET: "mock-secret",
          RESEND_API_KEY: mode === "unconfigured" ? "" : "mock-mail-key",
          MAIL_FROM: "test@example.invalid",
          MAIL_TO: "goltimjang@gmail.com",
        },
        ctx,
      );
    }
    if (path === "/__test/intake-disabled") {
      return handler.fetch(
        new Request("https://backend.example/v1/inquiries", request),
        { ...env, INTAKE_ENABLED: "false" },
        ctx,
      );
    }
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
