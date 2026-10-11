import fs from "node:fs";
const config = JSON.parse(fs.readFileSync("wrangler.jsonc", "utf8"));
const fail = (message) => {
  console.error("Deployment blocked: " + message);
  process.exit(1);
};
const setupOnly = process.env.ST_BACKEND_SETUP_ONLY === "yes";
const ownerTest = config.vars?.TEST_INTAKE_ENABLED === "true";
if (ownerTest) {
  const expiry = Date.parse(config.vars.TEST_EXPIRES_AT || "");
  if (
    !setupOnly ||
    process.env.ST_BACKEND_OWNER_TEST_READY !== "yes" ||
    !Number.isFinite(expiry) ||
    expiry <= Date.now() ||
    expiry > Date.now() + 24 * 3600000 ||
    !config.vars.TEST_REQUEST_KEY ||
    !config.vars.TURNSTILE_SITE_KEY ||
    !config.vars.MAIL_FROM ||
    config.vars.MAIL_TO !== "goltimjang@gmail.com"
  )
    fail(
      "Owner test requires setup-only mode, a bounded expiry, fixed request key, and explicit readiness.",
    );
}
if (config.vars?.MAIL_TEST_EXPIRES_AT) {
  const expiry = Date.parse(config.vars.MAIL_TEST_EXPIRES_AT);
  if (
    !setupOnly ||
    process.env.ST_BACKEND_MAIL_TEST_READY !== "yes" ||
    ownerTest ||
    !Number.isFinite(expiry) ||
    expiry <= Date.now() ||
    expiry > Date.now() + 3600000 ||
    config.vars.MAIL_TO !== "goltimjang@gmail.com" ||
    config.vars.MAIL_FROM !==
      "에스티골프투어 접수 알림 <inquiries@notify.stgolftours.com>"
  )
    fail(
      "Operator mail test requires approved sender, recipient, one-hour expiry and explicit readiness.",
    );
}
if (config.main !== "src/index.ts")
  fail("Production entry must verify Access JWTs and Turnstile.");
if (!/^[0-9a-f-]{36}$/.test(config.d1_databases?.[0]?.database_id || ""))
  fail("Set a dedicated production DB.");
for (const key of [
  "ACCESS_ISSUER",
  "ACCESS_AUDIENCE",
  "ADMIN_EMAILS",
  "ADMIN_ORIGIN",
])
  if (!config.vars?.[key]) fail("Missing " + key);
if (
  !/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(
    config.vars.ACCESS_ISSUER,
  )
)
  fail("Invalid Access issuer.");
if (!/^[a-f0-9]{64}$/.test(config.vars.ACCESS_AUDIENCE))
  fail("Invalid Access audience.");
if (config.vars.ADMIN_EMAILS !== "goltimjang@gmail.com")
  fail("Only the approved administrator is allowed.");
if (!config.assets?.run_worker_first || config.preview_urls !== false)
  fail("Admin assets must be authenticated; previews must stay disabled.");
// The account-owned workers.dev production hostname is protected by an exact /admin* Access app.
// This exception is restricted to the reviewed host, not arbitrary public preview URLs.
if (config.workers_dev === true) {
  if (
    config.name !== "st-tour-inquiries" ||
    config.vars.ADMIN_ORIGIN !==
      "https://st-tour-inquiries.forceo007.workers.dev"
  )
    fail("Unreviewed workers.dev hostname.");
} else if (!config.routes?.length) fail("Configure an approved hostname.");
if (setupOnly) {
  if (
    config.vars.INTAKE_ENABLED !== "false" ||
    config.vars.ALIMTALK_ENABLED !== "false"
  )
    fail("Setup-only deployment must disable intake and customer sends.");
  console.log(
    ownerTest
      ? "Owner-only single test checks passed. Public intake and general customer sends remain disabled."
      : "Setup-only checks passed: admin authentication enabled, intake and customer sends disabled.",
  );
} else {
  for (const key of ["TURNSTILE_HOSTNAMES", "MAIL_FROM", "MAIL_TO"])
    if (!config.vars?.[key]) fail("Missing " + key);
  if (process.env.ST_BACKEND_DEPLOY_READY !== "yes")
    fail(
      "Complete production consent, security, backup and delivery checks before enabling intake.",
    );
  console.log(
    "Production static checks passed. Runtime verification still required.",
  );
}
