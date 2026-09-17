# 에스티골프투어 웹사이트 인수인계 문서

다른 AI(ChatGPT, Codex 등)나 개발자가 이 프로젝트를 이어받을 때 제일 먼저 읽는 문서입니다.
마지막 갱신: 2026-09-17

## 1. 한 줄 요약
에스티골프투어(법정 상호 에스티투어, ST TOUR)의 골프투어 견적 사이트. 고객이 지역·날짜·인원을 보내면 24시간 안에 견적서를 보내주는 구조.
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
| `src/components/QuoteForm.tsx` | 3단계 견적 폼. 캘린더 범위 선택(○박○일 자동), 골프장 선택기, 임시저장, 접수번호, 자동 회신 |
| `src/components/CourseExplorer.tsx` + `KoreaMap.tsx` | 전국 골프장 지도(실좌표 SVG, 권역 클릭, 2부제/3부제/노캐디 필터) |
| `src/components/OverseasExplorer.tsx` + `WorldMap.tsx` | 해외 골프장 지도(국가별 색 테마, 지역 클릭) |
| `src/lib/picked.ts` + `PickedBar.tsx` | 골프장 "담기" → 견적 폼 자동 입력 (localStorage `st-picked`) |
| `src/components/SiteSearch.tsx` | 헤더 통합 검색 |
| `src/components/HeroQuoteWidget.tsx` | 홈 미니 견적 위젯 (URL 파라미터로 폼 2단계 진입) |
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
- GA4 측정 ID 수령 후 전환 측정 설치 (미설치)
- 등록번호 2종 발급되면 site.ts와 푸터·회사소개에 표기 복구
- 실제 투어 사진·후기·대표 인사말 (사장님 자료 필요)
- 국가 페이지 확대 후보: 대만·말레이시아·괌 (네이버 "{국가}골프투어" 검색 대응)
- 네이버 서치어드바이저 수집·노출 현황 점검, 스마트플레이스 등록, 블로그 운영은 사장님 계정에서 진행
- 광고 영상은 원가 공개 컨셉이라 폐기, 새 컨셉으로 재제작 필요
