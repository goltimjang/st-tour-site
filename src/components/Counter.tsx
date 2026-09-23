/** 검색 수집·동작 줄이기·첫 화면에서 같은 최종 수치를 제공한다. */
export default function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{to.toLocaleString("ko-KR")}{suffix}</span>;
}
