/**
 * 상담 흐름 예시: 메신저 대화 형식으로 서비스 진행 과정을 보여줌.
 * 실제 고객 대화가 아닌 재구성 예시임을 하단에 명시 (허위 후기 방지 원칙).
 */
const messages: { from: "customer" | "st"; text: string; note?: string }[] = [
  { from: "customer", text: "12월 첫째 주에 4명이서 태국으로 골프 가려고 하는데, 대충 얼마나 들까요?" },
  { from: "st", text: "안녕하세요, 에스티골프투어입니다. 12월 초 방콕이면 성수기 초입이라 지금 알아보시는 게 딱 좋아요. 라운드는 몇 번 생각하세요?" },
  { from: "customer", text: "3번이요. 숙소는 골프장 가까운 데면 됩니다." },
  { from: "st", text: "확인했습니다. 내일 이 시간 전까지 견적서 보내드릴게요.", note: "24시간 카운트 시작" },
  { from: "st", text: "견적서 보내드렸습니다! 왕복 항공·4성 리조트 3박·3라운드·전 일정 차량 포함 1인 110만원입니다. 포함·불포함 내역 적어뒀으니 조정하고 싶은 부분 말씀 주세요.", note: "다음 날 오전" },
  { from: "customer", text: "포함 내역이 한눈에 들어오네요. 숙소만 5성으로 올리면 얼마나 차이 날까요?" },
];

export default function ChatDemo() {
  return (
    <div className="max-w-md mx-auto lg:mx-0">
      <div className="rounded-2xl border border-line bg-[#EAEFF7] overflow-hidden shadow-soft">
        <div className="bg-navy text-white px-5 py-3 flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gold inline-block" aria-hidden="true" />
          <span className="text-[14px] font-bold">에스티골프투어 상담</span>
          <span className="ml-auto text-[11px] text-white/60">진행 과정 예시</span>
        </div>
        <div className="px-4 py-5 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "customer" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[82%]">
                {m.note && <p className="text-[10.5px] text-mute mb-1 px-1">{m.note}</p>}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                    m.from === "customer"
                      ? "bg-[#FEE500] text-ink rounded-tr-sm"
                      : "bg-white text-ink rounded-tl-sm border border-line"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2.5 text-[11.5px] text-mute text-center lg:text-left">
        ※ 실제 상담 흐름을 재구성한 예시 대화입니다.
      </p>
    </div>
  );
}
