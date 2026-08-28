import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { publishedProducts, findProduct } from "@/data/products";
import { site } from "@/data/site";
import { breadcrumbLd } from "@/data/jsonld";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return publishedProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = findProduct(slug);
  if (!p) return {};
  return {
    title: `${p.title} | 골프투어 상품`,
    description: p.summary,
    alternates: { canonical: `/products/${slug}/` },
    openGraph: { images: [{ url: p.thumb, alt: p.title }] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = findProduct(slug);
  if (!p) notFound();

  const others = publishedProducts.filter((x) => x.slug !== slug).slice(0, 3);

  const crumbLd = breadcrumbLd([
    { name: "골프투어 상품", path: "/products/" },
    { name: p.title, path: `/products/${slug}/` },
  ]);

  // 가격이 숫자로 표기된 경우에만 Offer 금액을 넣는다 (견적 문의는 제외)
  const priceNumber = Number(p.price.replace(/[^0-9]/g, ""));
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.summary,
    image: `${site.domain}${p.thumb}`,
    brand: { "@id": `${site.domain}/#organization` },
    ...(priceNumber > 0 && {
      offers: {
        "@type": "Offer",
        price: priceNumber,
        priceCurrency: "KRW",
        availability: "https://schema.org/InStock",
        url: `${site.domain}/products/${slug}/`,
      },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />

      <section className="bg-white border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
          <Link href="/products" className="text-[14px] font-semibold text-mute hover:text-royal">
            ← 상품 목록으로
          </Link>

          <div className="grid md:grid-cols-[minmax(0,380px)_1fr] gap-8 md:gap-10 mt-5 items-start">
            {/* 1:1 썸네일 */}
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-line">
              <Image src={p.thumb} alt={p.title} fill priority sizes="(max-width: 768px) 100vw, 380px" className="object-cover" />
              {p.badge && (
                <span className="absolute left-4 top-4 rounded-full bg-gold text-navydeep text-[12.5px] font-black px-3.5 py-1.5">
                  {p.badge}
                </span>
              )}
            </div>

            <div>
              <p className="text-[13.5px] text-mute mb-2">
                {p.kind} · {p.country}
                {p.duration ? ` · ${p.duration}` : ""}
              </p>
              <h1 className="headline text-[26px] sm:text-[36px] text-navy mb-3 leading-tight">{p.title}</h1>
              <p className="text-[16px] text-mute leading-relaxed mb-5">{p.summary}</p>

              {p.date && <p className="text-[15.5px] mb-1"><b>일정</b> · {p.date}</p>}

              <p className="mt-4 mb-6">
                {p.priceOriginal && (
                  <span className="text-mute/70 line-through mr-3 text-[17px]">{p.priceOriginal}</span>
                )}
                <span className="font-display text-[32px] sm:text-[38px] text-royaldark">{p.price}</span>
                {p.priceNote && <span className="text-mute text-[14px] ml-2">{p.priceNote}</span>}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <a href={site.phoneHref} className="btn btn-royal flex-1">전화 문의 {site.phone}</a>
                <Link href={p.kind === "국내" ? "/domestic#quote" : "/overseas#quote"} className="btn btn-light flex-1">
                  견적 요청하기
                </Link>
              </div>
              {site.kakaoUrl && (
                <a
                  href={site.kakaoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-[14.5px] font-semibold text-royaldark underline"
                >
                  카카오톡으로 문의하기
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 정보 */}
      {p.highlights && p.highlights.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 -mt-6 relative z-10">
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden bg-white border border-line shadow-soft divide-x divide-y lg:divide-y-0 divide-line">
              {p.highlights.map((h) => (
                <div key={h.label} className="px-5 py-4">
                  <p className="eyebrow text-royal">{h.label}</p>
                  <p className="text-[14.5px] font-bold mt-1">{h.value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* 설명 */}
      {p.body && p.body.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-12 sm:py-14">
          <div className="max-w-3xl space-y-4">
            {p.body.map((t, i) => (
              <p key={i} className="text-[16px] leading-relaxed">{t}</p>
            ))}
          </div>
        </section>
      )}

      {/* 일정 */}
      {p.itinerary && p.itinerary.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-12 sm:pb-14">
          <h2 className="headline text-xl sm:text-2xl mb-5">일정</h2>
          <ol className="space-y-3 max-w-3xl">
            {p.itinerary.map((d, i) => (
              <Reveal key={d.day} delay={i * 60}>
                <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-5 rounded-xl border border-line bg-white p-5">
                  <span className="font-display text-golddeep text-[15px] shrink-0 w-36">{d.day}</span>
                  <span className="text-[15.5px]">{d.plan}</span>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {/* 포함·불포함 */}
      {(p.includes?.length || p.excludes?.length) && (
        <section className="bg-white border-y border-line">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:py-14 grid md:grid-cols-2 gap-6">
            {p.includes && p.includes.length > 0 && (
              <div className="rounded-2xl border border-line bg-paper p-7">
                <h2 className="font-bold text-[18px] mb-4 text-golddeep">✓ 포함 사항</h2>
                <ul className="space-y-2.5 text-[15px]">
                  {p.includes.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <span className="text-gold font-black shrink-0" aria-hidden="true">·</span>{x}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {p.excludes && p.excludes.length > 0 && (
              <div className="rounded-2xl border border-line bg-paper p-7">
                <h2 className="font-bold text-[18px] mb-4 text-mute">✕ 불포함 사항</h2>
                <ul className="space-y-2.5 text-[15px]">
                  {p.excludes.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <span className="text-mute font-black shrink-0" aria-hidden="true">·</span>{x}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 갤러리 */}
      {p.gallery && p.gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-12 sm:py-14">
          <h2 className="headline text-xl sm:text-2xl mb-5">사진</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {p.gallery.map((g, i) => (
              <div key={g} className="relative aspect-square rounded-xl overflow-hidden border border-line">
                <Image src={g} alt={`${p.title} 사진 ${i + 1}`} fill sizes="(max-width: 640px) 50vw, 300px" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-14">
        <div className="rounded-2xl bg-navy text-white p-7 sm:p-9">
          <h2 className="headline text-[22px] sm:text-[26px] mb-2">이 상품으로 견적을 받아보세요</h2>
          <p className="text-white/75 text-[15.5px] mb-6 max-w-2xl leading-relaxed">
            인원과 날짜를 보내주시면 24시간 안에 항공·숙박·그린피 원가와 대행비가 분리된 견적서를 보내드립니다.
            일정 조정이나 인원 변경도 상담해 드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <Link href={p.kind === "국내" ? "/domestic#quote" : "/overseas#quote"} className="btn btn-gold flex-1">
              견적 요청하기
            </Link>
            <a href={site.phoneHref} className="btn flex-1 bg-white/95 text-navy font-bold hover:bg-white">
              전화 {site.phone}
            </a>
          </div>
        </div>
      </section>

      {/* 다른 상품 */}
      {others.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-16">
          <h2 className="headline text-xl sm:text-2xl mb-5">다른 상품</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/products/${o.slug}`}
                className="group card-lift block rounded-2xl overflow-hidden border border-line bg-white"
              >
                <div className="img-zoom relative aspect-square">
                  <Image src={o.thumb} alt={o.title} fill sizes="300px" className="object-cover" />
                </div>
                <div className="p-4">
                  <p className="font-bold text-[15.5px] leading-snug group-hover:text-royal">{o.title}</p>
                  <p className="font-display text-royaldark mt-1.5">{o.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
