const form = document.querySelector("#test-form");
const button = document.querySelector("#submit");
const status = document.querySelector("#setup");
const result = document.querySelector("#result");
let token = "";
let widget;
let complete = false;
const errors = {
  owner_test_disabled: "시험 접수가 비활성 상태이거나 허용 시간이 끝났습니다.",
  owner_test_not_configured:
    "운영 메일 등 연결 준비가 아직 완료되지 않았습니다. 시험 접수는 보내지 않았습니다.",
  verification_required: "보안 인증을 완료한 뒤 다시 눌러 주세요.",
  consent_required: "시험 접수 동의를 확인해 주세요.",
};
function verificationExpired() {
  token = "";
  button.disabled = true;
}
async function start() {
  try {
    const response = await fetch("/admin/api/owner-test", {
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    status.textContent = `시험 수신 번호 ${data.recipient} · 운영 메일 ${data.mailTo}`;
    if (data.receipt) {
      result.textContent = `이미 저장된 시험 접수입니다. 접수번호: ${data.receipt}. 접수함에서 알림 상태를 확인하세요.`;
      return;
    }
    form.hidden = false;
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.onload = () => {
      widget = window.turnstile.render("#captcha", {
        sitekey: data.siteKey,
        action: "inquiry",
        size: "flexible",
        language: "ko",
        callback(value) {
          token = value;
          button.disabled = complete;
        },
        "expired-callback": verificationExpired,
        "error-callback": verificationExpired,
      });
    };
    script.onerror = () => {
      status.textContent =
        "보안 인증을 불러오지 못했습니다. 새로고침해 주세요.";
    };
    document.head.appendChild(script);
  } catch (error) {
    status.textContent =
      errors[error.message] ||
      "연결 상태를 확인하지 못했습니다. 관리자 로그인 상태를 확인해 주세요.";
  }
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!token || complete || button.disabled || !form.reportValidity()) return;
  button.disabled = true;
  result.textContent = "접수 내용을 저장하고 있습니다.";
  try {
    const response = await fetch("/admin/api/owner-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        consent: document.querySelector("#consent").checked,
      }),
      signal: AbortSignal.timeout(20000),
    });
    const data = await response.json();
    if (!response.ok || data.ok !== true || data.stored !== true)
      throw new Error(data.error || "failed");
    complete = true;
    form.hidden = true;
    result.textContent = `저장 완료. 접수번호: ${data.receipt}. 접수함에서 메일과 알림톡 상태를 확인하세요.`;
  } catch (error) {
    result.textContent =
      errors[error.message] ||
      "저장 결과를 확인하지 못했습니다. 다시 눌러도 같은 접수번호를 조회하며 중복 발송하지 않습니다.";
    verificationExpired();
    window.turnstile?.reset(widget);
  }
});
start();
