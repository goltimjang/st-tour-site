import Image from "next/image";
import { posters } from "@/data/posters";

/**
 * 대회 포스터 입체 진열대 — 원근(perspective) 기울기 + 호버 시 정면으로 떠오름.
 * 모바일: 가로 스크롤 스냅.
 */
export default function PosterShelf() {
  return (
    <div className="poster-shelf" role="list" aria-label="에스티투어 대회 포스터">
      {posters.map((p, i) => (
        <a
          key={p.src}
          role="listitem"
          href={p.src}
          target="_blank"
          rel="noopener noreferrer"
          className="poster group"
          style={{ ["--tilt" as string]: `${i % 2 === 0 ? -7 : 6}deg` }}
          aria-label={`${p.title} 포스터 크게 보기`}
        >
          <span className="poster-img">
            <Image
              src={p.src}
              alt={`${p.title} 포스터`}
              width={280}
              height={396}
              className="h-full w-full object-cover"
              sizes="(max-width: 640px) 60vw, 240px"
            />
          </span>
          <span className="block pt-3 px-1">
            <span className="block font-bold text-[14px] leading-snug">{p.title}</span>
            <span className="block text-[12.5px] text-mute mt-0.5">{p.sub}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
