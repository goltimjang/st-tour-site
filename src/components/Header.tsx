"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/data/site";

const nav = [
  { href: "/domestic", label: "국내 골프투어" },
  { href: "/overseas", label: "해외 골프투어" },
  { href: "/promotion", label: "프로모션" },
  { href: "/about", label: "회사소개" },
  { href: "/faq", label: "자주 묻는 질문" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navydeep text-white border-b border-white/10">
      <div className="mx-auto max-w-6xl px-5 h-[68px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-2 shrink-0" aria-label="에스티투어 홈">
          <span className="font-display text-[22px] tracking-tight">에스티투어</span>
          <span className="eyebrow text-sky hidden sm:inline">ST TOUR</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="주 메뉴">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-[15px] font-semibold text-white/85 hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={site.phoneHref}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-gold/70 text-gold px-4 py-2 text-[15px] font-bold hover:bg-gold/10"
          >
            <PhoneIcon />
            {site.phone}
          </a>
          <button
            className="lg:hidden p-2 -mr-2"
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
        <nav className="lg:hidden border-t border-white/10 bg-navydeep pb-4" aria-label="모바일 메뉴">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3.5 text-[17px] font-semibold text-white/90 hover:bg-white/5"
            >
              {n.label}
            </Link>
          ))}
          <a href={site.phoneHref} className="mx-5 mt-2 btn btn-gold w-[calc(100%-40px)]">
            <PhoneIcon /> 전화 상담 {site.phone}
          </a>
        </nav>
      )}
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
    </svg>
  );
}
