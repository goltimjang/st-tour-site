"use client";
import { useEffect, useRef, useState } from "react";
import { usesInquiryBackend } from "@/lib/quote-delivery";
type Turnstile = { render(el: HTMLElement, options: Record<string, unknown>): string; remove(id: string): void };
declare global { interface Window { turnstile?: Turnstile } }
let loading: Promise<void> | undefined;
function loadWidget() {
  if (window.turnstile) return Promise.resolve();
  if (!loading) loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    const timer = setTimeout(() => { loading = undefined; script.remove(); reject(new Error("verification_timeout")); }, 12000);
    script.onload = () => { clearTimeout(timer); resolve(); };
    script.onerror = () => { clearTimeout(timer); loading = undefined; script.remove(); reject(new Error("verification_unavailable")); };
    document.head.append(script);
  });
  return loading;
}
export default function InquiryVerification({ onToken, resetKey }: { onToken: (token: string) => void; resetKey: number }) {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!usesInquiryBackend) return;
    let cancelled = false; let widget: string | undefined;
    onToken(""); setError(false);
    const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!sitekey) { setError(true); return; }
    loadWidget().then(() => {
      if (cancelled || !host.current) return;
      if (!window.turnstile) { setError(true); return; }
      widget = window.turnstile.render(host.current, {
        sitekey, action: "inquiry", theme: "light", size: "flexible",
        callback: (token: string) => { onToken(token); setError(false); },
        "expired-callback": () => onToken(""),
        "error-callback": () => { onToken(""); setError(true); },
      });
    }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; if (widget && window.turnstile) window.turnstile.remove(widget); };
  }, [onToken, resetKey, retry]);
  if (!usesInquiryBackend) return null;
  return <div className="min-w-0"><div ref={host} />{error && <p role="alert" className="text-sm text-red-700">접수 보호 확인을 불러오지 못했습니다. <button type="button" className="underline" onClick={() => setRetry(v => v + 1)}>다시 확인</button>하거나 전화로 문의해 주세요.</p>}</div>;
}
