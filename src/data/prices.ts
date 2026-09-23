// 현재 확정 판매가가 없는 맞춤 여행은 조건 확인 후 견적을 안내한다.
export type PriceRow = {
  dest: string;
  from: string;
  range: string;
  note?: string;
};

export const overseasPrices: PriceRow[] = [
  { dest: "필리핀 클락", from: "조건별 견적", range: "일정·포함사항 확인 후 안내" },
  { dest: "중국 산둥 (칭다오·웨이하이)", from: "조건별 견적", range: "일정·포함사항 확인 후 안내" },
  { dest: "태국 방콕·파타야", from: "조건별 견적", range: "일정·포함사항 확인 후 안내" },
  { dest: "태국 치앙마이", from: "조건별 견적", range: "일정·포함사항 확인 후 안내" },
  { dest: "베트남 다낭·나트랑", from: "조건별 견적", range: "일정·포함사항 확인 후 안내" },
  { dest: "베트남 하노이", from: "조건별 견적", range: "일정·포함사항 확인 후 안내" },
  { dest: "일본 규슈", from: "조건별 견적", range: "일정·포함사항 확인 후 안내" },
  { dest: "일본 홋카이도", from: "조건별 견적", range: "일정·포함사항 확인 후 안내" },
  { dest: "대만", from: "조건별 견적", range: "일정·포함사항 확인 후 안내" },
  { dest: "괌·사이판", from: "조건별 견적", range: "일정·포함사항 확인 후 안내" },
];

export const domesticPrices: PriceRow[] = [
  { dest: "강원 1박2일 36홀", from: "조건별 견적", range: "일정·포함사항 확인 후 안내" },
  { dest: "충청·호남·영남 1박2일", from: "조건별 견적", range: "일정·포함사항 확인 후 안내" },
  { dest: "제주 1박2일 36홀", from: "조건별 견적", range: "일정·포함사항 확인 후 안내" },
  { dest: "제주 2박3일 54홀", from: "조건별 견적", range: "일정·포함사항 확인 후 안내" },
];

export const priceDisclaimer =
  "맞춤 여행은 날짜·인원·항공 포함 여부·숙박·라운드 구성에 따라 금액이 달라집니다. 견적서에서 1인 기준 총액, 포함·불포함 내역과 유효기간을 확인해 주세요.";
