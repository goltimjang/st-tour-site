#!/usr/bin/env python3
"""
해외 골프장 조사 파일(ov-*.json)을 overseas-courses.json 하나로 병합한다.
새 조사 파일이 생기면 FILES에 추가하고 실행하면 된다.

  python3 scripts/merge-overseas.py
"""
import json, os, sys
from collections import Counter

FILES = ['ov-japan', 'ov-jp2', 'ov-sea', 'ov-asia', 'ov-far', 'ov-more',
         'ov-ph2', 'ov-th2', 'ov-vn2', 'ov-cn2', 'ov-sea2', 'ov-rec']

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
merged, seen = [], set()
dups = []
for f in FILES:
    p = f'{root}/src/data/{f}.json'
    if not os.path.exists(p):
        continue
    for x in json.load(open(p)):
        key = (x['country'], x['name'].replace(' ', ''))
        if key in seen:
            dups.append((f, x['name'])); continue
        seen.add(key)
        merged.append(x)

bad = [x['name'] for x in merged if not (isinstance(x.get('lat'), (int, float)) and isinstance(x.get('lng'), (int, float)))]
if bad:
    print('좌표 없는 항목(병합 중단):', bad); sys.exit(1)

json.dump(merged, open(f'{root}/src/data/overseas-courses.json', 'w'), ensure_ascii=False, indent=1)
print('총', len(merged), '| url', sum(1 for x in merged if x.get('url')))
for k, v in Counter(x['country'] for x in merged).most_common():
    print(f'  {k}: {v}')
if dups:
    print('중복 제외:', dups)

# 지역 경계 누락 확인 (지도로 그리는 나라만)
areas = json.load(open(f'{root}/src/data/world-areas.json'))
miss = {(x['country'], x['area']) for x in merged
        if areas.get(x['country']) is not None and x['area'] not in areas[x['country']]}
print('경계 없는 지역:', miss or '없음')
