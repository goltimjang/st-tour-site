import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { publishedProducts, findProduct } from "@/data/products";
import { site } from "@/data/site";
import { breadcrumbLd, webPageLd } from "@/data/jsonld";
import ProductActions from "@/components/ProductActions";
import Reveal from "@/components/Reveal";
import QuoteForm from "@/components/QuoteForm";
import ProductCard from "@/components/ProductCard";
import { countryHref } from "@/data/catalog";

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

  const others = publishedProducts.filter((x) => x.slug !== slug && x.country === p.country).slice(0, 3);

  const crumbLd = breadcrumbLd([
    { name: "골프투어 상품", path: "/products/" },
    { name: p.title, path: `/products/${slug}/` },
  ]);

  const pageLd = webPageLd(p.title, `/products/${slug}/`, p.summary);

  // 가격이 숫자로 표기된 경우에만 Offer 금액을 넣는다 (견적 문의는 제외)
  const priceNumber = Number(p.price.replace(/[^0-9]/g, ""));
  const productLd = {
    "@context": "https://schema.org",
    "@type": p.provider ? "TouristTrip" : "Product",
    name: p.title,
    description: p.summary,
    image: `${site.domain}${p.thumb}`,
    ...(p.provider ? { touristType: "골프여행", provider: { "@id": `${site.domain}/#organization` }, itinerary: { "@type": "Place", name: `${p.country} ${p.area}` } } : { brand: { "@id": `${site.domain}/#organization` } }),
    ...(!p.provider && priceNumber > 0 && {
      offers: {
        "@type": "Offer",
        price: priceNumber,
        priceCurrency: "KRW",
        url: `${site.domain}/products/${slug}/`,
      },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />

      <section className="bg-white border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
          <Link href="/products" className="text-[14px] font-semibold text-mute hover:text-royal">
            ← 상품 목록으로
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-8 md:gap-10 mt-5 items-start">
            {/* 1:1 썸네일 */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-line">
              <Image src={p.thumb} alt={p.title} fill priority sizes="(max-width: 768px) 100vw, 380px" className="object-cover" />
              {p.badge && (
                <span className="absolute left-4 top-4 rounded-full bg-gold text-navydeep text-[12.5px] font-black px-3.5 py-1.5">
                  {p.badge}
                </span>
              )}
            </div>

            <div>
              <p className="text-[13.5px] text-mute mb-2">
                {p.kind} · <Link href={countryHref(p.country)} className="underline">{p.country}</Link>{p.area ? ` · ${p.area}` : ""}
                {p.duration ? ` · ${p.duration}` : ""}
              </p>
              <h1 className="headline text-[26px] sm:text-[36px] text-navy mb-3 leading-tight">{p.title}</h1>
              <p className="text-[16px] text-mute leading-relaxed mb-5">{p.summary}</p>

              {p.date && <p className="text-[15.5px] mb-1"><b>일정</b> · {p.date}</p>}

              <p className="mt-4 mb-6 flex flex-col items-start gap-1">
                {p.priceOriginal && (
                  <span className="text-mute/70 line-through mr-3 text-[17px]">{p.priceOriginal}</span>
                )}
                {p.provider && <span className="text-sm text-mute">1인 참고 최저가 · {p.priceCheckedAt} 조회</span>}
                <span className="font-display text-[32px] sm:text-[38px] text-royaldark">{p.price}</span>
                {p.priceNote && <span className="text-mute text-[14px]">{p.priceNote}</span>}
              </p>

              {p.provider && <div className="rounded-xl bg-paper border border-line p-4 text-sm text-mute mb-5"><p>출발일·항공·객실·인원과 적용 가능한 할인 조건에 따라 금액이 달라집니다. 표시 금액은 실시간 가격이나 확정 견적이 아닙니다.</p><p className="mt-2">예약 전 최종금액, 포함·불포함 내역과 취소 조건을 확인해 드립니다.</p></div>}
              {p.excludes && <p className="text-sm text-mute mb-5">별도 비용: {p.excludes.join(" · ")}</p>}
              <div className="flex flex-col gap-3 max-w-xl">
                <Link href={p.quoteUrl ?? (p.kind === "국내" ? "/domestic/#quote" : "/overseas/#quote")} className="btn btn-royal">이 일정 무료 견적 받기</Link>
                <a href={site.phoneHref} className="btn btn-light">전화 문의 {site.phone}</a>
              </div>
              <p className="text-sm text-mute mt-4">예약 가능 인원과 항공·객실은 상담 후 확인합니다. 상품 안내 확인일: {p.updatedAt ?? p.postedAt}</p>
              <ProductActions slug={p.slug} title={p.title} />
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
        <section className="mx-auto max-w-6xl px-5 mt-6 relative z-10">
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

      {p.provider ? <section id="quote" className="mx-auto max-w-6xl px-5 pb-14 scroll-mt-28">
        <div className="grid lg:grid-cols-[0.7fr_1fr] gap-8 items-start">
          <div><p className="eyebrow text-royaldark mb-2">에스티골프투어 상품 상담</p><h2 className="headline text-2xl sm:text-3xl mb-4">이 상품으로<br />여행을 준비해볼까요?</h2><p className="text-mute mb-5">희망 날짜와 인원만 알려주세요. 해당 출발일의 예약 가능 여부와 견적을 확인해드립니다.</p><div className="rounded-2xl bg-white border border-line p-5"><h3 className="font-bold mb-3">예약 전에 함께 확인합니다</h3><ul className="text-sm text-mute space-y-2"><li>항공 포함 여부·출발 공항·수하물</li><li>숙박 호텔·객실 인원·식사 구성</li><li>골프장·홀 수·카트·캐디·팁</li><li>현지 이동·최소 출발인원·추가 비용</li><li>예약 가능 여부·총금액·취소 및 환불 조건</li></ul><p className="text-xs text-mute mt-4">위 항목은 확인할 사항이며, 모두 포함되어 있다는 의미는 아닙니다. 출발일별 상세 일정표는 상담 시 안내합니다.</p></div><a href={site.phoneHref} className="btn btn-light mt-5 w-full">전화 상담 {site.phone}</a><p className="text-xs text-mute mt-4">상품 안내·사진: 하나투어 공급 자료 기반<br />상담·견적 접수: 에스티골프투어</p></div>
          <QuoteForm type="overseas" inquiryProduct={{ id: p.slug, title: p.title, country: p.country, area: p.area ?? "" }} />
        </div>
      </section> : <section className="mx-auto max-w-6xl px-5 pb-14"><div className="rounded-2xl bg-navy text-white p-7 sm:p-9"><h2 className="headline text-2xl mb-3">이 상품으로 견적을 받아보세요</h2><p className="text-white/80 mb-5">날짜와 인원을 알려주시면 예약 가능 여부와 포함 내역을 안내합니다.</p><Link href={p.quoteUrl ?? "/overseas/#quote"} className="btn btn-royal">이 일정 무료 견적 받기</Link></div></section>}

      {/* 다른 상품 */}
      {others.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-16">
          <h2 className="headline text-xl sm:text-2xl mb-5">다른 상품</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {others.map(o => <ProductCard key={o.slug} product={o} />)}
          </div>
        </section>
      )}
    </>
  );
}
