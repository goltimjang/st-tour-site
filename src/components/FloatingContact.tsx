"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { publishedProducts } from "@/data/products";
import { bookingCourses } from "@/data/booking-courses";
import { site } from "@/data/site";

export default function FloatingContact() {
  const path = usePathname();
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    const update = () => setKeyboard(!!window.visualViewport && window.innerHeight - window.visualViewport.height > 150);
    window.visualViewport?.addEventListener("resize", update);
    return () => window.visualViewport?.removeEventListener("resize", update);
  }, []);
  const product = publishedProducts.find((p) => path.replace(/\/$/, "") === `/products/${p.slug}`);
  const phoneBooking = bookingCourses.some(c => c.bookingMode === "phone" && path.replace(/\/$/, "") === `/booking/${c.slug}`);
  if (phoneBooking) return <nav className="contact-bar !grid-cols-1" aria-label="빠른 예약"><a href={site.phoneHref} className="btn btn-royal">속리산CC 전화로 예약하기 · {site.phone}</a></nav>;
  const booking = path.startsWith("/booking/");
  const target = booking ? (path.replace(/\/$/, "") === "/booking" ? "/booking/fourseven-geumgang/#quote" : "#quote") : product?.quoteUrl ?? (path === "/" ? "#quick-quote" : /^\/(domestic|overseas|promotion)(\/|$)/.test(path) ? "#quote" : "/#quick-quote");
  return <nav className={`contact-bar ${keyboard ? "contact-bar-hidden" : ""}`} aria-label="빠른 상담">
    <a href={site.phoneHref} className="btn btn-light">전화 상담</a>
    <Link href={target} className="btn btn-royal">{booking ? "할인 금액 문의" : product ? "이 상품 견적 요청" : "무료 견적"}</Link>
  </nav>;
}
