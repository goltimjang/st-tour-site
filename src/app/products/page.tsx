import type { Metadata } from "next";
import Link from "next/link";
import { publishedProducts } from "@/data/products";
import { site } from "@/data/site";
import { breadcrumbLd, webPageLd } from "@/data/jsonld";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "골프투어 상품 | 진행 중인 패키지 모아보기",
  description:
    "에스티골프투어가 진행하는 국내·해외 골프투어 패키지입니다. 일정과 포함 사항, 가격을 확인하고 바로 견적을 요청하세요.",
  alternates: { canonical: "/products/" },
};

const crumbLd = breadcrumbLd([{ name: "골프투어 상품", path: "/products/" }]);
const pageLd = webPageLd(
  "골프투어 상품 | 진행 중인 패키지 모아보기",
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
          <p className="eyebrow text-royal mb-3">Products</p>
          <h1 className="headline text-[30px] sm:text-[42px] text-navy mb-4">골프투어 상품</h1>
          <p className="text-mute text-[16.5px] max-w-2xl leading-relaxed">
            진행 중인 패키지입니다. 상품을 누르면 일정과 포함 사항, 가격을 전부 확인하실 수 있습니다.
            원하시는 조건이 없으면 견적 요청서를 보내주세요. 조건에 맞게 새로 짜드립니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
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
            찾으시는 상품이 없나요? <b>지역과 날짜만 알려주시면 24시간 안에</b> 맞춤 견적서를 보내드립니다.
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
