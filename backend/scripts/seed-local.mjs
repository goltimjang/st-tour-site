// Synthetic preview data only; this script cannot target a remote endpoint.
const rows = [
  {
    접수번호: "LOCAL-HANOI",
    type: "해외 골프투어",
    지역: "베트남 · 하노이",
    희망시기: "2026. 12. 13 ~ 2026. 12. 17",
    인원: "4명",
    이름: "하노이 문의 예시",
    연락처: "01000000000",
    상품: "로얄CC 클럽 페스티벌",
    요청사항: "화면 확인용 가상 문의입니다. 실제 고객이 아닙니다.",
  },
  {
    접수번호: "LOCAL-BOOKING",
    문의유형: "할인부킹",
    골프장: "포세븐 금강CC",
    상품코드: "fourseven-geumgang",
    희망날짜: "2026-12-20",
    희망부: "2부",
    인원: "단체 3팀",
    팀수: "3팀",
    예약자: "단체부킹 예시",
    연락처: "01000000000",
    요청사항: "시험 자료입니다. 실제 예약 또는 상담을 진행하지 않습니다.",
  },
  {
    접수번호: "LOCAL-JAPAN",
    type: "해외 골프투어",
    지역: "일본 · 후쿠오카",
    희망시기: "미정",
    인원: "3명",
    이름: "일본 문의 예시",
    연락처: "01000000000",
    요청사항: "모바일 화면 확인용입니다.",
  },
];
for (let i = 0; i < rows.length; i++) {
  const res = await fetch("http://127.0.0.1:8787/v1/inquiries", {
    method: "POST",
    headers: {
      Origin: "http://127.0.0.1:4173",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requestKey: `00000000-0000-4000-8000-00000000000${i}`,
      payload: rows[i],
      email: "",
      token: "local-only",
      consent: true,
      consentVersion: "2026-10-backend-v1",
    }),
  });
  if (!res.ok) throw Error("Local seed failed: " + res.status);
  console.log(await res.json());
}
