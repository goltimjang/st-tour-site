"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { destinations } from "@/data/destinations";
import { track } from "@/lib/analytics";

const REGIONS = ["수도권", "강원", "충청", "호남", "영남", "제주"];
export default function HeroQuoteWidget() {
  const router = useRouter();
  const [kind, setKind] = useState<"domestic" | "overseas">("overseas");
  const [place, setPlace] = useState("");
  const [flexible, setFlexible] = useState(true);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const today = new Date().toLocaleDateString("sv-SE");
  function go() {
    const q = new URLSearchParams();
    q.set(kind === "domestic" ? "region" : "country", place || "추천 받고 싶어요");
    if (flexible) q.set("flexible", "1");
    else { q.set("start", start); q.set("end", end); }
    track("quote_entry", { kind, source: "home" });
    router.push(`/${kind}/?${q.toString()}#quote`);
  }
  return (
    <div id="quick-quote" className="scroll-mt-24 rounded-2xl border border-line bg-white text-ink p-5 sm:p-6 shadow-soft">
      <h2 className="text-xl font-bold mb-1">어떤 여행을 준비하시나요?</h2>
      <p className="text-sm text-mute mb-4">지역과 일정이 미정이어도 상담할 수 있어요.</p>
      <div className="flex gap-2 mb-4" role="group" aria-label="여행 종류">
        {(["overseas", "domestic"] as const).map((k) => <button key={k} type="button" aria-pressed={kind === k} onClick={() => { setKind(k); setPlace(""); }} className="choice flex-1" data-on={kind === k}>{k === "domestic" ? "국내 골프투어" : "해외 골프투어"}</button>)}
      </div>
      <label className="block font-semibold text-sm mb-2" htmlFor="hero-place">{kind === "domestic" ? "희망 지역" : "희망 국가"}</label>
      <select id="hero-place" className="field" value={place} onChange={(e) => setPlace(e.target.value)}>
        <option value="">아직 미정, 추천받을게요</option>
        {(kind === "domestic" ? REGIONS : destinations.map((d) => d.name)).map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <label className="flex gap-3 items-center my-4 min-h-11 cursor-pointer text-[15px]"><input type="checkbox" className="h-5 w-5 accent-[#0d4ff5]" checked={flexible} onChange={(e) => setFlexible(e.target.checked)} />일정은 상담하면서 정할게요</label>
      {!flexible && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <label className="min-w-0"><span className="block text-sm font-semibold mb-1">출발일</span><input type="date" min={today} className="field" value={start} onChange={(e) => { setStart(e.target.value); if (end < e.target.value) setEnd(""); }} /></label>
        <label className="min-w-0"><span className="block text-sm font-semibold mb-1">도착일</span><input type="date" min={start || today} className="field" value={end} onChange={(e) => setEnd(e.target.value)} /></label>
      </div>}
      <button type="button" onClick={go} disabled={!flexible && (!start || !end || end < start || start < today)} className="btn btn-royal w-full">무료 견적 시작하기</button>
      <p className="text-sm text-mute mt-3">여행 조건을 확인한 뒤 연락처를 남기는 순서입니다.</p>
    </div>
  );
}
