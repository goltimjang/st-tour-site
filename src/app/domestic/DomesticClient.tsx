"use client";

import { useState } from "react";
import QuoteForm from "@/components/QuoteForm";
import CourseExplorer from "@/components/CourseExplorer";

export default function DomesticClient() {
  const [prefill, setPrefill] = useState<{ course: string; region: string } | null>(null);

  return (
    <div className="space-y-10">
      <div id="quote" className="scroll-mt-24 grid lg:grid-cols-2 gap-6 items-start">
        <QuoteForm
          key={prefill ? prefill.course : "blank"}
          type="domestic"
          prefillCourse={prefill?.course}
          prefillRegion={prefill?.region}
        />
        <div className="hidden lg:block rounded-2xl border border-line bg-white p-7 shadow-soft">
          <h2 className="font-bold text-[18px] mb-3">골프장을 정하지 못하셨나요?</h2>
          <p className="text-[15px] text-mute leading-relaxed mb-4">
            아래 <b className="text-ink">전국 골프장 지도</b>에서 권역을 고르면 해당 지역 골프장이 전부 나옵니다.
            대중제와 회원제를 나눠서 볼 수 있고, 마음에 드는 곳의 <b className="text-ink">견적받기</b> 버튼을
            누르면 이 견적 요청서에 자동으로 담깁니다.
          </p>
          <p className="text-[15px] text-mute leading-relaxed">
            물론 골프장을 비워 두셔도 됩니다. 지역과 날짜에 맞는 곳을 저희가 추천해 드립니다.
          </p>
        </div>
      </div>

      <div id="courses" className="scroll-mt-24">
        <CourseExplorer
          onPick={(c) => {
            setPrefill({ course: c.name, region: c.region });
            document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
}
