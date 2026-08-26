"use client";

import QuoteForm from "@/components/QuoteForm";
import CourseExplorer from "@/components/CourseExplorer";

export default function DomesticClient() {
  return (
    <div className="space-y-10">
      <div id="quote" className="scroll-mt-24 grid lg:grid-cols-2 gap-6 items-start">
        <QuoteForm type="domestic" />
        <div className="hidden lg:block rounded-2xl border border-line bg-white p-7 shadow-soft">
          <h2 className="font-bold text-[18px] mb-3">골프장을 정하지 못하셨나요?</h2>
          <p className="text-[15px] text-mute leading-relaxed mb-4">
            아래 <b className="text-ink">전국 골프장 지도</b>에서 지도를 눌러 권역을 고르면 해당 지역 골프장이 전부
            나옵니다. 대중제·회원제는 물론 2부제·3부제, 캐디·노캐디로도 추려 볼 수 있고, 골프장마다 공식 홈페이지를
            바로 열어 코스를 확인하실 수 있습니다.
          </p>
          <p className="text-[15px] text-mute leading-relaxed">
            마음에 드는 곳을 찾으셨다면 위 요청서의 <b className="text-ink">선호 골프장</b>에 담아주세요. 비워 두셔도
            지역과 날짜에 맞는 곳을 저희가 추천해 드립니다.
          </p>
        </div>
      </div>

      <div id="courses" className="scroll-mt-24">
        <CourseExplorer />
      </div>
    </div>
  );
}
