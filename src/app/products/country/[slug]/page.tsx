import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogCountries } from "@/data/catalog";
import { site } from "@/data/site";
import { breadcrumbLd, webPageLd } from "@/data/jsonld";
import ProductGrid from "@/components/ProductGrid";
export function generateStaticParams() { return catalogCountries.map(c => ({ slug: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug: string}> }): Promise<Metadata> {
  const {slug} = await params; const country = catalogCountries.find(c => c.slug === slug);
  if (!country) return {};
  return {title: `${country.name} 골프여행 상품·가격 비교`, description: country.intro, alternates: {canonical: `/products/country/${slug}/`}, openGraph: {images: [{url: country.products[0].thumb, alt: `${country.name} 골프여행`}]}};
}
export default async function CountryProducts({params}: {params: Promise<{slug:string}>}) {
  const {slug} = await params; const c = catalogCountries.find(c => c.slug === slug); if (!c) notFound();
  const path = `/products/country/${slug}/`;
  const schemas = [webPageLd(`${c.name} 골프여행 상품`, path, c.intro), breadcrumbLd([{name: "해외 골프상품", path:"/products/"}, {name:`${c.name} 골프여행`,path}]), {"@context":"https://schema.org","@type":"ItemList",name:`${c.name} 골프여행 상품`,numberOfItems:c.products.length,itemListElement:c.products.map((p,i)=>({"@type":"ListItem",position:i+1,name:p.title,url:`${site.domain}/products/${p.slug}/`}))}];
  return <>{schemas.map((s,i)=><script key={i} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(s)}}/>)}
    <section className="bg-white border-b border-line"><div className="mx-auto max-w-6xl px-5 py-10 sm:py-14"><Link href="/products/" className="text-sm text-mute underline">전체 해외 골프상품</Link><h1 className="headline text-3xl sm:text-4xl text-navy mt-5 mb-4">{c.name} 골프여행</h1><p className="text-mute max-w-3xl">{c.intro}</p><p className="mt-4 text-sm text-mute">{[...new Set(c.products.flatMap(p => p.area ? [p.area] : []))].join(" · ")}</p></div></section>
    <section className="mx-auto max-w-6xl px-5 py-9"><p className="text-sm text-mute mb-6">2026.09.29 조회 기준 1인 참고 최저가입니다. 출발일·항공·객실·프로모션 조건에 따라 금액이 달라지며, 예약 가능 여부와 최종금액은 상담으로 확인합니다.</p><ProductGrid products={c.products} fixedCountry={c.name}/><div className="rounded-2xl bg-white border border-line p-6 mt-10"><h2 className="text-xl font-bold mb-3">{c.name} 골프여행, 어떤 조건을 비교하면 좋을까요?</h2><p className="text-mute">희망 지역과 출발지, 숙박할 객실의 인원부터 정해보세요. 항공 포함 여부, 라운드 횟수, 카트·캐디·팁과 현지 이동 비용까지 확인하면 상품별 총비용을 비교하기 쉽습니다. 상품을 선택해 상담을 요청하면 해당 출발일의 조건을 안내해드립니다.</p><a href={site.phoneHref} className="btn btn-royal mt-5">전화로 여행 상담</a></div></section>
  </>;
}
