import type { Metadata } from "next";
import SavedProducts from "@/components/SavedProducts";
import { webPageLd } from "@/data/jsonld";
export const metadata: Metadata = { title: "저장한 골프투어 상품", description: "다시 보고 싶은 골프투어 상품을 모아 확인하세요.", alternates: { canonical: "/saved/" }, robots: { index: false, follow: true } };
export default function SavedPage() {
  return <section className="mx-auto max-w-6xl px-5 py-12 w-full"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(webPageLd("저장한 상품", "/saved/", "현재 브라우저에 저장한 골프투어 상품 목록."))}} /><h1 className="headline text-3xl mb-4">저장한 상품</h1><p className="text-mute mb-8">현재 기기의 브라우저에만 저장됩니다. 브라우저 데이터를 지우면 목록도 사라지며, 예약이나 티타임 확보를 뜻하지 않습니다.</p><SavedProducts /></section>;
}
