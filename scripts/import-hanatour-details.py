# Rebuild public land-only product content from audited 2026-09-29 DOM snapshots.
from pathlib import Path
import json,re,hashlib
r=Path(__file__).resolve().parents[1];f=r/'src/data/hanatour-products.json';ps=json.loads(f.read_text());raw=json.loads((r/'data/imports/hanatour-golf-2026-09-29.json').read_text());downloads={}; excluded=set(json.loads((r/'data/imports/hanatour-detail-image-exclusions.json').read_text())['files'])
def clean(t):
 t=re.sub(r'[\U00010000-\U0010ffff\u2600-\u27ff\ufe0f\u200d]','',t).replace('—','·')
 return re.sub(r'[ \t]+',' ',t).strip()
for p in ps:
 old=raw[p['sourceCard']]['details'][p['sourceDetail']];amount=int(re.sub(r'\D','',old['price']))
 p['sourcePriceFrom']=amount;p['priceBasis']='land-only';p['body']=[]
 p['priceNote']='항공권·항공 관련 세금은 별도. 최종 금액은 출발일과 인원 확인 후 안내합니다.'
 if p['sourceCard'] in [40,42,44,45]:
  p['priceFrom']=amount;p['price']=f'{amount:,}원~'
 else:
  p.pop('priceFrom',None);p['price']='견적 문의'
 p['includes']=[];p['excludes']=['왕복 항공권·유류할증료·항공 관련 세금']
 p['inclusionNote']='현지 일정 기준입니다. 포함 내역과 추가 비용은 출발일·인원 확인 후 견적서로 확정합니다.'
 p['features']=[x for x in p.get('features',[]) if not re.search('항공|비즈니스|최저|1위',x)]
 p['highlights']=[]
 df=r/'data/imports/hanatour-details-2026-09-29'/f"{p['slug']}.json"
 if not df.exists():continue
 d=json.loads(df.read_text());p['detailSourceUrl']=d['url'];p['detailCheckedAt']=d['checkedAt'];p['detailBasis']=d['url'].split('pkgCd=')[-1].split('&')[0]
 p['itineraryNote']=f"{len(d['days'])}일 일정 예시 · 항공권 별도. 선택한 출발일에 따라 골프장·숙소·일정은 달라질 수 있습니다."
 p['inclusionNote']='공급사 대표 출발일의 현지 구성 안내입니다. 항공·항공 관련 세금은 제외하며, 실제 포함 내역은 최종 견적서에서 확인합니다.'
 p['includes']=[clean(x) for x in d['costs'][0]['items'] if x.strip() and not re.search('항공|공항세|유류|관광진흥|전쟁보험|여행자보험',x)]
 p['excludes'] += [clean(x) for c in d['costs'][1:] for x in c['items'] if x.strip() and not re.search('항공|클래스 차액|상품상세를',x)]
 p['itinerary']=[];pics=[];seen=set()
 for i,day in enumerate(d['days']):
  stops=[]
  for s in day['stops']:
   text=clean(s.get('text') if s.get('title') else s.get('meal') or '')
   if not text or re.search('입국|미팅 안내|주의사항|하나투어|원가|대행비|까놓고|거품',text):continue
   if text not in stops:stops.append(text)
  h=list(dict.fromkeys(day.get('hotel',[])));g=list(dict.fromkeys(day.get('golf',[])))
  if g:stops.append('예정 골프장: '+', '.join(map(clean,g)))
  if h:stops.append('예정 숙소: '+', '.join(map(clean,h)))
  if day.get('meals'):stops.append('식사: '+clean(day['meals']))
  if not stops:
   if '출발' in day['text'] or '도착' in day['text'] or '기내' in day['text']:stops=['항공 이동 일정 (항공권 별도)']
   else:stops=['상세 진행 순서는 출발일별 견적서로 안내합니다.']
  p['itinerary'].append({'day':f'{i+1}일차','plan':'\n'.join(stops)})
  for img in day['images']:
   key=img['src'].split('/')[-1]
   if key in seen:continue
   seen.add(key);pics.append(img)
 # Select a small set per facility so repeated course photos do not crowd out accommodation.
 counts={};chosen=[]
 for img in pics:
  label=clean(img['alt']) or '골프장·숙소';counts[label]=counts.get(label,0)+1
  if counts[label]<=2:chosen.append(img)
 for img in pics:
  if len(chosen)>=8:break
  if img not in chosen:chosen.append(img)
 chosen=[img for img in chosen[:8] if hashlib.sha256(img['src'].encode()).hexdigest()[:16]+'.webp' not in excluded];p['gallery']=[];p['galleryCaptions']=[]
 for img in chosen:
  name=hashlib.sha256(img['src'].encode()).hexdigest()[:16]+'.webp';local='/products/hanatour/details/'+name
  downloads[local]=img['src'];p['gallery'].append(local);p['galleryCaptions'].append(clean(img['alt']) or p['title'])
 if p['sourceCard']==7:
  p['includes']=[x for x in p['includes'] if '숙박비' not in x]+['르 블랑 헤리티지 호텔 숙박 (객실 인원 조건은 견적 시 확인)']
  p['inclusionNote']+=' 공급사 안내의 객실 인원 조건이 서로 달라 1인실·2인실 조건을 재확인합니다.'
f.write_text(json.dumps(ps,ensure_ascii=False,indent=2)+'\n');(r/'data/imports/hanatour-detail-assets-2026-09-29.json').write_text(json.dumps(downloads));print('details',sum('itinerary' in p for p in ps),'images',len(downloads))
