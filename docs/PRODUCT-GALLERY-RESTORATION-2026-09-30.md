# 상품 숙소 사진 복원 · 2026-09-30

## 수정 범위

대표 사진과 상세 갤러리 사진의 역할을 분리했다. 골프장 사진을 대표로 유지하고, 두 번째부터 동일 출발 상품의 숙소·객실·시설 사진을 배치했다. 공항·입국 안내·지도·무관한 사진은 복원하지 않았다.

- 공급 상품 76개 중 72개에 숙소·시설 사진 116장 배치(고유 이미지 110장).
- 로얄CC 행사 공식 숙소 사진 2장 별도 복원. 전체 77개 중 73개에서 숙소·시설 사진 제공.
- 공급 상품 전체 갤러리 288장 배치, 고유 이미지 264장. 대표 사진 확인 중 안내 3개는 사진 수에서 제외.
- 원자료: `data/imports/hanatour-details-2026-09-30/`. 각 이미지의 시설 카드 제목과 URL을 대조하고 실제 내용을 육안 검토했다. 이전 검수의 `kind=golf`만으로 사진 종류를 판단하지 않았다.
- 사진 출처, 해상도, 선택 이유: `data/imports/hanatour-photo-curation-2026-09-30.json`. 다운로드한 공급사 원본의 실제 크기를 기록하고 최대 가로 1600px WebP로 저장했다. 작은 원본을 확대 저장하지 않았다.
- 로얄CC: 기존 공식 행사 자료(`royalccfestival.com`)와 `src/data/royalcc.ts`의 더 파이브 빌라스 앤 리조트 외관·트윈 객실을 대조. 확정 객실 유형으로 표시하지 않음.

## 표시 및 동작

- `gallerySubjects`: course, clubhouse, hotel, facility, pending. 대표 사진은 course/clubhouse만 허용.
- `photoPending`은 대표 사진만 보류하며 확인된 호텔 사진 탐색은 허용.
- 숙소 대안이 여럿인 상품은 각 사진의 시설명을 유지. 객실·수영장 등 사진이 해당 객실 배정이나 무료 이용을 보장하지 않도록 최종 견적 확인 안내.
- 사진 위 항공 별도 표시는 삭제하고 가격/비용/견적 안내는 유지.
- 사진 수동 전환 시 280ms 페이드, 마우스 카드 상승 4px, 견적 화살표 이동 4px. 동작 줄이기 설정에서 해제, 자동 전환 없음.

## 숙소 사진 추가 보류

공급사 일정 스냅샷에서 확인 가능한 숙소 사진을 찾지 못했다. 다른 상품의 호텔이나 임의 이미지를 넣지 않았다.

- 치앙마이 가산레가시 다색골프 · 4성 호텔 5일 (`hana-28e8915e4795`)
- 하노이·하이퐁 소노펠리체CC 골프텔 5일 (`hana-66b15455952d`)
- 파타야 타이시암CC 파크골프 5일 (`hana-d6291eba0f9a`)
- 부산 출발 하노이 헤론레이크 다색골프 5일 (`hana-00c99bfabd4e`)

## 원본 해상도 한계

아래 복원 사진은 공급사 원본 가로가 800px 미만이다. 대표 사진으로 쓰지 않으며, 상세 갤러리에서 원본 크기 이상으로 늘리지 않는 표시를 적용했다. 신규 고화질 원본 수령 시 교체 대상이다.

| 상품 | 시설 | 원본 크기 |
|---|---|---|
| hana-3de70b2e8f8e | Castlex Qingdao Golf & Resort | 234×220 |
| hana-a41f2f21ebd4 | ASO SKYBLUE GOLF RESORT_EX.ASO TAKAMORI GOLF CLUB HOTEL | 606×379 |
| hana-1e9409fb560b | [ONSEN HOTEL] KAGOSHIMA SUN ROYAL HOTEL | 225×180 |
| hana-a2585b31f20e | G8FUJI COUNTRY CLUB | 310×230 |
| hana-387bb1416e0e | GARDEN LANE MEILAN AIRPORT (EX. HAIKOU MEILAN AIRPORT HOTEL) | 744×493 |
| hana-a2883955afa4 | GLORIA PLAZA HOTEL QINGDAO | 350×350 |
| hana-912f5b4e8824 | PREMIER HAVANA NHA TRANG HOTEL | 533×800 |
| hana-cbc60807bbf4 | BORNEO GOLF RESORT (EX. BORNEO GOLF AND COUNTRY CLUB) | 600×450 |
| hana-cbc60807bbf4 | BORNEO GOLF RESORT (EX. BORNEO GOLF AND COUNTRY CLUB) | 600×450 |
| hana-7a170301d0df | GASSAN KHUNTAN GOLF&RESORT | 234×220 |
| hana-7a170301d0df | GASSAN KHUNTAN GOLF&RESORT | 234×220 |
| hana-7ad5e0d28261 | RADISSON GOLF AND CONVENTION CENTER BATAM | 658×432 |
| hana-7ad5e0d28261 | RADISSON GOLF AND CONVENTION CENTER BATAM | 641×432 |
| hana-0b8f7cf81a12 | 뉴욕 뉴욕 호텔 앤드 카지노 | 225×180 |
| hana-bb30ff6959a1 | OLD COURSE | 680×453 |
| hana-bb30ff6959a1 | OLD COURSE | 680×452 |
| hana-2a359818408b | PUEBLO BONITO PACIFICA GOLF AND SPA RESORT | 480×300 |
| hana-2a359818408b | Grand Solmar Pacific Dunes Resort, Golf & Spa | 750×500 |
| hana-7cb12d27edf5 | MUONG THANH LUXURY VIENTIANE HOTEL | 360×262 |
| hana-7cb12d27edf5 | YOOEUN HOTEL | 770×502 |
| hana-52c2e708f5ea | ANA Holiday Inn Resort Miyazaki | 600×450 |
| hana-52c2e708f5ea | ANA Holiday Inn Resort Miyazaki | 600×450 |
| hana-b08c688159c9 | 스마일 호텔 하카타 | 234×220 |

## 검증

- 빌드·형식 검사, 정적 페이지/사이트맵/연결 검증, 76개 공급 상품의 시설명·출처·사진 순서 및 72개 숙소 갤러리 유지 검증.
- 원본보다 확대 저장하지 않았는지 모든 공급 상품 사진을 검사.
- 브라우저 1440px PC, 375px·320px 모바일에서 가로 넘침 없음. FLC 객실 사진, 대표 사진 보류 상품의 호텔 탐색, 로얄CC 공식 숙소 사진, 키보드 사진 전환, 시설 탭, 견적 섹션 이동 확인.
- 목록 77개 카드의 이미지 위 항공 문구 없음, 본문 항공 조건 유지 확인. 콘솔 오류 없음. 동작 줄이기에서 사진 animationName=none 확인. 실제 문의 발송 없음.
