const form = document.getElementById("mail-test-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  const result = document.getElementById("mail-test-result");
  button.disabled = true;
  result.textContent = "발송 서비스 응답 확인 중";
  try {
    const response = await fetch("/admin/mail-test", {
      method: "POST",
      credentials: "same-origin",
    });
    const data = await response.json();
    result.textContent = data.ok
      ? `발송 서비스 접수 완료. 메일 ID: ${data.providerId}. 받은편지함 도착은 별도 확인합니다.`
      : `발송 결과 확인 필요: ${data.error}. 다시 보내지 마세요.`;
  } catch {
    result.textContent =
      "응답 확인 불가. 발송 이력을 먼저 확인하세요. 자동 재발송하지 않습니다.";
  }
});
