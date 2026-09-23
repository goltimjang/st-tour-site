"use client";
import { useEffect } from "react";
import Script from "next/script";
import { track } from "@/lib/analytics";

const id = process.env.NEXT_PUBLIC_GA4_ID;
export default function Analytics() {
  useEffect(() => {
    function click(e: MouseEvent) {
      const anchor = (e.target as Element)?.closest?.("a");
      if (anchor?.href.startsWith("tel:")) track("phone_click");
      else if (anchor?.href.startsWith("https://pf.kakao.com/")) track("kakao_click");
    }
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;
  return <><Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" /><Script id="ga4-config" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(id)});`}</Script></>;
}
