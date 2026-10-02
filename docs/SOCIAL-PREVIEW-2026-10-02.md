# 카카오톡 링크 미리보기 교체

- 사용자가 말한 이미지는 홈페이지 푸터가 아닌 카카오 링크 OG 카드였음. 새 홈페이지 푸터는 그대로 유지.
- 이미지: `public/og-share-20261002.jpg`, 1200×630, 174690 bytes. 기존 `public/og.jpg`도 같은 새 이미지로 교체해 이전 문구 재노출 방지.
- 내장 이미지 생성 도구 사용. 특정 실제 판매 시설이 아닌 브랜드용 가상 해안 골프장 이미지.
- 홈 공유 제목: 에스티골프투어 | 나만의 골프여행
- 홈 공유 설명: 가고 싶은 나라와 골프장, 원하는 일정으로. 국내·해외 골프여행 상품을 살펴보고 무료 맞춤 견적을 받아보세요.
- 일반 SEO 제목/설명과 상품별 이미지 설정은 유지. 공통 OG/Twitter 기본 이미지와 회사 JSON-LD 이미지 갱신.
- 카카오 공식 문서: https://developers.kakao.com/docs/ko/tool/common . 갱신 도구: https://developers.kakao.com/tool/debugger/sharing . 배포와 카카오 캐시 갱신/실제 채팅 수신은 각각 구분한다.

## 생성 프롬프트
Create a finished premium Korean golf-travel brand social sharing card for KakaoTalk Open Graph preview, landscape aspect ratio 1200:630. Use the supplied coastal golf image as the visual background reference, recompose it to 1.9:1 with recognizable beautiful emerald putting green, flag, pale bunkers, ocean and warm twilight at right. Dark navy left for extremely legible white Korean typography. A fictional aspirational brand scene, not a named real golf facility. Sophisticated editorial graphic design, minimal, polished. All content comfortably inside 70px safe margins at intended 1200px width. Text must be exact, clean modern bold Korean sans-serif. Top-left medium brand text: "에스티골프투어". Main headline large, exactly two lines: "가고 싶은 나라와 골프장," and "나만의 골프여행을 함께." Bottom-left smaller but readable line: "국내·해외 골프여행 · 무료 맞춤 견적". No other text, no statistics, no price, no response time promise, no telephone, no fake logo, no watermark, no buttons. Ensure large type readable in a 450px-wide chat preview. Harmonize midnight navy and lush natural golf green, restrained warm sunset. Deliver only the finished rectangular card artwork, no device or chat mockup.
