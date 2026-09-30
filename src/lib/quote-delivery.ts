/** Public form ID only. Never put a management API key in NEXT_PUBLIC_* variables. */
const formspreeId = (process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID || "").trim();
const legacyEndpoint = "https://formsubmit.co/ajax/dea690313c66c8f0af9faeae39e6b6dc";

type QuoteDelivery = {
  subject: string;
  email: string;
  payload: Record<string, string>;
  signal: AbortSignal;
};

export async function deliverQuote({ subject, email, payload, signal }: QuoteDelivery) {
  // Until an owned, verified form is connected, preserve the deployed provider.
  // Once configured, never silently resend a failed request to another provider.
  if (formspreeId && !/^[a-zA-Z0-9]{6,32}$/.test(formspreeId)) {
    throw new Error("Invalid quote form configuration");
  }
  const formspree = Boolean(formspreeId);
  const cleanEmail = email.trim();
  const body = formspree
    ? { ...payload, subject, ...(cleanEmail ? { email: cleanEmail } : {}) }
    : { ...payload, _subject: subject, _template: "table", ...(cleanEmail ? { _replyto: cleanEmail } : {}) };
  const response = await fetch(formspree ? `https://formspree.io/f/${formspreeId}` : legacyEndpoint, {
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
  const accepted = formspree ? data.ok === true : data.success === true || data.success === "true";
  if (!accepted || data.error || (Array.isArray(data.errors) && data.errors.length > 0)) {
    throw new Error("Quote receipt not confirmed");
  }
}
