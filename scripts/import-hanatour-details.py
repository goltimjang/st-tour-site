"""Build the land-quote catalogue from exact departure pages and reviewed photos.

Photo selections are an explicit manifest tied to facility cards in each source
page. Never fall back to the first images on a page (airports and unrelated
travel instructions also have images).
"""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
DATE = '2026-09-30'
DATA = ROOT / 'src/data/hanatour-products.json'
products = json.loads(DATA.read_text())
raw = json.loads((ROOT / 'data/imports/hanatour-golf-2026-09-29.json').read_text())
curation = json.loads((ROOT / f'data/imports/hanatour-photo-curation-{DATE}.json').read_text())
assets = {}


def clean(text):
    text = re.sub(r'[\U00010000-\U0010ffff\u2600-\u27ff\ufe0f\u200d]', '', text).replace('—', '·')
    return re.sub(r'[ \t]+', ' ', text).strip()


def unique(items):
    return list(dict.fromkeys(clean(x) for x in items if x.strip()))


def land_inclusion(text):
    # Keep transfers in mixed paragraphs such as "왕복항공권, 전용 차량비".
    text = re.sub(r'왕복\s*항공권\s*[,，]?\s*', '', text)
    lines = [line for line in text.splitlines() if not re.search(r'항공|공항세|유류|관광진흥|전쟁보험|여행자보험', line)]
    return clean('\n'.join(lines)).replace('하나투어', '공급사')


TITLE_FIXES = {
    (3, 0): '샤먼 다색골프 · 준특급 호텔',
    (15, 1): '고베 토조노모리CC · 루트인 호텔',
    (15, 2): '고베 다색골프 · 후루츠플라워 온천호텔',
    (22, 0): '하이난 고염전CC 골프',
    (23, 0): '칭다오 캐슬렉스·영해·화산CC 다색골프',
    (26, 0): '클락 로얄센트럴CC · 한인타운 호텔',
    (32, 1): '치앙마이 알파인 다색골프 · 5성 호텔',
    (33, 1): '바탐 다색골프 · 5성 호텔',
    (33, 2): '바탐힐·인다푸리·아일랜드CC · 4성 호텔',
    (57, 0): '칸차나부리 허니퀸 파크골프 빌리지',
    (63, 0): '부산 출발 방콕 파인허스트 다색골프',
    (67, 0): '부산 출발 나트랑 아나라 빈티엔GC',
}

