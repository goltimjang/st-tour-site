import Image from "next/image";
import { posters } from "@/data/posters";
export default function PosterShelf({ onDark = false }: { onDark?: boolean }) {
  return <div className="flex gap-5 overflow-x-auto py-5" tabIndex={0} role="region" aria-label="대회 포스터, 좌우로 넘겨 보기">
    {posters.map((p) => <a key={p.src} href={p.src} target="_blank" rel="noopener noreferrer" className="shrink-0 w-[210px]" aria-label={`${p.title} 포스터 크게 보기`}><Image src={p.src} alt={`${p.title} 포스터`} width={280} height={396} className="rounded-xl w-full h-auto" sizes="210px" /><span className={`block pt-3 text-sm font-bold ${onDark ? "text-white" : ""}`}>{p.title}</span></a>)}
  </div>;
}
