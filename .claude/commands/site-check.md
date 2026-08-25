# 에스티골프투어 사이트 종합 점검

아래 체크리스트를 기준으로 사이트(~/Projects/st-tour-site)를 점검하고, 위반·누락을 발견하면 수정한 뒤 빌드·검증·배포까지 진행하라. 수정할 것이 없으면 항목별 통과 여부만 보고하라.

## 1. 콘텐츠 원칙 (위반 = 즉시 수정)
- 허위 정보·과장 표현(최저가, 업계 1위 등) 금지. 실적·가격은 근거 있는 값만, 자체 집계는 단서 표기
- 허위 후기 금지. 예시 콘텐츠(견적서 목업, 상담 대화)에는 "예시" 라벨 필수
- 엠 대시(—) 전면 금지. 마침표·쉼표·가운뎃점(·)·파이프(|)로 대체. `grep -rn '—' src public/llms.txt`로 확인
- 브랜드: 마케팅 표기 "에스티골프투어" / 법정 상호 "에스티투어(ST TOUR)"는 푸터·회사정보에만
- 업력은 "Since 2018" (사업자등록증 기준)
- 개인 클로즈업 사진 게시 금지 (초상권)

## 2. 데이터 일관성
- 회사 실값(대표·주소·사업자번호·연락처·영업시간)은 src/data/site.ts 한 곳에서만 관리, 하드코딩 금지
- 콘텐츠를 수정했다면 site.ts의 contentUpdated와 contentUpdatedISO를 **둘 다 같은 날짜로** 갱신 (sitemap lastmod·JSON-LD dateModified가 여기 연동됨)
- [확인 필요] 표시 항목(관광사업자등록번호·통신판매업신고번호)이 실값으로 채워졌는지 확인

## 3. SEO·GEO (구조화 데이터)
- 전 페이지: canonical(트레일링 슬래시 포함), TravelAgency + WebSite + WebPage(dateModified 포함) JSON-LD
- 주요 페이지: BreadcrumbList / FAQ 있는 페이지: FAQPage(화면에 보이는 내용과 동일해야 함) / 프로모션: Event
- 새 페이지를 만들었다면: src/data/jsonld.ts의 webPageLd·breadcrumbLd 헬퍼 사용 + sitemap.ts에 등록
- 타이틀은 "핵심 키워드 | 보조 설명" 형식, 25자 이상
- llms.txt가 최신 정보(가격·페이지 목록)와 일치하는지 확인
- 빌드 후 out/에서 각 페이지 JSON-LD 렌더 여부를 실제로 파싱해 확인

## 4. 성능
- 새 이미지: WebP와 압축 JPG를 **실측 비교해 작은 쪽** 사용, 배경용은 quality 60~76
- 영상은 720p CRF28 이내로 재인코딩 (배경용 기준)
- LCP 요소(각 페이지 히어로)는 preload 또는 next/image priority 지정
- 렌더링 차단 외부 CSS 금지 (폰트 CSS는 비동기 로드 + noscript 폴백 유지)
- 장식용 이미지는 alt="" + aria-hidden 유지가 정답. 도구가 "alt 누락"이라 해도 바꾸지 말 것

## 5. 기능 검증 (코드 수정 시)
- 견적 폼: 캘린더 출발→도착 범위 선택, ○박○일 자동 계산, 2단계 기간 자동 반영이 깨지지 않았는지
- 폼 전송 검증은 반드시 실제 브라우저로 (curl은 봇 판정됨)
- 브라우저 팬 스크린샷이 흰 화면이면 Reveal 애니메이션 때문이니 DOM·computed style로 검증

## 6. 빌드·배포
- `npm run build` 성공 확인 (PATH에 ~/.local/bin 필요)
- 빌드 결과물에서 깨진 이미지·비디오 참조 없는지 스캔
- main 푸시 → GitHub Actions 자동 배포 → `gh run watch`로 성공 확인 (직전 완료된 런을 잡지 않게 푸시 후 10초 대기)
- 배포 후 라이브(https://www.stgolftours.com)에서 핵심 변경 1건 이상 curl로 실제 확인

## 보고 형식
결과는 "고친 것 / 통과한 것 / 사장님 확인 필요한 것" 세 묶음으로, 전문용어 풀어서 보고하라.
