// 이름·전화·이메일·요청 본문은 분석 이벤트에 전달하지 않는다.
export type QuoteEvent = "quote_entry" | "quote_start" | "quote_step" | "quote_submit_success" | "quote_submit_error" | "phone_click" | "kakao_click";
export function track(event: QuoteEvent, fields: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  try {
  const w = window as typeof window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
  const data = { ...fields, page_path: window.location.pathname };
  w.dataLayer ??= [];
  if (w.gtag) w.gtag("event", event, data);
  else w.dataLayer.push({ event, ...data });
  } catch { /* 분석 서비스 오류가 견적 입력·전송 결과에 영향을 주면 안 된다. */ }
}
