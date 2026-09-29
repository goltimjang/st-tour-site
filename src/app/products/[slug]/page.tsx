import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { publishedProducts, findProduct } from "@/data/products";
import { site } from "@/data/site";
import { breadcrumbLd, webPageLd } from "@/data/jsonld";
import ProductActions from "@/components/ProductActions";
import ProductDetails from "@/components/ProductDetails";
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

  return <>
    {[crumbLd,pageLd,productLd].map((ld,i)=><script key={i} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld)}} />)}
    <div className="mx-auto max-w-6xl px-5 pt-6 pb-14">
      <nav aria-label="현재 위치" className="text-sm text-mute mb-5"><Link href="/products/">해외 골프상품</Link><span className="mx-2">/</span><Link href={countryHref(p.country)}>{p.country}</Link></nav>
      <section className="grid md:grid-cols-2 gap-6 sm:gap-9 mb-8 items-center">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden"><Image src={p.thumb} alt={p.title} fill priority sizes="(max-width: 768px) 100vw, 550px" className="object-cover"/><span className="absolute top-4 left-4 rounded-lg bg-white/95 px-3 py-2 text-sm font-bold">항공권 별도</span></div>
        <div><p className="text-sm font-semibold text-royaldark mb-2">{p.country} · {p.area || "하노이·닌빈"} · {p.theme || "골프투어"}</p><h1 className="headline text-[26px] sm:text-[34px] leading-snug text-navy">{p.title}</h1><p className="mt-4 text-mute">{p.duration}</p>
          <div className="mt-6 rounded-2xl bg-white border border-line p-5"><p className="text-sm text-mute">항공 제외 · {p.priceFrom ? "1인 참고가" : "현지 일정 견적"}</p><p className="text-3xl font-bold text-royaldark mt-1">{p.price}</p><p className="text-sm text-mute mt-2">{p.priceFrom ? `${p.priceCheckedAt} 확인 · 출발일별 금액 재확인` : "선택한 날짜와 인원에 맞춰 견적서를 보내드려요."}</p></div>
          <div className="flex flex-col sm:flex-row gap-3 mt-5"><a href="#quote" className="btn btn-royal flex-1">출발일 선택 · 견적 요청</a><a href={site.phoneHref} className="btn btn-light">전화 상담</a></div><ProductActions slug={p.slug} title={p.title}/>
        </div>
      </section>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,390px)] gap-6 items-start">
        <div className="min-w-0 order-2 lg:order-1"><ProductDetails product={p}/><p className="text-xs text-mute mt-4 px-1">{p.provider ? "하나투어 공급 자료 기반 · 상담 및 견적: 에스티골프투어" : "에스티골프투어 상품 안내"}<br/>안내 확인일 {p.detailCheckedAt || p.updatedAt || p.postedAt}</p></div>
        <section id="quote" className="min-w-0 order-1 lg:order-2 lg:sticky lg:top-24 scroll-mt-24"><h2 className="font-bold text-xl mb-3">출발일을 알려주세요</h2><QuoteForm type="overseas" inquiryProduct={{id:p.slug,title:p.title,country:p.country,area:p.area||"하노이·닌빈",duration:p.duration}} /></section>
      </div>
      {others.length>0 && <section className="mt-14"><h2 className="headline text-2xl mb-5">같은 지역의 다른 여행</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{others.map(o=><ProductCard key={o.slug} product={o}/>)}</div></section>}
    </div>
  </>;
}
