// 해외 국가별 표시 정보와 색상 테마 (해외 골프장 지도용)
export type CountryMeta = {
  slug: string;
  name: string;
  flag: string;
  flight: string;
  season: string;
  blurb: string;
  /** 지도·강조 색 (국가마다 다른 인상을 주기 위함) */
  theme: { band: string; land: string; landDim: string; active: string; pin: string; accent: string };
};

export const countries: CountryMeta[] = [
  {
    slug: "japan",
    name: "일본",
    flag: "🇯🇵",
    flight: "인천에서 1시간 20분~",
    season: "규슈·오키나와는 겨울, 북해도는 여름",
    blurb: "가까운 거리에 온천과 미식까지. 규슈는 국내 지방 이동보다 짧게 다녀옵니다.",
    theme: { band: "#7a1330", land: "#e7b9c4", landDim: "#5d2136", active: "#e8455f", pin: "#ffd166", accent: "#ffb3c1" },
  },
  {
    slug: "vietnam",
    name: "베트남",
    flag: "🇻🇳",
    flight: "인천에서 4시간 30분~",
    season: "11~4월 (다낭은 2~8월)",
    blurb: "비행시간 대비 코스 수준이 가장 좋은 목적지. 다낭 해안 코스가 대표적입니다.",
    theme: { band: "#0f4d3a", land: "#a8d8bf", landDim: "#1d5745", active: "#f5c518", pin: "#ff6b57", accent: "#ffe08a" },
  },
  {
    slug: "thailand",
    name: "태국",
    flag: "🇹🇭",
    flight: "인천에서 5시간 30분~",
    season: "11~2월 건기",
    blurb: "겨울 골프 1번지. 골프텔부터 5성 리조트까지 예산에 맞춰 폭넓게 구성됩니다.",
    theme: { band: "#1b3a6b", land: "#b9cbe8", landDim: "#274470", active: "#ff8c42", pin: "#ffd166", accent: "#ffb37a" },
  },
  {
    slug: "china",
    name: "중국",
    flag: "🇨🇳",
    flight: "인천에서 1시간 30분~",
    season: "산둥 4~11월, 하이난은 겨울",
    blurb: "산둥은 최단 비행에 가성비, 하이난은 한겨울에도 따뜻한 남국 라운드입니다.",
    theme: { band: "#6b1a1a", land: "#e8c4a0", landDim: "#5a2828", active: "#f2b134", pin: "#ff5c4d", accent: "#ffcf7a" },
  },
  {
    slug: "philippines",
    name: "필리핀",
    flag: "🇵🇭",
    flight: "인천에서 4시간~",
    season: "11~5월 건기",
    blurb: "클락은 무제한 라운드 상품으로 유명하고, 세부는 휴양과 묶기 좋습니다.",
    theme: { band: "#12456b", land: "#a9d3e8", landDim: "#1c4c6e", active: "#ffcd3c", pin: "#ff6b6b", accent: "#9fe0ff" },
  },
  {
    slug: "malaysia",
    name: "말레이시아",
    flag: "🇲🇾",
    flight: "인천에서 5시간~",
    season: "연중 (11~1월 우기 유의)",
    blurb: "코타키나발루는 바다를 낀 리조트 코스, 조호바루는 싱가포르와 붙어 있습니다.",
    theme: { band: "#123c5c", land: "#a6cfe0", landDim: "#1b4a68", active: "#ffc93c", pin: "#ff7f50", accent: "#ffd97d" },
  },
  {
    slug: "indonesia",
    name: "인도네시아",
    flag: "🇮🇩",
    flight: "인천에서 7시간~ (발리)",
    season: "4~10월 건기",
    blurb: "발리는 절벽과 바다를 낀 코스, 바탐·빈탄은 짧은 일정에 적합합니다.",
    theme: { band: "#5c1230", land: "#e6b7c8", landDim: "#4d1f34", active: "#ff5c8a", pin: "#ffd166", accent: "#ffb3c9" },
  },
  {
    slug: "taiwan",
    name: "대만",
    flag: "🇹🇼",
    flight: "인천에서 2시간 30분~",
    season: "10~4월",
    blurb: "짧은 비행에 온천과 야시장까지. 주말 이용 일정으로 자주 나갑니다.",
    theme: { band: "#1d3f5c", land: "#b3d1e0", landDim: "#254c6b", active: "#ff8fab", pin: "#ffd166", accent: "#a8dadc" },
  },
  {
    slug: "laos",
    name: "라오스",
    flag: "🇱🇦",
    flight: "인천에서 5시간~",
    season: "11~3월 건기",
    blurb: "메콩강을 낀 한적한 코스. 붐비지 않는 라운드를 원할 때 좋습니다.",
    theme: { band: "#0f3c52", land: "#a8ccd8", landDim: "#1a4a60", active: "#f4a261", pin: "#ffd166", accent: "#ffcb8a" },
  },
  {
    slug: "guam",
    name: "괌·사이판",
    flag: "🇬🇺",
    flight: "인천에서 4시간 30분~",
    season: "연중 (12~5월 건기)",
    blurb: "비자 없이 미국령에서 라운드. 가족 휴양과 묶기 좋고 야간 라운드도 가능합니다.",
    theme: { band: "#0d4f63", land: "#a5d8e6", landDim: "#175c70", active: "#ffcd3c", pin: "#ff7a59", accent: "#8fe3f5" },
  },
  {
    slug: "australia",
    name: "호주",
    flag: "🇦🇺",
    flight: "인천에서 10시간~",
    season: "9~11월, 3~5월 (한국 겨울은 호주 여름)",
    blurb: "멜버른 샌드벨트는 세계 100대 코스가 몰려 있습니다. 한국 겨울에 여름 라운드를 즐깁니다.",
    theme: { band: "#3d2a14", land: "#e8cba0", landDim: "#4a3620", active: "#ffb703", pin: "#e63946", accent: "#ffd88a" },
  },
  {
    slug: "usa",
    name: "미주",
    flag: "🇺🇸",
    flight: "인천에서 8시간~ (하와이)",
    season: "하와이 연중, 캘리포니아 4~10월",
    blurb: "하와이는 바다를 낀 리조트 코스, 캘리포니아는 페블비치 등 명문 코스가 있습니다.",
    theme: { band: "#1a2f5c", land: "#b8c9e8", landDim: "#243d6b", active: "#e63946", pin: "#ffd166", accent: "#a8c5f0" },
  },
  {
    slug: "mongolia",
    name: "몽골",
    flag: "🇲🇳",
    flight: "인천에서 3시간 30분~",
    season: "6~9월 (겨울은 라운드 불가)",
    blurb: "초원 위 코스에서 여름 라운드. 승마·초원 투어와 묶는 일정이 많습니다.",
    theme: { band: "#2d3f2a", land: "#c3d8b0", landDim: "#38492f", active: "#f4a261", pin: "#e76f51", accent: "#d4e8bd" },
  },
];


export const countryBySlug = Object.fromEntries(countries.map((c) => [c.slug, c]));
