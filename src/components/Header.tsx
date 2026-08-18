"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { site } from "@/data/site";

const nav = [
  { href: "/domestic", label: "국내 골프투어" },
  { href: "/overseas", label: "해외 골프투어" },
  { href: "/promotion", label: "프로모션" },
  { href: "/about", label: "회사소개" },
  { href: "/faq", label: "자주 묻는 질문" },
];

/** 밝은 플로팅 카드형 헤더 — 흰색 라운드 바 + 부드러운 그림자 */
export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-5 pt-3 pb-1">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white/95 backdrop-blur-md border border-white shadow-[0_10px_34px_rgba(6,20,62,0.10)]">
        <div className="h-[64px] flex items-center justify-between gap-4 px-5 sm:px-7">
          <Link href="/" className="shrink-0" aria-label="에스티투어 홈">
            <Image src="/logo.png" alt="에스티투어" width={188} height={32} priority className="h-8 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="주 메뉴">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="text-[15px] font-semibold text-ink/75 hover:text-royal transition-colors">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={site.phoneHref}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-royal text-white px-5 py-2.5 text-[15px] font-bold hover:bg-royalhover transition-colors shadow-[0_6px_18px_rgba(13,79,245,0.28)]"
            >
              <PhoneIcon />
              {site.phone}
            </a>
            <button
              className="lg:hidden p-2 -mr-2 text-navy"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-line pb-4" aria-label="모바일 메뉴">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block px-7 py-3.5 text-[17px] font-semibold text-ink/85 hover:text-royal hover:bg-paper"
              >
                {n.label}
              </Link>
            ))}
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
