# 에스티골프투어 웹사이트 인수인계 문서

다른 AI(ChatGPT, Codex 등)나 개발자가 이 프로젝트를 이어받을 때 제일 먼저 읽는 문서입니다.
마지막 갱신: 2026-09-28

## 1. 한 줄 요약
에스티골프투어(법정 상호 에스티투어, ST TOUR)의 골프투어 견적 사이트. 고객이 지역·날짜·인원을 보내면 담당자가 예약 가능 조건을 확인해 견적을 안내하는 구조. 견적 요청은 24시간 접수하며 상담시간은 site.ts를 따른다.
라이브: https://www.stgolftours.com · 저장소: https://github.com/goltimjang/st-tour-site

## 2. 최우선 목표 (사장님 지시)
**네이버에서 "골프투어", "태국골프투어", "베트남골프투어", "중국골프투어", "일본골프투어" 등을 검색했을 때 이 사이트가 노출되는 것.**
모든 수정은 이 기준으로 판단한다. 국가 페이지(/overseas/{slug})가 "{국가}골프투어"의 랜딩 페이지이며, 제목·설명·본문에 띄어쓴 형태와 붙여쓴 형태가 모두 들어가야 한다.

## 3. 절대 규칙
1. **원가·대행비·마진 공개 표현 금지** (대표 지시). "원가", "대행비", "까놓고", "거품" 단어 사용 금지. 견적서 예시는 포함·불포함 내역만.
2. **엠 대시(—) 금지.** 마침표·쉼표·가운뎃점(·)·파이프(|)로 대체.
3. 허위·과장(최저가, 업계 1위), 허위 후기 금지. 예시 콘텐츠에는 "예시" 라벨.
4. **골프장 공식 링크는 직접 열어 확인한 것만.** 확실하지 않으면 url을 null로 두면 자동으로 검색 링크가 된다. 과거에 도박·음란 사이트로 탈취된 도메인이 여러 번 발견됨.
5. 관광사업자등록번호·통신판매업신고번호는 아직 미발급이라 표기하지 않는다.
6. 업력은 "Since 2018". 개인 클로즈업 사진 게시 금지.
7. 회사 실값(대표·주소·전화 등)은 `src/data/site.ts` 한 곳에서만 관리.

