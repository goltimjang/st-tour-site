"""Check import coverage, source price/image lineage, and generated product destinations."""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
raw=json.loads((ROOT/'data/imports/hanatour-golf-2026-09-29.json').read_text())
products=json.loads((ROOT/'src/data/hanatour-products.json').read_text())
curation=json.loads((ROOT/'data/imports/hanatour-photo-curation-2026-09-30.json').read_text())
rejected=set(json.loads((ROOT/'data/imports/hanatour-photo-review-2026-09-30.json').read_text())['removed'])
assert len(products)==76
assert len({p['slug'] for p in products})==len(products)
assert len({p['title'] for p in products})==len(products)
assert len({p['detailSourceUrl'] for p in products})==len(products), 'Each product must have its own audited itinerary'
assert len({p['sourceImage'] for p in products}) > 65
covered={(p['sourceCard'],p['sourceDetail']) for p in products}
skipped={(1,0),(16,0),(48,2)} # Identical products: general St Andrews, Castlex, Athitaya.
assert covered|skipped == {(i,j) for i,c in enumerate(raw) for j,_ in enumerate(c['details'])}
assert [i for i,c in enumerate(raw) if not c['details']]==[52,68]
for p in products:
 d=raw[p['sourceCard']]['details'][p['sourceDetail']]
 assert p['sourcePriceFrom']==int(re.sub(r'[^0-9]','',d['price'])),p['slug']
 assert p['priceBasis']=='land-only'
 if p['sourceCard'] in [40,42,44,45]:
  assert p['priceFrom']==p['sourcePriceFrom']
  assert p['price']==f"{p['priceFrom']:,}원~"
 else:
  assert 'priceFrom' not in p and p['price']=='견적 문의'
 assert not any(re.search('항공|유류|공항세',x) for x in p['includes'])
 assert '왕복 항공권' in p['excludes'][0]
 for image in p.get('gallery',[]): assert (ROOT/'public'/image.lstrip('/')).is_file()
 assert p.get('itinerary') and p.get('gallery') and p.get('includes'),p['slug']
 if p.get('itinerary'):
  detail=json.loads((ROOT/'data/imports/hanatour-details-2026-09-30'/f"{p['slug']}.json").read_text())
  assert detail['url']==p['detailSourceUrl']
  assert p['detailBasis'] in detail['text'][:800], 'Wrong departure page captured'
  assert len(p['itinerary'])==len(detail['days'])
  assert p['duration']==f"{len(detail['days'])}일" and p['title'].endswith(p['duration'])
  assert p['detailCheckedAt']=='2026-09-30'
  reviewed=curation[p['slug']]
  assert reviewed['sourceUrl']==detail['url']
  assert p['gallery']==[x['path'] for x in reviewed['photos']]
  assert p['thumb']==p['gallery'][0] and len(p['gallery'])==len(p['galleryCaptions'])
  assert not rejected.intersection(p['gallery'])
  for photo in reviewed['photos']:
   assert any(c['title']==photo['facility'] and photo['src'] in [im['src'] for im in c['images']] for day in detail['days'] for c in day['cards']), 'Photo belongs to another facility or product'
   assert not re.search('입국|미팅|출국|지도|선택관광',photo['facility']), 'Irrelevant gallery card'
  if '현지합류(불가)' in detail['text']: assert '현지 합류 불가' in p.get('quoteNotice','')
 assert p['sourceImage']==d['image']
 assert (ROOT/'public'/p['thumb'].lstrip('/')).is_file()
 assert p['quoteUrl']==f"/products/{p['slug']}/#quote"
 text=' '.join([p['title'],p['summary'],*p['body']])
 assert not re.search(r'원가|대행비|까놓고|거품|—|최저가보장|최저가 보장|판매 1위',text)
 html=(ROOT/'out/products'/p['slug']/'index.html').read_text()
 assert 'id="quote"' in html and p['title'] in html
 assert 'TouristTrip' in html
 assert '1899-7972' not in html and '나침반여행사' not in html
 # Mixed airfare/transfer paragraphs must retain their land transport information.
 if p['sourceCard']==15 and p['sourceDetail'] in (0,2): assert any('송영차량' in x for x in p['includes'])
 if p['sourceCard']==53: assert all('옌바이' not in x and '르블랑' not in x for x in p['galleryCaptions'])
print('PASS: 76 live-source snapshots, matching duration, facility-bound photos, land-join caveats, mixed inclusion parsing, static quote routes and price safety')
