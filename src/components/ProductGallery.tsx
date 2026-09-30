"use client";
import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";

export default function ProductGallery({ product: p, priority = false }: { product: Product; priority?: boolean }) {
  const [photo, setPhoto] = useState(0);
  const gallery = p.gallery?.length ? p.gallery : [p.thumb];
  const caption = p.galleryCaptions?.[photo] || p.thumbCaption || p.title;
  const subject = p.gallerySubjects?.[photo] || (p.photoPending && photo === 0 ? "pending" : "course");
  const labels = { course: "골프장", clubhouse: "클럽하우스", hotel: "숙소·객실", facility: "부대시설", pending: "골프장 사진 확인 중" };
  const move = (offset: number) => setPhoto(i => (i + offset + gallery.length) % gallery.length);
  return <div className="min-w-0" role="group" aria-label="상품 시설 사진">
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
      {subject === "pending" ? <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center"><p className="text-lg font-bold text-navy">골프장 사진 확인 중</p><p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">{gallery.length > 1 ? "다음 사진에서 예정 숙소와 시설을 확인하세요." : "이용 시설은 견적서에서 안내해드립니다."}</p></div> : <Image key={gallery[photo]} src={gallery[photo]} alt={caption} fill priority={priority && photo === 0} sizes="(max-width: 768px) 100vw, 600px" className="gallery-photo object-scale-down" />}
      {subject !== "pending" && <span className="absolute top-3 left-3 rounded-lg bg-white/95 px-3 py-2 text-xs font-bold">{labels[subject]}</span>}
      {gallery.length > 1 && <>
        <button type="button" aria-label="이전 시설 사진" onClick={() => move(-1)} className="gallery-arrow absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/95 w-11 h-11 shadow text-2xl">‹</button>
        <button type="button" aria-label="다음 시설 사진" onClick={() => move(1)} className="gallery-arrow absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/95 w-11 h-11 shadow text-2xl">›</button>
      </>}
      <span className="absolute right-3 bottom-3 rounded-full bg-slate-900/75 px-3 py-1 text-sm text-white">{photo + 1} / {gallery.length}</span>
    </div>
    <p className="my-3 text-sm leading-relaxed text-mute min-h-5 break-words" aria-live="polite">{caption}</p>
    {gallery.length > 1 && <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2">
      {gallery.map((g,i) => <button key={g} type="button" aria-label={`${i + 1}번 시설 사진: ${p.galleryCaptions?.[i] || p.title}`} aria-pressed={i === photo} onClick={() => setPhoto(i)} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}}} className={`gallery-thumb relative aspect-square min-h-11 rounded-lg overflow-hidden border-2 ${i === photo ? "border-royal" : "border-transparent opacity-75 hover:opacity-100"}`}><Image src={g} alt="" fill sizes="100px" className="object-cover" /></button>)}
    </div>}
    {p.gallerySubjects?.some(s => s === "hotel" || s === "facility") && <p className="mt-3 text-xs leading-relaxed text-mute">예정 시설의 참고 사진입니다. 이용 숙소·객실 유형·시설 이용 조건은 최종 견적서로 확인해주세요.</p>}
  </div>;
}
