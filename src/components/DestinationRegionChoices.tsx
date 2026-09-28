"use client";

import { destinationRegions } from "@/data/destinations";

/** Shared by the home entry and full quote form. Empty means recommendation. */
export default function DestinationRegionChoices({ country, value, onChange }: {
  country: string;
  value: string;
  onChange: (region: string) => void;
}) {
  const regions = destinationRegions(country);
  if (!regions.length) return null;

  return (
    <fieldset className="min-w-0 rounded-xl border border-line bg-paper p-4">
      <legend className="px-1 text-base font-bold">{country}에서 가고 싶은 지역</legend>
      <p className="mb-3 text-sm text-mute">한 곳을 선택해 주세요. 아직 미정이어도 괜찮아요.</p>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {regions.map((region) => (
          <button key={region} type="button" className="choice !min-w-0 !px-3 !text-[15px] !whitespace-normal [overflow-wrap:anywhere]"
            data-on={value === region} aria-pressed={value === region} onClick={() => onChange(region)}>
            {region}
          </button>
        ))}
        <button type="button" className="choice col-span-2 !min-w-0 !px-3 !text-[15px] !whitespace-normal"
          data-on={!value} aria-pressed={!value} onClick={() => onChange("")}>
          지역은 추천받을게요
        </button>
      </div>
    </fieldset>
  );
}
