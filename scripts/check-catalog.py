"""Check import coverage, source price/image lineage, and generated product destinations."""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
raw=json.loads((ROOT/'data/imports/hanatour-golf-2026-09-29.json').read_text())
products=json.loads((ROOT/'src/data/hanatour-products.json').read_text())
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
  detail=json.loads((ROOT/'data/imports/hanatour-details-2026-09-29'/f"{p['slug']}.json").read_text())
  assert detail['url']==p['detailSourceUrl']
  assert len(p['itinerary'])==len(detail['days'])
 assert p['sourceImage']==d['image']
 assert (ROOT/'public'/p['thumb'].lstrip('/')).is_file()
 assert p['quoteUrl']==f"/products/{p['slug']}/#quote"
 text=' '.join([p['title'],p['summary'],*p['body']])
 assert not re.search(r'원가|대행비|까놓고|거품|—|최저가보장|최저가 보장|판매 1위',text)
 html=(ROOT/'out/products'/p['slug']/'index.html').read_text()
 assert 'id="quote"' in html and p['title'] in html
 assert 'TouristTrip' in html
 assert '1899-7972' not in html and '나침반여행사' not in html
print('PASS: 71 source cards, 79 results, 76 products, 3 duplicates, 2 unavailable cards; air-excluded price safety, itinerary/image provenance and quote routes')
