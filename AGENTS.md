<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 프로젝트 규칙

작업 전에 `docs/HANDOFF.md`를 반드시 읽을 것. 핵심 목표(네이버 골프투어 키워드 노출), 절대 규칙(원가·대행비 표현 금지, 엠 대시 금지, 검증된 골프장 링크만), 데이터 구조, 검증·배포 순서가 정리돼 있다. 점검 체크리스트는 `.claude/commands/site-check.md`.

## 상품 사진 규칙

- 상품 대표 사진은 해당 일정에 연결된 실제 골프장 코스가 우선, 없으면 확인된 클럽하우스 사진. 객실·호텔 외관·수영장·공항·음식·지도·일반 풍경으로 대체하지 않는다.
- 시설 카드 제목만 보고 사진 종류를 추정하지 말고 실제 이미지를 육안 확인한다. 상품별 출처 URL, 시설명, 원본 사진 URL, 실제 해상도와 선택 근거를 기록한다.
- 생성 이미지는 국가 소개에만 사용하고 AI 이미지임을 화면에 표시한다. 실제 상품 시설 사진으로 사용하지 않는다.
- 시설 정보가 충돌하거나 적합한 사진이 없으면 `photoPending`으로 사진 노출을 보류한다. 임의 사진이나 다른 상품의 시설로 채우지 않는다.
- 원본보다 확대해 고해상도라고 보고하지 않는다. 배포 전 `check-catalog.py`와 `check-product-images.mjs`를 실행한다.
