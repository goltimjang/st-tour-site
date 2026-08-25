import Image from "next/image";
import eventsData from "@/data/events.json";

type Photo = { src: string; w: number; h: number; caption: string };
const photos = eventsData as Photo[];

/**
 * 행사 현장 갤러리 — 실제 대회 사진 자동 슬라이드.
 * 포스터 진열대와 같은 마퀴 방식, 반대 방향으로 흘러 리듬감을 줌.
 */
export default function EventGallery() {
  if (photos.length === 0) return null;
  return (
    <div className="photo-marquee" aria-label="에스티골프투어 대회 현장 사진 (자동 슬라이드)">
      <div className="photo-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="photo-set" aria-hidden={copy === 1}>
            {photos.map((p) => (
              <figure key={`${copy}-${p.src}`} className="photo-card">
                <Image
                  src={p.src}
                  alt={copy === 0 ? `${p.caption} 현장 사진` : ""}
                  width={Math.round((p.w / p.h) * 240)}
                  height={240}
                  className="h-[200px] sm:h-[240px] w-auto object-cover"
                  sizes="(max-width: 640px) 300px, 400px"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navydeep/85 to-transparent px-4 pb-2.5 pt-8 text-[12px] font-bold text-white">
                  {p.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
