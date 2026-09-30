"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { destinations } from "@/data/destinations";
import DestinationRegionChoices from "@/components/DestinationRegionChoices";
import { track } from "@/lib/analytics";

const REGIONS = ["수도권", "강원", "충청", "호남", "영남", "제주"];
export default function HeroQuoteWidget() {
  const router = useRouter();
  const [kind, setKind] = useState<"domestic" | "overseas">("overseas");
  const [place, setPlace] = useState("");
  const [area, setArea] = useState("");
  const [flexible, setFlexible] = useState(true);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const today = new Date().toLocaleDateString("sv-SE");
  function go() {
    const q = new URLSearchParams();
    q.set(kind === "domestic" ? "region" : "country", place || "추천 받고 싶어요");
    if (kind === "overseas" && area) q.set("area", area);
    if (flexible) q.set("flexible", "1");
    else { q.set("start", start); q.set("end", end); }
    track("quote_entry", { kind, source: "home" });
    router.push(`/${kind}/?${q.toString()}#quote`);
  }
  return (
    <div id="quick-quote" className="scroll-mt-24 rounded-2xl border border-line bg-white text-ink p-5 sm:p-6 shadow-soft">
      <h2 className="text-xl font-bold mb-1">나만의 골프여행, 견적부터</h2>
      <p className="text-sm text-mute mb-4">약 30초, 여행 조건부터 간편하게.</p>
      <div className="flex gap-2 mb-4" role="group" aria-label="여행 종류">
        {(["overseas", "domestic"] as const).map((k) => <button key={k} type="button" aria-pressed={kind === k} onClick={() => { if (kind !== k) { setKind(k); setPlace(""); setArea(""); } }} className="choice flex-1" data-on={kind === k}>{k === "domestic" ? "국내 골프투어" : "해외 골프투어"}</button>)}
      </div>
      <label className="block font-semibold text-sm mb-2" htmlFor="hero-place">{kind === "domestic" ? "희망 지역" : "희망 국가"}</label>
      <select id="hero-place" className="field" value={place} onChange={(e) => { setPlace(e.target.value); setArea(""); }}>
        <option value="">{kind === "domestic" ? "지역 선택 · 미정" : "국가 선택 · 미정"}</option>
        {(kind === "domestic" ? REGIONS : destinations.map((d) => d.name)).map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      {kind === "overseas" && place && <div className="mt-4"><DestinationRegionChoices country={place} value={area} onChange={setArea} /></div>}
      <fieldset className="my-4"><legend className="font-semibold text-sm mb-2">희망 일정</legend><div className="grid grid-cols-2 gap-2"><button type="button" className="choice" aria-pressed={!flexible} data-on={!flexible} onClick={() => setFlexible(false)}>일정입력</button><button type="button" className="choice" aria-pressed={flexible} data-on={flexible} onClick={() => setFlexible(true)}>미정</button></div></fieldset>
      {!flexible && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <label className="min-w-0"><span className="block text-sm font-semibold mb-1">출발일</span><input type="date" min={today} className="field" value={start} onChange={(e) => { setStart(e.target.value); if (end < e.target.value) setEnd(""); }} /></label>
        <label className="min-w-0"><span className="block text-sm font-semibold mb-1">도착일</span><input type="date" min={start || today} className="field" value={end} onChange={(e) => setEnd(e.target.value)} /></label>
      </div>}
      <button type="button" onClick={go} disabled={!flexible && (!start || !end || end < start || start < today)} className="btn btn-royal w-full">무료 견적받기</button>
    </div>
  );
}
