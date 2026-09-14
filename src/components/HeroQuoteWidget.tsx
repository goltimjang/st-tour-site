"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { destinations } from "@/data/destinations";

const REGIONS = ["수도권", "강원", "충청", "호남", "영남", "제주"];

/**
 * 홈 히어로 미니 견적 위젯.
 * 국내/해외, 지역 또는 국가, 출발·도착일 세 가지만 고르면 견적 폼 2단계로 바로 들어간다.
 * 값은 URL 파라미터로 넘기고 QuoteForm이 읽어 채운다.
 */
export default function HeroQuoteWidget() {
  const router = useRouter();
  const [kind, setKind] = useState<"domestic" | "overseas">("domestic");
  const [place, setPlace] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const ready = place !== "" && start !== "" && end !== "" && end >= start;

  function go() {
    const q = new URLSearchParams();
    q.set(kind === "domestic" ? "region" : "country", place);
    if (start) q.set("start", start);
    if (end) q.set("end", end);
    router.push(`/${kind}?${q.toString()}#quote`);
  }

  return (
    <div className="rounded-2xl bg-white/95 backdrop-blur-md text-ink shadow-[0_18px_50px_rgba(3,13,44,0.35)] p-4 sm:p-5 max-w-3xl">
      <div className="flex gap-1.5 mb-3.5" role="tablist" aria-label="국내 해외 선택">
        {(["domestic", "overseas"] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={kind === k}
            onClick={() => { setKind(k); setPlace(""); }}
            className={`rounded-full px-4 py-2 text-[14px] font-bold transition-colors ${kind === k ? "bg-navy text-white" : "bg-paper text-ink/70 hover:text-ink"}`}
          >
            {k === "domestic" ? "국내 골프투어" : "해외 골프투어"}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-[1.2fr_1fr_1fr_auto] gap-2.5">
        <label className="block">
          <span className="block text-[11.5px] font-bold text-mute mb-1">{kind === "domestic" ? "희망 지역" : "희망 국가"}</span>
          <select className="field !min-h-[46px] !py-2 text-[15px]" value={place} onChange={(e) => setPlace(e.target.value)} aria-label={kind === "domestic" ? "희망 지역" : "희망 국가"}>
            <option value="">선택해 주세요</option>
            {kind === "domestic"
              ? REGIONS.map((r) => <option key={r} value={r}>{r}</option>)
              : destinations.map((d) => <option key={d.slug} value={d.name}>{d.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="block text-[11.5px] font-bold text-mute mb-1">출발일</span>
          <input type="date" min={today} className="field !min-h-[46px] !py-2 text-[15px]" value={start} onChange={(e) => { setStart(e.target.value); if (end && end < e.target.value) setEnd(""); }} aria-label="출발일" />
        </label>
        <label className="block">
          <span className="block text-[11.5px] font-bold text-mute mb-1">도착일</span>
          <input type="date" min={start || today} className="field !min-h-[46px] !py-2 text-[15px]" value={end} onChange={(e) => setEnd(e.target.value)} aria-label="도착일" />
        </label>
        <div className="flex items-end">
          <button type="button" onClick={go} disabled={!ready} className="btn btn-royal w-full sm:w-auto !min-h-[46px] !px-6 disabled:opacity-45 disabled:cursor-not-allowed">
            견적 시작
          </button>
        </div>
      </div>
      <p className="text-[12.5px] text-mute mt-2.5">세 가지만 고르면 바로 견적 요청 화면으로 이어집니다. 견적은 무료, 24시간 안에 회신드립니다.</p>
    </div>
  );
}
