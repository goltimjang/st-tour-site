import type { Metadata } from "next";
import Link from "next/link";
import { publishedProducts } from "@/data/products";
import { site } from "@/data/site";
import { breadcrumbLd, webPageLd } from "@/data/jsonld";
import { catalogCountries } from "@/data/catalog";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "해외 골프여행 상품 | 국가·지역·출발지별 비교",
  description:
    "베트남·태국·일본·중국·괌 등 해외 골프여행과 파크골프 상품. 국가·지역·출발지별 상품과 참고 최저가를 비교하고 에스티골프투어에 무료 견적을 요청하세요.",
  alternates: { canonical: "/products/" },
};

const crumbLd = breadcrumbLd([{ name: "골프투어 상품", path: "/products/" }]);
const pageLd = webPageLd(
  "해외 골프여행 상품 | 국가·지역·출발지별 비교",
  "/products/",
  "에스티골프투어가 진행하는 국내·해외 골프투어 패키지 목록."
);

const listLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "에스티골프투어 골프투어 상품",
  numberOfItems: publishedProducts.length,
  itemListElement: publishedProducts.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: p.title,
    url: `${site.domain}/products/${p.slug}/`,
  })),
};

export default function ProductsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />

      <section className="bg-white border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16 hero-anim">
          <p className="eyebrow text-royal mb-3">나에게 맞는 여행 찾기</p>
          <h1 className="headline text-[30px] sm:text-[42px] text-navy mb-4">해외 골프여행 상품</h1>
          <p className="text-mute text-[16.5px] max-w-2xl leading-relaxed">
            골프텔부터 다색골프, 파크골프까지. 지역과 출발지를 골라 상품을 비교해보세요.
            선택한 상품으로 문의하시면 출발일별 예약 가능 여부와 최종 견적을 안내합니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
        <nav aria-label="국가별 상품 페이지" className="flex flex-wrap gap-x-5 gap-y-1 mb-5">{catalogCountries.map(c => <Link key={c.slug} href={`/products/country/${c.slug}/`} className="text-sm min-h-11 inline-flex items-center text-royaldark underline">{c.name}</Link>)}</nav>
        <p className="text-sm text-mute rounded-xl bg-white border border-line p-4 mb-6">가격은 2026.09.29 조회 기준 1인 참고 최저가입니다. 출발일·항공·객실과 프로모션 적용 조건에 따라 달라집니다. 실시간 가격·예약 가능 여부는 상담 시 확인합니다.</p>
        <Link href="/saved/" className="inline-block mb-5 py-2 underline text-royaldark">저장한 상품 보기</Link>
        {publishedProducts.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white p-10 text-center">
            <p className="text-[17px] font-bold mb-2">준비 중인 상품이 있습니다</p>
            <p className="text-mute text-[15px] mb-6">
              지금은 등록된 패키지가 없지만, 원하시는 지역과 날짜를 보내주시면 맞춤 견적을 드립니다.
            </p>
            <Link href="/domestic#quote" className="btn btn-royal">견적 요청하기</Link>
          </div>
        ) : (
          <ProductGrid products={publishedProducts} />
        )}

        <div className="mt-10 rounded-2xl bg-paper p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <p className="text-[15.5px] leading-relaxed">
            찾으시는 상품이 없나요? <b>지역과 날짜만 알려주시면 예약 가능 여부를 확인해</b> 맞춤 견적서를 보내드립니다.
          </p>
          <div className="flex gap-3 shrink-0">
            <Link href="/domestic#quote" className="btn btn-royal !min-h-[46px] !px-5 text-[15px]">국내 견적</Link>
            <Link href="/overseas#quote" className="btn btn-light !min-h-[46px] !px-5 text-[15px]">해외 견적</Link>
          </div>
        </div>
      </section>
    </>
  );
}
