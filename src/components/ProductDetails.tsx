"use client";
import { useRef, useState } from "react";
import type { Product } from "@/data/products";
import ProductGallery from "./ProductGallery";
const tabs = ["상세일정", "포함·별도 비용", "시설 사진"];

function CostList({ items }: { items: string[] }) {
  return <ul className="divide-y divide-slate-200/70">{items.map((text, i) => {
    const [first, ...rest] = text.split("\n");
    return <li key={i} className="py-3 first:pt-0 last:pb-0 text-[15px] leading-relaxed break-words">{rest.length > 0 && text.length > 130 ? <details><summary className="cursor-pointer font-medium">{first}<span className="block text-xs text-mute mt-1">세부 조건 보기</span></summary><p className="mt-3 whitespace-pre-line text-sm">{rest.join("\n")}</p></details> : <p className="whitespace-pre-line">{text}</p>}</li>;
  })}</ul>;
}

export default function ProductDetails({ product: p }: { product: Product }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return <div className="min-w-0 rounded-2xl border border-line bg-white overflow-hidden">
    <div role="tablist" aria-label="상품 상세 안내" className="grid grid-cols-3 border-b border-line">
      {tabs.map((label,i) => <button key={label} ref={el=>{refs.current[i]=el;}} id={`detail-tab-${i}`} aria-controls={`detail-panel-${i}`} role="tab" aria-selected={active===i} tabIndex={active===i?0:-1} className={`min-h-14 px-1 font-bold text-[13px] sm:text-base border-b-2 ${active===i?"border-royal text-royaldark bg-blue-50":"border-transparent text-mute"}`} onClick={()=>setActive(i)} onKeyDown={e=>{let n=i;if(e.key==="ArrowRight") n=(i+1)%3;else if(e.key==="ArrowLeft") n=(i+2)%3;else if(e.key==="Home") n=0;else if(e.key==="End") n=2;else return;e.preventDefault();setActive(n);refs.current[n]?.focus();}}>{label}</button>)}
    </div>
    <section id="detail-panel-0" role="tabpanel" aria-labelledby="detail-tab-0" hidden={active!==0} tabIndex={0} className="p-4 sm:p-7">
      <h2 className="text-xl font-bold mb-2">일자별 여행 일정</h2>
      <p className="text-sm text-mute leading-relaxed mb-5">{p.itineraryNote ?? "아래는 상품 구성 안내입니다. 선택한 출발일의 상세 일정은 견적서로 안내합니다."}</p>
      {p.itinerary?.length ? <ol className="space-y-3">{p.itinerary.map((d,i)=><li key={i}><details open={i===0} className="rounded-xl border border-line group"><summary className="cursor-pointer p-4 text-navy"><span className="font-bold text-royaldark">{d.day}</span>{d.summary && <span className="block mt-1 text-sm font-medium leading-relaxed">{d.summary}</span>}</summary><div className="border-t border-line p-4 text-[15px] leading-7 whitespace-pre-line break-words">{d.plan}</div></details></li>)}</ol> : <div className="rounded-xl bg-paper p-5"><p className="font-bold mb-3">이 상품의 주요 구성</p><ul className="space-y-2 text-[15px]">{(p.features?.length?p.features:[p.summary]).map(x=><li key={x}>{x}</li>)}</ul><p className="mt-4 text-sm text-mute">출발일별 일정표 확인이 필요한 상품입니다. 견적 요청 시 일자별 라운드·숙박·이동 일정을 함께 보내드립니다.</p></div>}
    </section>
    <section id="detail-panel-1" role="tabpanel" aria-labelledby="detail-tab-1" hidden={active!==1} tabIndex={0} className="p-4 sm:p-7">
      <h2 className="text-xl font-bold mb-2">포함사항과 별도 비용</h2><p className="text-sm text-mute leading-relaxed mb-5">{p.inclusionNote ?? "현지 일정 기준 안내입니다. 출발일·인원에 따른 포함 내역과 추가 비용은 최종 견적서에서 확인하세요."}</p>
      <div className="space-y-4">
        <div className="rounded-xl bg-blue-50 p-5"><h3 className="font-bold text-royaldark mb-4">포함 안내</h3><CostList items={p.includes?.length?p.includes:["숙박·식사·그린피·차량 등 포함 내역은 상품별 견적서로 안내"]}/></div>
        <div className="rounded-xl bg-paper p-5"><h3 className="font-bold mb-4">불포함·별도 비용</h3><CostList items={p.excludes??["왕복 항공권·유류할증료·항공 관련 세금"]}/></div>
        {!!p.optionalCosts?.length && <div className="rounded-xl border border-line p-5"><h3 className="font-bold mb-4">선택 시 추가 비용</h3><CostList items={p.optionalCosts}/></div>}
      </div>
    </section>
    <section id="detail-panel-2" role="tabpanel" aria-labelledby="detail-tab-2" hidden={active!==2} tabIndex={0} className="p-4 sm:p-7">
      <h2 className="text-xl font-bold mb-4">골프장·숙소·시설 사진</h2><ProductGallery product={p}/>
    </section>
    <div className="border-t border-line bg-paper p-4 sm:p-6"><p className="font-bold mb-1">이 여행이 마음에 드시나요?</p><p className="text-sm text-mute mb-4">희망 날짜와 인원을 남기면 담당자가 가능한 구성과 금액을 안내합니다.</p><a className="btn btn-royal w-full" href="#quote">이 상품으로 무료 견적 받기</a></div>
  </div>;
}
