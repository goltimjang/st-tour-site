import Image from "next/image";
import { posters } from "@/data/posters";

/**
 * 대회 포스터 입체 진열대: 자동 무한 슬라이드(마퀴), 호버 시 일시정지.
 * 트랙에 포스터를 두 벌 이어붙여 절반만큼 이동을 무한 반복.
 */
export default function PosterShelf({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="poster-marquee" aria-label="에스티골프투어 대회 포스터 (자동 슬라이드)">
      <div className="poster-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="poster-set" aria-hidden={copy === 1}>
            {posters.map((p, i) => (
              <a
                key={`${copy}-${p.src}`}
                href={p.src}
                target="_blank"
                rel="noopener noreferrer"
                className="poster group"
                style={{ ["--tilt" as string]: `${i % 2 === 0 ? -7 : 6}deg` }}
                tabIndex={copy === 1 ? -1 : 0}
                aria-label={copy === 0 ? `${p.title} 포스터 크게 보기` : undefined}
              >
                <span className="poster-img">
                  <Image
                    src={p.src}
                    alt={copy === 0 ? `${p.title} 포스터` : ""}
                    width={280}
                    height={396}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 640px) 60vw, 240px"
                  />
                </span>
                <span className="block pt-3 px-1">
                  <span className={`block font-bold text-[14px] leading-snug ${onDark ? "text-white" : ""}`}>{p.title}</span>
                  <span className={`block text-[12.5px] mt-0.5 ${onDark ? "text-sky" : "text-mute"}`}>{p.sub}</span>
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
