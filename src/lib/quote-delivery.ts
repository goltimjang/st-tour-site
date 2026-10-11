/** Public form ID only. Never put a management API key in NEXT_PUBLIC_* variables. */
const formspreeId = (process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID || "xnpnrzgv").trim();

const backendUrl = (process.env.NEXT_PUBLIC_INQUIRY_API_URL || "").trim();
export const usesInquiryBackend = Boolean(backendUrl);

type QuoteDelivery = {
  requestKey?: string;
  token?: string;
  consent?: boolean;
  subject: string;
  email: string;
  payload: Record<string, string>;
  signal: AbortSignal;
};

export async function deliverQuote({ subject, email, payload, signal, requestKey, token, consent }: QuoteDelivery) {
  if (usesInquiryBackend) {
    const endpoint = new URL(backendUrl);
    if (endpoint.protocol !== "https:" || endpoint.pathname !== "/v1/inquiries" || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) throw new Error("Invalid inquiry endpoint");
    if (!requestKey || !token || consent !== true) throw new Error("Inquiry verification required");
    const response = await fetch(endpoint.href, {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ requestKey, token, consent, consentVersion: "2026-10-11-backend-v2", email: email.trim(), payload }),
      signal, credentials: "omit", redirect: "error",
    });
    const data: unknown = await response.json();
    if (!response.ok || !data || typeof data !== "object" || !("ok" in data) || data.ok !== true || ("error" in data && Boolean(data.error)) || !("stored" in data) || data.stored !== true || !("receipt" in data) || typeof data.receipt !== "string" || !/^ST-\d{8}-[A-F0-9]{12}$/.test(data.receipt)) throw new Error("Inquiry storage not confirmed");
    return { receipt: data.receipt };
  }
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
  return { receipt: payload.접수번호 };
}