## 4. 기술 구성
- Next.js 16 (app router, `output: export` 정적 사이트, trailingSlash) + React 19 + Tailwind 4
- 배포: `main` 브랜치에 push → GitHub Actions → GitHub Pages. 별도 서버 없음.
- 빌드: `npm run build` (결과물 `out/`). 개발 서버: `npm run dev` (포트 3000)
- 견적 폼 전송: FormSubmit (https://formsubmit.co/ajax/…) → goltimjang@gmail.com. curl 테스트는 봇 판정되므로 실제 브라우저로만 검증.
- 주의: `AGENTS.md`의 안내대로 이 Next.js 버전은 학습 데이터와 다를 수 있으니 `node_modules/next/dist/docs/`를 먼저 확인.

## 5. 폴더 지도
| 위치 | 내용 |
|---|---|
| `src/app/` | 페이지. `/`, `/domestic`, `/overseas`, `/overseas/[slug]`(일본·태국·베트남·중국·필리핀), `/products`, `/products/[slug]`, `/seasons`, `/promotion`, `/about`, `/faq`, `/terms`, `/privacy`, `/band` |
| `src/components/QuoteForm.tsx` | 기본 조건 → 연락처의 2단계 견적 폼, 상세 조건은 선택. 국가·상품별 7일 임시저장(개인정보 제외), 응답 성공 확인 후 접수번호 표시. 자동 회신은 제공하지 않음 |
| `src/components/CourseExplorer.tsx` + `KoreaMap.tsx` | 전국 골프장 지도(실좌표 SVG, 권역 클릭, 2부제/3부제/노캐디 필터) |
| `src/components/OverseasExplorer.tsx` + `WorldMap.tsx` | 해외 골프장 지도(국가별 색 테마, 지역 클릭) |
| `src/lib/picked.ts` + `PickedBar.tsx` | 골프장 "담기" → 견적 폼 자동 입력 (localStorage `st-picked`) |
| `src/components/SiteSearch.tsx` | 헤더 통합 검색 |
| `src/components/HeroQuoteWidget.tsx` | 홈 미니 견적 위젯 (URL 파라미터로 조건 전달, 일정 미정 지원) |
| `src/data/site.ts` | 회사 정보, 수치, **contentUpdated / contentUpdatedISO** (콘텐츠 수정 시 둘 다 같은 날짜로 갱신. sitemap·JSON-LD에 연동) |
| `src/data/golf-courses.json`, `course-details.json`, `course-points.json` | 국내 골프장 507곳. 세 파일이 `name`으로 연결되므로 이름을 바꾸면 세 곳 모두 수정 |
| `src/data/ov-*.json` → `overseas-courses.json` | 해외 골프장 743곳. **ov-*.json이 원본**이고 `python3 scripts/merge-overseas.py`로 병합. overseas-courses.json을 직접 고치면 다음 병합 때 사라짐. 신규는 `ov-add.json`에 추가 |
| `src/data/jsonld.ts` | 구조화 데이터 헬퍼(webPageLd, breadcrumbLd). 새 페이지는 이걸 쓰고 `src/app/sitemap.ts`에 등록 |
| `src/data/seasons.ts`, `products.ts`, `posters.ts`, `royalcc.ts`, `destinations.ts`, `overseas-meta.ts` | 시즌 추천, 상품, 포스터, 로얄CC 프로모션, 해외 목적지, 국가 테마 |
| `public/llms.txt` | AI 검색엔진용 요약. 수치가 바뀌면 같이 갱신 |
| `.claude/commands/site-check.md` | 종합 점검 체크리스트. 다른 AI에서도 그대로 프롬프트로 쓸 수 있음 |
| `docs/상품-올리는-법.md` | 상품 추가 방법 |

## 6. 작업 후 검증 순서
1. `npm run build` 통과
2. 금지어·엠대시 검색: `grep -rn '원가\|대행비\|까놓고\|거품\|—' src public/llms.txt`
3. 브라우저에서 데스크톱(1280)·모바일(375) 확인. 가로 스크롤 없어야 함
4. 새 골프장을 넣었다면 지도 범위 밖 핀이 없는지 확인(해외는 국가 지도 viewBox 기준)
5. `site.ts` 수정일 갱신 → commit → push → Actions 성공 확인 → 라이브에서 변경 확인

## 7. 남은 일
- GA4 측정 ID 수령 후 GitHub 저장소 Actions 변수 `NEXT_PUBLIC_GA4_ID`에 등록하고 재배포. 이벤트 구현은 완료, 실제 계정 수집 연결·검증은 미완료. 전화 클릭과 접수 성공은 별도 이벤트이며 유효 문의·예약 여부는 상담 기록으로 확인
- 등록번호 2종 발급되면 site.ts와 푸터·회사소개에 표기 복구
- 실제 투어 사진·후기·대표 인사말 (사장님 자료 필요)
- 국가 페이지 확대 후보: 대만·말레이시아·괌 (네이버 "{국가}골프투어" 검색 대응)
- 네이버 서치어드바이저 수집·노출 현황 점검, 스마트플레이스 등록, 블로그 운영은 사장님 계정에서 진행
- 광고 영상은 원가 공개 컨셉이라 폐기, 새 컨셉으로 재제작 필요

## 8. 2026-09-23 사이트 개선
- 홈 첫 화면에서 전화·무료 견적을 제공하고 확인된 하노이 프로모션을 우선 안내.
- 하노이 전용 폼은 상품·국가·일정·골프장이 고정되며 인원과 연락처를 입력받음.
- FormSubmit HTTP 상태뿐 아니라 응답 `success`도 확인. 실제 테스트 문의는 대표 승인 후에만 전송.
- 분석 이벤트: `quote_entry`, `quote_start`, `quote_step`, `quote_submit_success`, `quote_submit_error`, `phone_click`, `kakao_click`. 이름·전화·이메일·요청 본문은 분석 이벤트에서 제외.
- 확인되지 않은 경쟁사 가격과 확정 응답 시간 표현 제거. 가격은 상품별 포함·불포함 조건과 함께 안내.
- `python3 scripts/check-export.py`로 정적 HTML의 제목·canonical·구조화 데이터·내부 링크·사이트맵을 검증. CI 빌드 후에도 실행.
- 상세 변경·검증 기록: `docs/SITE-IMPROVEMENTS-2026-09-23.md`.

## 9. 2026-09-24 검색·상품 사용성 개선
- 검색은 판매 상품 → 여행지 상담 → 골프장 정보 순서. 네이티브 모달에 키보드 순환·Esc·포커스 복귀를 적용했다.
- 프로모션에 일정·골프장·숙소·비용·예약 조건·견적 앵커를 추가했다. 긴 폼은 상품 내용 뒤로 이동했으며 #quote 직접 링크는 유지한다.
- 확인되지 않은 InStock 고정값 제거. 예약 가능 여부는 상담 후 확인한다.
- 상품 저장·링크 복사·기기 공유 추가. `/saved/`는 현재 브라우저의 상품 ID만 저장하며 noindex이다. 고객 계정이나 예약 관리 기능이 아니다.
- `src/app/manifest.webmanifest`에 홈 화면 실행 기본 정보와 기존 아이콘을 등록했다. 설치 실기기 시험·오프라인·푸시·스토어 출시는 아직 아니다.
- GitHub Pages의 상업 서비스 제한을 확인했으므로 운영 호스팅 이전을 우선 준비한다. 이번 변경의 main 배포는 하지 않았다.
- 후속 연결 기준: `docs/HOSTING-AND-BOOKING-READINESS.md`.

## 10. 2026-09-28 국가별 희망 지역 선택
- 홈 견적창과 해외 견적 폼에서 국가 선택 후 지역 버튼을 표시한다. `DestinationRegionChoices`가 `destinations.cities`를 공통으로 사용한다.
- 해외투어를 첫 번째·기본 선택으로 유지한다. 국가 변경 시 지역을 초기화하며 지역 미정도 허용한다.
- `area` URL 값과 초안의 지역은 해당 국가의 목록과 대조한다. 최종 요약·접수 내용·메일 payload의 지역에 함께 반영한다.
- 고정 상품 폼은 지정 일정·골프장을 유지한다. 지역 선택은 예약 가능 여부의 확정을 뜻하지 않는다.
- 지역 버튼은 모바일 2열, 넓은 화면 자동 줄바꿈이며 최소 높이 52px.
- 검증: 빌드, 정적 19페이지 검사, 홈·상세 폼 320/375/768/1280/1440px, 국가 변경 초기화, URL 전달, 임시저장 복원, 잘못된 국가·지역 조합 무시, 로컬 모의 접수 payload 확인. 실제 문의는 발송하지 않았다.
- 이전 개선 브랜치에 이어 로컬로 저장한 변경이며 main과 운영 사이트에는 아직 배포하지 않았다.

## 11. 2026-09-29 해외 골프 상품 카탈로그
- 하나투어 해외 골프 카테고리 71개 카드의 연결 결과를 확인해 공급 상품 76개 추가. 기존 로얄CC 포함 총 77개, 국가/권역 목록 13개. 조회 불가 홋카이도 2개 카드는 보류.
- 원자료: `data/imports/hanatour-golf-2026-09-29.json`, 게시 데이터: `src/data/hanatour-products.json`, 사진: `public/products/hanatour/`.
- 가격은 조회일의 참고 최저가에 `원~` 표기. 실시간 가격/재고 연동이 아니며 날짜·조건 안내와 함께 사용한다. 가격 변경/종료 시 데이터와 안내일을 갱신하고 재배포할 것.
- 홈 상품 검색, 국가/지역/출발지/종류 필터, 가격 정렬, 국가별 정적 목록과 상세페이지. 기존 로얄CC·해외 기본 견적·국가별 지역 선택 유지.
- `QuoteForm.inquiryProduct`는 상품 맥락을 유지하면서 날짜를 선택하는 신규 공급 상품용이다. 기존 `product`는 로얄CC 고정 일정 전용이므로 혼용 금지.
- 출처/중복/가격 차이/보류/검증 상세: `docs/HANATOUR-CATALOG-2026-09-29.md`. 기존 검사 외에 `python3 scripts/check-catalog.py` 실행.
