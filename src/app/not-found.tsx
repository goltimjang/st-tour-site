import Link from "next/link";
import { site } from "@/data/site";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="font-display text-golddeep text-[54px] leading-none mb-4">404</p>
      <h1 className="headline text-[26px] sm:text-[34px] mb-3 text-navy">페이지를 찾을 수 없습니다</h1>
      <p className="text-mute mb-9">
        주소가 바뀌었거나 잘못 입력된 것 같습니다.
        <br />
        찾으시는 내용은 아래에서 이어가실 수 있습니다.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn btn-royal">홈으로 가기</Link>
        <Link href="/domestic/" className="btn btn-light">국내 골프투어 견적</Link>
        <Link href="/overseas/" className="btn btn-light">해외 골프투어 견적</Link>
      </div>
      <p className="mt-8 text-[14.5px] text-mute">
        급하시면 전화 주세요. <a href={site.phoneHref} className="font-bold text-royaldark underline">{site.phone}</a>
      </p>
    </section>
  );
}
