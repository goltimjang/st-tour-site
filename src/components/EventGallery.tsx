import Image from "next/image";
import eventsData from "@/data/events.json";
import AutoCarousel from "@/components/AutoCarousel";
export default function EventGallery() {
  return <div className="mx-auto max-w-6xl px-5"><AutoCarousel label="실제 대회 현장 사진">{eventsData.map(p => <figure key={p.src} className="h-full rounded-2xl overflow-hidden border border-line bg-white"><Image src={p.src} alt={`${p.caption} 현장 사진`} width={600} height={400} className="w-full aspect-[3/2] object-cover" sizes="(max-width: 639px) 85vw, 370px" /><figcaption className="p-4 text-sm font-semibold">{p.caption}</figcaption></figure>)}</AutoCarousel></div>;
}
