"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { site } from "@/data/site";
import SiteSearch from "@/components/SiteSearch";

type NavItem = { href: string; label: string; children?: { href: string; label: string }[] };

const nav: NavItem[] = [
  { href: "/products/", label: "해외 골프상품", children: [{ href: "/products/", label: "전체 해외 상품" }, { href: "/products/country/vietnam/", label: "베트남 골프상품" }, { href: "/products/country/thailand/", label: "태국 골프상품" }, { href: "/products/country/japan/", label: "일본 골프상품" }, { href: "/products/?theme=파크골프", label: "파크골프 여행" }, { href: "/saved/", label: "저장한 상품" }] },
  { href: "/overseas/", label: "맞춤 골프여행", children: [{ href: "/overseas/", label: "해외 맞춤 견적·골프장" }, { href: "/domestic/", label: "국내 맞춤 견적·골프장" }, { href: "/seasons/", label: "시즌별 여행지" }] },
  { href: "/booking/", label: "할인부킹" },
  { href: "/promotion/", label: "로얄CC 페스티벌" },
  { href: "/about/", label: "회사소개" },
];

/** 밝은 플로팅 카드형 헤더: 흰색 라운드 바 + 부드러운 그림자 */
export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-5 pt-3 pb-1">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white/95 backdrop-blur-md border border-white shadow-[0_10px_34px_rgba(6,20,62,0.10)]">
        <div className="h-[64px] flex items-center justify-between gap-2 px-3 sm:px-5">
          <Link href="/" className="shrink-0" aria-label="에스티골프투어 홈">
            <Image src="/logo-black.png" alt="에스티골프투어" width={214} height={28} priority className="h-auto w-[156px] sm:w-[190px]" />
          </Link>

          <nav className="hidden xl:flex items-center gap-4" aria-label="주 메뉴">
            {nav.map((n) =>
              n.children ? (
                <div key={n.href} className="relative group">
                  <Link
                    href={n.href}
                    className="flex items-center gap-1 whitespace-nowrap text-[14.5px] font-semibold text-ink/75 hover:text-royal transition-colors"
                  >
                    {n.label}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                      <path d="M5 9l7 7 7-7" />
                    </svg>
                  </Link>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 hidden group-hover:block group-focus-within:block">
                    <div className="rounded-xl bg-white border border-line shadow-[0_12px_30px_rgba(6,20,62,0.14)] py-2 min-w-[180px]">
                      {n.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="block whitespace-nowrap px-4 py-2.5 text-[14.5px] font-semibold text-ink/80 hover:text-royal hover:bg-paper"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={n.href}
                  href={n.href}
                  className="whitespace-nowrap text-[14.5px] font-semibold text-ink/75 hover:text-royal transition-colors"
                >
                  {n.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <SiteSearch />
            <a
              href={site.phoneHref}
              className="hidden sm:inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-royal text-white px-4 py-2.5 text-[14.5px] font-bold hover:bg-royalhover transition-colors shadow-[0_6px_18px_rgba(13,79,245,0.28)]"
            >
              <PhoneIcon />
              {site.phone}
            </a>
            <button
              className="xl:hidden p-2 -mr-2 text-navy"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(!open)}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav id="mobile-menu" className="xl:hidden max-h-[70dvh] overflow-y-auto border-t border-line pb-4" aria-label="모바일 메뉴">
            {nav.flatMap((n) =>
              n.children
                ? n.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setOpen(false)}
                      className="block px-7 py-3.5 text-[17px] font-semibold text-ink/85 hover:text-royal hover:bg-paper"
                    >
                      {c.label}
                    </Link>
                  ))
                : [
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="block px-7 py-3.5 text-[17px] font-semibold text-ink/85 hover:text-royal hover:bg-paper"
                    >
                      {n.label}
                    </Link>,
                  ]
            )}
            <div className="px-7 py-3 flex flex-wrap gap-5"><a href={site.kakaoUrl} target="_blank" rel="noopener noreferrer" className="underline">카카오톡 상담</a><a href={site.bandUrl} target="_blank" rel="noopener noreferrer" className="underline">밴드 소식</a></div>
            <a href={site.phoneHref} className="mx-5 mt-2 btn btn-royal w-[calc(100%-40px)]">
              <PhoneIcon /> 전화 상담 {site.phone}
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
    </svg>
  );
}
