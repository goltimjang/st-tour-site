/** Public form ID only. Never put a management API key in NEXT_PUBLIC_* variables. */
const formspreeId = (process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID || "xnpnrzgv").trim();

type QuoteDelivery = {
  subject: string;
  email: string;
  payload: Record<string, string>;
  signal: AbortSignal;
};

export async function deliverQuote({ subject, email, payload, signal }: QuoteDelivery) {
  // Never silently resend a failed request to another provider.
  if (!/^[a-zA-Z0-9]{6,32}$/.test(formspreeId)) {
    throw new Error("Invalid quote form configuration");
  }
  const cleanEmail = email.trim();
  const body = { ...payload, subject, ...(cleanEmail ? { email: cleanEmail } : {}) };
  const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    signal,
    credentials: "omit",
    redirect: "error",
  });
  // An HTTP success alone is not a confirmed receipt (e.g. an HTML challenge).
  const result: unknown = await response.json();
  if (!response.ok || !result || typeof result !== "object" || Array.isArray(result)) {
    throw new Error("Quote receipt not confirmed");
  }
  const data = result as Record<string, unknown>;
  if (data.ok !== true || data.error || (Array.isArray(data.errors) && data.errors.length > 0)) {
    throw new Error("Quote receipt not confirmed");
  }
}
