// Local-only preview entry. Production config must always use index.ts.
// No customer data or external email sends are permitted here.
import { app } from "./app";
const local = app({
  admin: async () => "local-preview@example.invalid",
  captcha: async () => true,
  send: async () => {
    throw new Error("mail_not_configured");
  },
});
export default {
  async fetch(
    request: Request,
    env: Parameters<typeof local.fetch>[1],
    ctx: ExecutionContext,
  ) {
    const url = new URL(request.url);
    if (!["127.0.0.1", "localhost"].includes(url.hostname))
      return new Response("Local preview only", { status: 403 });
    return local.fetch(
      request,
      { ...env, RATE_SALT: "local-only-not-a-secret" },
      ctx,
    );
  },
};
