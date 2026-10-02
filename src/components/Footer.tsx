import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";

export default function Footer() {
  const c = site.company;
  return <footer className="site-footer">
    <section className="footer-invitation" aria-labelledby="footer-invitation-title">
      <picture className="footer-landscape" aria-hidden="true">
        <source media="(max-width: 639px)" srcSet="/images/brand/footer-golf-20261002-960.webp" />
        <Image src="/images/brand/footer-golf-20261002.webp" alt="" fill sizes="100vw" className="object-cover" />
      </picture>
      <div className="footer-shade" />
      <div className="footer-invitation-content mx-auto max-w-6xl px-5">
        <h2 id="footer-invitation-title" className="headline">다음 라운드의 설렘,<br />에스티골프투어와 함께.</h2>
        <p>가고 싶은 나라와 골프장,<br className="sm:hidden" /> 나에게 맞는 일정으로 준비하세요.</p>
        <div className="footer-actions">
          <a href="/#quick-quote" className="footer-quote">무료 견적받기 <span aria-hidden="true">↗</span></a>
          <Link href="/products/" className="footer-browse">골프여행 상품 둘러보기 <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
    <div className="footer-information mx-auto max-w-6xl px-5">
      <div className="footer-main">
        <div className="footer-brand">
          <Link href="/" aria-label="에스티골프투어 홈"><Image src="/logo-white.png" alt="에스티골프투어" width={214} height={28} className="h-7 w-auto" /></Link>
          <p>국내 라운드부터 해외 골프여행까지.<br />떠나고 싶은 마음에, 딱 맞는 여행을.</p>
          <div className="footer-socials">
            {site.kakaoUrl && <a href={site.kakaoUrl} target="_blank" rel="noopener noreferrer">카카오톡 상담 <span aria-hidden="true">↗</span></a>}
            <a href={site.bandUrl} target="_blank" rel="noopener noreferrer">네이버 밴드 <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <nav aria-label="푸터 바로가기" className="footer-navigation">
          <Link href="/products/">해외 골프상품</Link><Link href="/booking/">국내 할인부킹</Link><Link href="/promotion/">로얄CC 페스티벌</Link><Link href="/about/">에스티골프투어 소개</Link>
        </nav>
        <div className="footer-contact">
          <p>여행을 함께 준비하는 상담</p>
          <a href={site.phoneHref} className="footer-phone">{site.phone}</a>
          <p className="footer-hours">{c.hours}</p>
        </div>
      </div>
      <div className="footer-company">
        <div className="space-y-2"><p>상호 에스티투어(ST TOUR)<span className="mx-2">·</span>대표 {c.ceo}</p><p>{c.address}</p><p>사업자등록번호 {c.bizNo}</p></div>
        <div className="footer-insurance"><span className="footer-insurance-logo"><Image src="/images/sgi.png" alt="SGI 서울보증" width={101} height={28} className="h-6 w-auto" /></span><p>{c.insurance}</p></div>
      </div>
      <div className="footer-legal">
        <div className="flex flex-wrap gap-x-5 gap-y-3"><Link href="/terms/">이용약관 · 취소환불 규정</Link><Link href="/privacy/" className="font-bold text-white">개인정보처리방침</Link></div>
        <p>© {new Date().getFullYear()} ST TOUR. All rights reserved.</p>
      </div>
    </div>
  </footer>;
}
