import type { Metadata } from "next";
import Image from "next/image";
import BookingImage from "@/components/BookingImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bookingCourses } from "@/data/booking-courses";
import { breadcrumbLd, webPageLd } from "@/data/jsonld";
import BookingInquiryForm from "@/components/BookingInquiryForm";
import { site } from "@/data/site";
import AutoCarousel from "@/components/AutoCarousel";
const bookingFaqs = [["문의를 보내면 바로 예약되나요?", "아닙니다. 담당자가 가능한 티타임과 금액을 안내하고, 고객님이 조건을 확인한 후 예약을 진행합니다. 확정 안내 전에는 티타임이 확보되지 않습니다."], ["모든 날짜에 할인되나요?", "할인 적용 여부와 금액은 날짜, 시간대, 인원 및 골프장 운영 상황에 따라 달라집니다. 희망 조건을 알려주시면 적용 가능한 조건을 확인합니다."], ["원하는 부나 인원으로 예약할 수 있나요?", "1부·2부·3부는 희망 시간대입니다. 실제 운영 여부, 티타임, 3·4인 또는 단체 이용 조건은 별도 확인 후 안내합니다."], ["변경·취소 조건은 어떻게 확인하나요?", "예약 확정 전에 결제 방법과 골프장의 변경·취소 및 우천 시 운영 조건을 안내합니다. 안내받은 조건을 확인한 후 예약해주세요."]];
export function generateStaticParams() { return bookingCourses.map(c => ({ slug: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const c = bookingCourses.find(c => c.slug === slug); if (!c) return {};
  if (c.bookingMode === "phone") return { title: `${c.name} 할인부킹 | 전화로 티타임·금액 확인 후 예약`, description: `${c.name} 할인부킹은 에스티골프투어 전화 예약으로 안내합니다. ${c.area} 코스와 시설 사진을 보고 희망 날짜·시간대·인원을 전화로 알려주세요.`, alternates: { canonical: `/booking/${slug}/` }, openGraph: { images: [{ url: c.photos[0].src, alt: c.photos[0].caption }] } };
  return { title: `${c.name} 할인부킹 | 날짜·희망 부 선택 후 금액 문의`, description: `${c.name} 할인 예약 문의. ${c.area} 골프장 코스와 시설을 보고 희망 날짜·부·연락처를 남겨주세요. 가능 여부와 할인 금액을 확인해 안내합니다.`, alternates: { canonical: `/booking/${slug}/` }, openGraph: { images: [{ url: c.photos[0].src, alt: c.photos[0].caption }] } };
}
export default async function BookingCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const c = bookingCourses.find(c => c.slug === slug); if (!c) notFound();
  const phoneOnly = c.bookingMode === "phone";
  const faqs = phoneOnly ? [["어떻게 예약하나요?", "전화로 예약하기 버튼을 누르면 에스티골프투어로 연결됩니다. 희망 날짜·시간대·인원을 알려주시면 티타임과 금액을 안내하고 예약을 진행합니다. 최종 예약 확정 안내를 확인해주세요."], ...bookingFaqs.slice(1)] : bookingFaqs;
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([q,a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd(`${c.name} 할인부킹`, `/booking/${slug}/`, c.summary)) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([{ name: "할인부킹", path: "/booking/" }, { name: c.name, path: `/booking/${slug}/` }])) }} />
    <section className="max-w-6xl mx-auto px-5 pt-6 pb-10">
      <Link href="/booking/" className="inline-block text-sm text-mute py-3">← 할인부킹 골프장</Link>
      <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12 items-start mt-2">
        <div className="min-w-0"><div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden"><BookingImage src={c.photos[0].src} alt={c.photos[0].caption} fill priority sizes="(max-width: 1023px) 100vw, 600px" className="object-cover" /><span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-sm font-bold">{c.area} · 할인부킹</span></div>
          <div className="py-7"><p className="eyebrow text-[#315d42] mb-2">예약하기 전, 에스티 할인 혜택</p><div className="flex items-center gap-3">{c.logo && <Image src={c.logo} alt="" width={48} height={42} />}<h1 className="headline text-3xl sm:text-4xl">{c.name}</h1></div><p className="text-xl font-bold mt-4">같은 라운드도 더 합리적인 금액으로.</p><p className="text-mute mt-3">일반 예약보다 부담을 낮출 수 있는 에스티골프투어 할인부킹. 원하는 날짜와 희망 부를 알려주시면 적용 가능한 할인 금액을 확인해드립니다.</p></div>
          <div className="rounded-2xl bg-[#edf3eb] p-5"><p className="font-bold text-[#315d42]">할인 금액은 문의 후 안내합니다</p><p className="text-sm text-mute mt-2">날짜·시간대·인원에 따라 금액과 할인 적용 여부가 달라집니다. 그린피, 카트비, 캐디피와 식사 등 포함·별도 비용을 함께 확인해 안내합니다.</p></div>
          <ol className="grid grid-cols-3 gap-3 mt-6 text-sm">{["날짜·희망 부 전달", "가능 여부·금액 안내", "조건 확인 후 예약"].map((text, i) => <li key={text} className="border-t-2 border-line pt-3"><span className="block text-royaldark font-bold mb-2">0{i + 1}</span>{text}</li>)}</ol>
        </div>
        <div id={phoneOnly ? "reservation" : "quote"} className="scroll-mt-24 min-w-0">{phoneOnly ? <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-soft lg:sticky lg:top-24"><p className="eyebrow text-[#315d42]">에스티골프투어 전화 예약</p><h2 className="headline text-2xl mt-3">가고 싶은 날짜,<br />전화 한 통으로 확인하세요.</h2><p className="text-mute mt-4">희망 날짜와 시간대, 인원을 알려주세요. 가능한 티타임과 할인 금액을 확인하고 예약을 도와드립니다.</p><ul className="my-6 space-y-3 rounded-2xl bg-paper p-5 text-sm"><li>01 · 희망 날짜와 시간대</li><li>02 · 이용 인원과 팀 수</li><li>03 · 이용 금액과 포함·별도 비용 확인</li></ul><a href={site.phoneHref} className="btn btn-royal w-full">전화로 예약하기</a><p className="text-center font-bold text-xl mt-4">{site.phone}</p><p className="text-xs text-mute mt-3">전화 상담 · {site.company.hours.split(" (")[0]}</p><p className="text-sm text-mute mt-5">전화 연결 후 담당자의 최종 예약 확정 안내를 확인해주세요. 날짜·시간대별 할인 적용과 잔여 티타임은 달라질 수 있습니다.</p></div> : <BookingInquiryForm course={{ name: c.name, slug: c.slug }} />}</div>
      </div>
    </section>
    <section className="bg-white border-y border-line"><div className="max-w-6xl mx-auto px-5 py-12"><h2 className="headline text-2xl mb-6">라운드부터 식사까지, 미리 살펴보세요</h2><AutoCarousel label={`${c.name} 시설 사진`} variant="photos">{c.photos.map(p => <figure key={p.src} className="rounded-2xl overflow-hidden border border-line"><BookingImage src={p.src} alt={p.caption} width={700} height={460} sizes="(max-width: 639px) 85vw, 530px" className="w-full aspect-[3/2] object-cover" /></figure>)}</AutoCarousel><div className="grid md:grid-cols-3 gap-6 mt-8">{c.features.map(f => <div key={f.title}><h3 className="font-bold text-lg mb-2">{f.title}</h3><p className="text-sm text-mute">{f.text}</p></div>)}</div><p className="text-sm text-mute mt-7">{c.address} · <a href={c.officialUrl} target="_blank" rel="noopener noreferrer" className="underline">골프장 공식 안내</a></p></div></section>
    <section className="max-w-6xl mx-auto px-5 py-12"><h2 className="headline text-2xl mb-5">문의 전에 확인해주세요</h2><div className="space-y-3">{faqs.map(([q,a]) => <details key={q} className="border border-line bg-white rounded-xl p-5"><summary className="font-bold cursor-pointer">{q}</summary><p className="text-mute mt-3">{a}</p></details>)}</div><a href={phoneOnly ? site.phoneHref : "#quote"} className="btn btn-royal mt-7">{phoneOnly ? "전화로 예약하기" : "할인부킹 견적받기"}</a></section>
  </>;
}
