"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { publishedProducts } from "@/data/products";
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
  const target = product?.quoteUrl ?? (path === "/" ? "#quick-quote" : /^\/(domestic|overseas|promotion)(\/|$)/.test(path) ? "#quote" : "/#quick-quote");
  return <nav className={`contact-bar ${keyboard ? "contact-bar-hidden" : ""}`} aria-label="빠른 상담">
    <a href={site.phoneHref} className="btn btn-light">전화 상담</a>
    <Link href={target} className="btn btn-royal">무료 견적</Link>
  </nav>;
}
