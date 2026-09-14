"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * 지도·목록에서 "담기"로 고른 골프장을 브라우저에 보관했다가 견적 폼으로 넘긴다.
 * 국내/해외는 따로 담기지 않고, 다른 종류를 담으면 새로 시작한다.
 */
export type PickedKind = "domestic" | "overseas";
export type PickedState = { kind: PickedKind; names: string[]; regions?: string[]; country?: string };

const KEY = "st-picked";
const EVT = "st-picked-change";

// 해외 데이터 국가 슬러그 -> 견적 폼 1단계에서 쓰는 국가명
export const SLUG_TO_COUNTRY: Record<string, string> = {
  japan: "일본", thailand: "태국", vietnam: "베트남", china: "중국", philippines: "필리핀",
  taiwan: "대만", malaysia: "말레이시아", guam: "괌·사이판", indonesia: "인도네시아",
  laos: "라오스", mongolia: "몽골", usa: "하와이·미국", australia: "호주·뉴질랜드",
};

function read(): PickedState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return p && Array.isArray(p.names) ? p : null;
  } catch {
    return null;
  }
}

function write(next: PickedState | null) {
  try {
    if (!next || next.names.length === 0) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVT));
  } catch {}
}

export function usePicked(kind: PickedKind) {
  const [state, setState] = useState<PickedState | null>(null);

  useEffect(() => {
    const sync = () => setState(read());
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const names = state && state.kind === kind ? state.names : [];
  const has = useCallback((name: string) => names.includes(name), [names]);

  const toggle = useCallback(
    (name: string, meta?: { region?: string; country?: string }) => {
      const cur = read();
      const base: PickedState = cur && cur.kind === kind ? cur : { kind, names: [] };
      const on = base.names.includes(name);
      const nextNames = on ? base.names.filter((n) => n !== name) : [...base.names, name];
      const regions = new Set(base.regions ?? []);
      if (!on && meta?.region) regions.add(meta.region);
      write({
        kind,
        names: nextNames,
        regions: regions.size ? Array.from(regions) : undefined,
        country: meta?.country ?? base.country,
      });
    },
    [kind]
  );

  const clear = useCallback(() => write(null), []);

  return { names, has, toggle, clear, country: state?.kind === kind ? state.country : undefined };
}
