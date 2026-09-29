"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";
const tabs = ["상세일정", "포함·불포함", "사진"];
export default function ProductDetails({ product: p }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [photo, setPhoto] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const gallery = p.gallery?.length ? p.gallery : [p.thumb];
  return <div className="min-w-0 rounded-2xl border border-line bg-white overflow-hidden">
    <div role="tablist" aria-label="상품 상세 안내" className="grid grid-cols-3 border-b border-line">
      {tabs.map((label,i) => <button key={label} ref={el=>{refs.current[i]=el;}} id={`detail-tab-${i}`} aria-controls={`detail-panel-${i}`} role="tab" aria-selected={active===i} tabIndex={active===i?0:-1} className={`min-h-14 px-2 font-bold text-sm sm:text-base border-b-2 ${active===i?"border-royal text-royaldark bg-blue-50":"border-transparent text-mute"}`} onClick={()=>setActive(i)} onKeyDown={e=>{let n=i;if(e.key==="ArrowRight") n=(i+1)%3;else if(e.key==="ArrowLeft") n=(i+2)%3;else if(e.key==="Home") n=0;else if(e.key==="End") n=2;else return;e.preventDefault();setActive(n);refs.current[n]?.focus();}}>{label}</button>)}
    </div>
    <section id="detail-panel-0" role="tabpanel" aria-labelledby="detail-tab-0" hidden={active!==0} tabIndex={0} className="p-5 sm:p-7">
      <h2 className="text-xl font-bold mb-2">여행 일정</h2>
      <p className="text-sm text-mute mb-5">{p.itineraryNote ?? "아래는 상품 구성 안내입니다. 선택한 출발일의 상세 일정은 견적서로 안내합니다."}</p>
      {p.itinerary?.length ? <ol className="space-y-3">{p.itinerary.map((d,i)=><li key={i}><details open={i===0} className="rounded-xl border border-line"><summary className="cursor-pointer p-4 font-bold text-navy">{d.day}</summary><div className="border-t border-line p-4 text-[15px] leading-7 whitespace-pre-line">{d.plan}</div></details></li>)}</ol> : <div className="rounded-xl bg-paper p-5"><p className="font-bold mb-3">이 상품의 주요 구성</p><ul className="space-y-2 text-[15px]">{(p.features?.length?p.features:[p.summary]).map(x=><li key={x}>{x}</li>)}</ul><p className="mt-4 text-sm text-mute">출발일별 일정표 확인이 필요한 상품입니다. 견적 요청 시 일자별 라운드·숙박·이동 일정을 함께 보내드립니다.</p></div>}
    </section>
    <section id="detail-panel-1" role="tabpanel" aria-labelledby="detail-tab-1" hidden={active!==1} tabIndex={0} className="p-5 sm:p-7">
      <h2 className="text-xl font-bold mb-2">포함사항과 별도 비용</h2><p className="text-sm text-mute mb-5">{p.inclusionNote ?? "현지 일정 기준 안내입니다. 출발일·인원에 따른 포함 내역과 추가 비용은 최종 견적서에서 확인하세요."}</p>
      <div className="space-y-4"><div className="rounded-xl bg-blue-50 p-5"><h3 className="font-bold text-royaldark mb-3">포함 안내</h3><ul className="space-y-2 text-[15px]">{(p.includes?.length?p.includes:["숙박·식사·그린피·차량 등 포함 내역은 상품별 견적서로 안내"]).map(x=><li key={x} className="whitespace-pre-line">{x}</li>)}</ul></div><div className="rounded-xl bg-paper p-5"><h3 className="font-bold mb-3">불포함·별도 비용</h3><ul className="space-y-2 text-[15px]">{(p.excludes??["왕복 항공권·유류할증료·항공 관련 세금"]).map(x=><li key={x} className="whitespace-pre-line">{x}</li>)}</ul></div></div>
    </section>
    <section id="detail-panel-2" role="tabpanel" aria-labelledby="detail-tab-2" hidden={active!==2} tabIndex={0} className="p-5 sm:p-7">
      <h2 className="text-xl font-bold mb-4">골프장·숙소·여행 사진</h2><div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-paper"><Image src={gallery[photo]} alt={p.galleryCaptions?.[photo] || `${p.title} 상품 사진`} fill sizes="(max-width: 1024px) 100vw, 700px" className="object-contain" /></div>
      <p className="my-3 text-sm text-mute" aria-live="polite">{photo+1} / {gallery.length} · {p.galleryCaptions?.[photo] || "상품 대표 사진"}</p>
      {gallery.length>1 && <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">{gallery.map((g,i)=><button key={g} type="button" aria-label={`${i+1}번 사진: ${p.galleryCaptions?.[i] || p.title}`} aria-pressed={i===photo} onClick={()=>setPhoto(i)} className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 ${i===photo?"border-royal":"border-transparent"}`}><Image src={g} alt="" fill sizes="140px" className="object-cover" /></button>)}</div>}
      <p className="text-xs text-mute mt-4">사진은 시설 안내용이며, 이용 객실·골프장은 출발일별 최종 견적서로 확인합니다.</p>
    </section>
  </div>;
}
