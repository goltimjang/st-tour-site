"use client";
import { useEffect, useState } from "react";
const KEY = "st-saved-products-v1";
const EVENT = "st-saved-products-change";
function read(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value) ? [...new Set(value.filter((x): x is string => typeof x === "string" && /^[a-z0-9-]{1,100}$/.test(x)))].slice(0, 100) : [];
  } catch { return []; }
}
export function useSavedProducts() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const sync = () => { setIds(read()); setReady(true); };
    sync(); window.addEventListener(EVENT, sync); window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  function toggle(id: string) {
    const previous = read();
    const next = previous.includes(id) ? previous.filter((x) => x !== id) : [...previous, id].slice(-100);
    try { localStorage.setItem(KEY, JSON.stringify(next)); setError(""); window.dispatchEvent(new Event(EVENT)); }
    catch { setError("이 브라우저에서는 저장할 수 없습니다. 상품 링크를 복사해 보관해 주세요."); }
  }
  return { ids, ready, toggle, error };
}
