import fs from "node:fs";
const config = JSON.parse(fs.readFileSync("wrangler.jsonc", "utf8"));
const fail = (message) => {
  console.error("Deployment blocked: " + message);
  process.exit(1);
};
if (config.main !== "src/index.ts")
  fail("Production entry must use verified Access JWTs and Turnstile.");
if (!/^[0-9a-f-]{36}$/.test(config.d1_databases?.[0]?.database_id || ""))
  fail("Set a dedicated production D1 database ID.");
for (const key of [
  "ACCESS_ISSUER",
  "ACCESS_AUDIENCE",
  "ADMIN_EMAILS",
  "ADMIN_ORIGIN",
  "TURNSTILE_HOSTNAMES",
  "MAIL_FROM",
  "MAIL_TO",
])
  if (!config.vars?.[key]) fail("Missing " + key);
if (!config.assets?.run_worker_first)
  fail("All admin assets must pass through Worker authentication.");
if (config.workers_dev !== false || config.preview_urls !== false)
  fail("Public preview routes must remain disabled.");
if (!config.routes?.length)
  fail(
    "Configure an account-owned API/admin hostname and protect /admin* with Access.",
  );
if (process.env.ST_BACKEND_DEPLOY_READY !== "yes")
  fail(
    "Complete access, secrets, consent, backup and real notification checks in docs/INQUIRY-BACKEND.md before setting ST_BACKEND_DEPLOY_READY=yes.",
  );
console.log(
  "Static deployment checks passed. Cloudflare secrets, Access policy, and delivery still require runtime verification.",
);
