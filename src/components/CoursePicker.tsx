"use client";

import { useEffect, useMemo, useState } from "react";

export type PickItem = {
  name: string;
  /** 이름 아래 작은 글씨 (예: "경기 가평군 · 회원제", "다낭 · 18홀") */
  sub: string;
  /** 소속 그룹 (국내=권역, 해외=지역) */
  group: string;
};

/**
 * 견적 폼의 선호 골프장 선택기.
 * 1단계에서 고른 지역·국가의 골프장만 바로 보여준다. 그룹이 하나면 탭 없이 목록이 즉시 열리고,
 * 여러 개면 그 그룹들만 탭으로 보여준다. 직접 입력과 이름 검색도 함께 지원한다.
 */
export default function CoursePicker({
  value,
  onChange,
  items,
  groups,
  placeholder,
  scopeLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  items: PickItem[];
  /** 보여줄 그룹 순서. 비어 있으면 items에서 자동 추출 */
  groups?: string[];
  placeholder?: string;
  /** "강원", "베트남 다낭" 처럼 현재 범위를 알려주는 라벨 */
  scopeLabel?: string;
}) {
  const groupList = useMemo(() => {
    const g = groups && groups.length > 0 ? groups : Array.from(new Set(items.map((i) => i.group)));
    return g.filter((x) => items.some((i) => i.group === x));
  }, [groups, items]);

  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState(groupList[0] ?? "");
  const [q, setQ] = useState("");

  // 1단계 선택이 바뀌면 (예: 강원 -> 제주) 현재 탭도 따라간다
  useEffect(() => {
    if (!groupList.includes(group)) setGroup(groupList[0] ?? "");
  }, [groupList]); // eslint-disable-line react-hooks/exhaustive-deps

  const picked = value.split(",").map((s) => s.trim()).filter(Boolean);

  const list = useMemo(() => {
    const term = q.trim().replace(/\s/g, "");
    let l = term
      ? items.filter((c) => (c.name + c.sub).replace(/\s/g, "").includes(term))
      : items.filter((c) => c.group === group);
    return [...l].sort((a, b) => a.sub.localeCompare(b.sub, "ko") || a.name.localeCompare(b.name, "ko")).slice(0, 100);
  }, [items, group, q]);

  function toggle(name: string) {
    const next = picked.includes(name) ? picked.filter((p) => p !== name) : [...picked, name];
    onChange(next.join(", "));
  }

  const single = groupList.length === 1;

  return (
    <div className="space-y-2.5">
      <input
        className="field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "비워두셔도 됩니다. 저희가 추천해 드립니다"}
      />

      <button
        type="button"
        className="choice !min-h-[42px] !px-4 text-[14px] w-full sm:w-auto"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {open
          ? "목록 닫기"
          : scopeLabel
            ? `${scopeLabel} 골프장 목록에서 고르기`
            : "골프장 목록에서 고르기"}
      </button>

      {picked.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {picked.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => toggle(p)}
              className="rounded-full bg-royal/10 text-royaldark text-[13px] font-semibold px-3 py-1.5 hover:bg-royal/20"
              aria-label={`${p} 선택 해제`}
            >
              {p} <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="rounded-xl border border-line bg-paper p-3.5">
          {/* 그룹 탭: 1단계에서 고른 범위만 보여준다. 하나뿐이면 탭 생략 */}
          {!single && groupList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {groupList.map((r) => (
                <button
                  key={r}
                  type="button"
                  className="choice !min-h-[36px] !px-3 text-[13px]"
                  data-on={!q && group === r}
                  onClick={() => { setGroup(r); setQ(""); }}
                >
                  {r}
                  <span className="opacity-60 ml-1 text-[11.5px]">{items.filter((i) => i.group === r).length}</span>
                </button>
              ))}
            </div>
          )}

          <input
            className="field !min-h-[40px] !py-1 text-[14px] mb-3"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="골프장 이름으로 바로 찾기"
            aria-label="골프장 이름 검색"
          />

          <div className="max-h-[260px] overflow-y-auto rounded-lg bg-white border border-line">
            {list.length === 0 ? (
              <p className="p-4 text-[14px] text-mute text-center">
                찾는 골프장이 없으면 위 칸에 직접 적어주세요. 저희가 확인해 드립니다.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {list.map((c) => {
                  const on = picked.includes(c.name);
                  return (
                    <li key={`${c.name}-${c.sub}`}>
                      <button
                        type="button"
                        onClick={() => toggle(c.name)}
                        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-paper ${on ? "bg-royal/5" : ""}`}
                        aria-pressed={on}
                      >
                        <span className="min-w-0">
                          <span className="block font-semibold text-[14.5px] truncate">{c.name}</span>
                          <span className="block text-[12px] text-mute">{c.sub}</span>
                        </span>
                        <span className={`shrink-0 text-[13px] font-bold ${on ? "text-royal" : "text-mute"}`}>
                          {on ? "선택됨" : "담기"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <p className="text-[12.5px] text-mute mt-2.5">
            {q ? "검색 결과" : single ? `${groupList[0]} 골프장` : `${group} 골프장`} · 여러 곳을 담으면 비교 견적으로 보내드립니다.
          </p>
        </div>
      )}
    </div>
  );
}
