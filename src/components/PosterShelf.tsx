import Image from "next/image";
import { posters } from "@/data/posters";
import AutoCarousel from "@/components/AutoCarousel";
export default function PosterShelf({ onDark = false }: { onDark?: boolean }) {
  return <div className="mx-auto max-w-6xl px-5 py-5"><AutoCarousel label="대회 포스터" variant="posters" onDark={onDark}>
    {posters.map((p) => <a key={p.src} href={p.src} target="_blank" rel="noopener noreferrer" className="block" aria-label={`${p.title} 포스터 크게 보기`}><Image src={p.src} alt={`${p.title} 포스터`} width={280} height={396} className="rounded-xl w-full h-auto" sizes="230px" /><span className={`block pt-3 text-sm font-bold ${onDark ? "text-white" : ""}`}>{p.title}</span></a>)}
  </AutoCarousel></div>;
}
