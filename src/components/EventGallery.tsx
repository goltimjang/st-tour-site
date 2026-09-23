import Image from "next/image";
import eventsData from "@/data/events.json";
export default function EventGallery() {
  return <div className="mx-auto max-w-6xl px-5 flex gap-4 overflow-x-auto pb-5" tabIndex={0} role="region" aria-label="실제 대회 현장 사진, 좌우로 넘겨 보기">
    {eventsData.map((p) => <figure key={p.src} className="shrink-0 w-[260px] sm:w-[360px] rounded-2xl overflow-hidden border border-line bg-white"><Image src={p.src} alt={`${p.caption} 현장 사진`} width={360} height={240} className="w-full h-[190px] sm:h-[240px] object-cover" sizes="(max-width: 640px) 260px, 360px" /><figcaption className="p-4 text-sm font-semibold">{p.caption}</figcaption></figure>)}
  </div>;
}
