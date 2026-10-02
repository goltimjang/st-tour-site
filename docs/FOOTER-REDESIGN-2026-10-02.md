# 푸터 디자인

## 방향
- 브랜드 마무리 이미지와 무료 견적 동선을 공통 푸터에 배치. 홈의 중복된 하단 견적 배너는 통합.
- 색상: Midnight #06143e, Deep #030d2c, Pine #0f3c32, White #ffffff, Mist #c6cfdf. 기존 Pretendard 본문/GmarketSans 제목 유지.
- 레이아웃: PC는 좌측 두 줄 카피와 우측 해안 골프 풍경. 모바일은 풍경을 위에 보여주고 그 아래 문구·버튼을 읽기 쉽게 배치. 아래에는 흰 로고, 탐색 링크, 실제 상담 연락처와 사업자 정보를 정리.
- 카피: 다음 라운드의 설렘, / 에스티골프투어와 함께. 보조: 가고 싶은 나라와 골프장, 나에게 맞는 일정으로 준비하세요.
- 검토: 그림을 가장 중요한 시각 요소로 쓰고 불필요한 장식·숫자·자동 움직임은 추가하지 않는다. 특정 판매 상품의 실제 시설 사진으로 사용하지 않는 상상 풍경 브랜드 장식이다.

## 이미지
- 내장 image_gen 도구로 생성. 원본: /Users/goltimjang/.codex/generated_images/01a0cd8f-7479-72a1-a49d-bc8aef712960/exec-0f21fa69-cefa-40a3-a22a-28a70c619e69.png
- 배포 파일: public/images/brand/footer-golf-20261002.webp, footer-golf-20261002-960.webp. 이미지에 문자를 합성하지 않고 웹 텍스트로 표시.

### 최종 생성 프롬프트
Use case: ads-marketing. Asset type: wide premium Korean golf travel brand website footer background, landscape 3:1 composition. Create a beautifully art-directed cinematic golf travel landscape, an imagined coastal golf course at blue hour just after sunset. Rolling deep emerald fairways, elegantly curved pale sand bunkers and a single slender flag on the RIGHT HALF overlooking a calm ocean and layered distant islands, subtle warm horizon glow, atmospheric mist, exquisite fine grass texture. The LEFT HALF should be very dark and quiet midnight navy with soft shadowed land and open sky, negative space for white website typography added later. Palette midnight navy #06143e, deep pine green #0f3c32, natural emerald grass, restrained warm ivory light. Refined editorial photography-inspired brand concept, calm aspirational mood, sophisticated natural lighting, believable landscape, no oversaturated neon. Important: this is a fictional brand mood visual, not any identifiable real golf course or purchasable facility. No buildings, no people, no airplane, no golf equipment close-up, no text, no letters, no logo, no watermark. Keep key flag and beautiful green in middle-right so composition survives mobile crop. Wide panoramic website banner.

## 검증
- npm run build, check-export.py, check-catalog.py, check-product-images.mjs, git diff --check 통과.
- Chrome 1280px / 375px / 320px 확인. 가로 넘침 없음, 모바일 960px 이미지 선택·로드 확인.
- 모바일 구도를 300px 이미지 높이로 조정해 골프장과 바다가 보이도록 보완.
- Next Link의 동일 페이지 해시 이동이 작동하지 않아 네이티브 앵커로 변경 후 무료 견적 입력란 이동 확인. 폼 전송 없음.