for p in products:
    d = json.loads((ROOT / f'data/imports/hanatour-details-{DATE}' / f"{p['slug']}.json").read_text())
    review = curation[p['slug']]
    assert review['sourceUrl'] == d['url'] == p['detailSourceUrl']
    key = (p['sourceCard'], p['sourceDetail'])
    old = raw[key[0]]['details'][key[1]]
    amount = int(re.sub(r'\D', '', old['price']))
    p['sourcePriceFrom'] = amount
    p['sourceHeading'] = d['heading']
    p.setdefault('sourceFamilyDuration', p['duration'])
    p['duration'] = f"{len(d['days'])}일"
    base = TITLE_FIXES.get(key, re.sub(r'\s+\d+(?:·\d+)*일$', '', p['title']))
    p['title'] = f"{base} {p['duration']}"
    p['detailCheckedAt'] = DATE
    p['updatedAt'] = DATE
    p['detailBasis'] = d['url'].split('pkgCd=')[-1].split('&')[0]
    date = re.search(r'출발\s*:\s*(\d{4}\.\d{2}\.\d{2})', d['text'])
    p['itineraryNote'] = f"{date.group(1) + ' 출발 ' if date else ''}{p['duration']} 대표 일정입니다. 항공권은 별도이며, 희망 출발일의 골프장·숙소·진행 순서는 견적서에서 확정합니다."
    p['priceBasis'] = 'land-only'
    p['priceNote'] = '항공권·항공 관련 세금은 별도. 최종 금액은 출발일과 인원 확인 후 안내합니다.'
    if key[0] in [40, 42, 44, 45]:
        p['priceFrom'] = amount
        p['price'] = f'{amount:,}원~'
    else:
        p.pop('priceFrom', None)
        p['price'] = '견적 문의'
    p['body'] = []
    p['highlights'] = []
    p['inclusionNote'] = '대표 출발일의 현지 구성입니다. 아래 비용은 해당 일정의 참고 조건이며, 희망 출발일·인원에 따라 최종 견적서로 확정합니다.'
    costs = {c['label']: c['items'] for c in d['costs']}
    p['includes'] = unique(land_inclusion(x) for x in costs['포함내역'])
    p['excludes'] = ['왕복 항공권·유류할증료·항공 관련 세금'] + unique(
        x for x in costs['불포함내역'] if not re.search(r'항공|매너팁', x))
    p['optionalCosts'] = unique(x for x in costs.get('선택경비', []) if not re.search(r'항공|클래스 차액|상품상세를|현지합류', x))
    if any('매너팁' in x for x in costs['불포함내역']):
        p['optionalCosts'].append('매너팁은 자율 선택이며, 지불하지 않아도 불이익이 없습니다.')
    p.pop('quoteNotice', None)
    p.pop('scheduleNotice', None)
    if '현지합류(불가)' in d['text']:
        p['quoteNotice'] = '공급사 원상품은 현지 합류 불가로 안내되어 있습니다. 항공 제외 구성 가능 여부를 먼저 확인하고, 어려운 경우 대체 상품을 안내합니다.'
    if key[0] in [5, 43]:
        p['scheduleNotice'] = ('2026년 12월 9일 출발 골프챌린지 일정입니다.' if key[0] == 5 else '2027년 7월 14일 출발 디오픈 참관 일정입니다.') + ' 다른 날짜는 같은 행사 구성으로 진행되지 않으며, 별도 골프여행으로 상담합니다.'
    p['itinerary'] = []
    for i, day in enumerate(d['days']):
        stops = []
        for stop in day['stops']:
            text = clean(stop.get('text') if stop.get('title') else stop.get('meal') or '')
            if not text or re.search(r'입국|미팅 안내|주의사항|원가|대행비|까놓고|거품', text):
                continue
            # Remove supplier-specific meeting instructions, retain the actual stop.
            text = '\n'.join(line for line in text.splitlines() if '하나투어' not in line)
            if text.strip():
                stops.append(text)
        golf = unique(day.get('golf', []))
        hotel = unique(day.get('hotel', []))
        if key[0] == 57:
            # Source hotel list contains a Pattaya hotel on this Kanchanaburi trip.
            hotel = [h for h in hotel if '타이 시암' not in h]
        if golf: stops.append('예정 골프장: ' + ', '.join(golf))
        if hotel: stops.append('예정 숙소: ' + ', '.join(hotel))
        if day.get('meals') and re.search(r'조식|중식|석식', day['meals']) and not any(s.get('meal') for s in day['stops']):
            stops.append('식사: ' + clean(day['meals']))
        if not stops:
            stops = ['항공 이동 일정 (항공권 별도)' if re.search('출발|도착|기내', day['text']) else '상세 진행 순서는 출발일별 견적서로 안내합니다.']
        summary = golf[0] + (' 외 예정 코스' if len(golf) > 1 else '') if golf else next((s.split('\n')[0] for s in stops if len(s.split('\n')[0]) > 6 and not re.search(r'조식|중식|석식|예정 숙소', s)), stops[0].split('\n')[0])
        p['itinerary'].append({'day': f'{i + 1}일차', 'summary': summary, 'plan': '\n'.join(unique(stops))})
    if key[0] == 7:
        p['includes'] = [x for x in p['includes'] if '숙박비' not in x] + ['르 블랑 헤리티지 호텔 숙박 (객실 인원 조건은 견적 시 확인)']
        p['inclusionNote'] += ' 객실 사용 인원은 견적 시 확인합니다.'
    if key[0] == 53:
        p['inclusionNote'] += ' 소노펠리체 CC 하이퐁 일정 기준이며, 숙소·식사 조건은 최종 견적서로 확인합니다.'
    if key[0] == 57:
        p['inclusionNote'] += ' 허니퀸 숙박 및 현지 합류 가능 여부는 별도 확인이 필요합니다.'
    photos = review['photos']
    p['gallery'] = [x['path'] for x in photos]
    p['galleryCaptions'] = [clean(x['caption']) for x in photos]
    p['gallerySubjects'] = [x['subject'] for x in photos]
    p['photoPending'] = bool(review.get('photoPending'))
    if p['photoPending']:
        # Only the primary course photo is pending; verified lodging stays visible.
        p['gallery'].insert(0, '/images/product-photo-pending.svg')
        p['galleryCaptions'].insert(0, '골프장 사진 확인 중')
        p['gallerySubjects'].insert(0, 'pending')
    elif photos:
        assert photos[0]['subject'] in ('course', 'clubhouse'), 'Hotel or generic image cannot be a product thumbnail'
    p['thumb'] = p['gallery'][0] if photos else '/images/product-photo-pending.svg'
    p['thumbCaption'] = p['galleryCaptions'][0] if photos else '골프장 사진 확인 중'
    if key[0] in (61, 62):
        # Supplier Choyo card mixes Saga geography with a Minamiaso facility.
        p['inclusionNote'] += ' 파크골프장의 정확한 시설명·위치는 견적서에서 재확인합니다.'
        for index, facility in [(1, '초요 파크골프장 예정 (시설 정보 재확인 필요)'), (2, '시오이가와 파크골프장 예정')]:
            p['itinerary'][index]['summary'] = facility
            p['itinerary'][index]['plan'] += '\n파크골프 라운드: ' + facility + '. 최종 시설·진행 조건은 견적서에서 확정합니다.'
    for x in photos: assets[x['path']] = x['src']
    golf = unique(x for day in d['days'] for x in day.get('golf', []))
    p['features'] = golf[:3]
    p['summary'] = f"{p['title']}. " + (f"예정 코스: {', '.join(golf[:2])}. " if golf else '') + '희망 출발일과 인원에 맞춰 항공 제외 구성 가능 여부와 견적을 안내합니다.'

DATA.write_text(json.dumps(products, ensure_ascii=False, indent=2) + '\n')
(ROOT / f'data/imports/hanatour-detail-assets-{DATE}.json').write_text(json.dumps(assets, ensure_ascii=False, indent=2) + '\n')
print(f'{len(products)} products; {len(assets)} curated images')
