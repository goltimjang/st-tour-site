#!/usr/bin/env python3
"""
해외 지도의 '지역 경계'(클릭해서 고르는 영역)를 다시 만드는 스크립트.
지역을 새로 추가했을 때 AREA_PROV에 행정구역을 매핑하고 실행하면 된다.

  python3 scripts/build-world-areas.py <ne_10m_admin_1_states_provinces.geojson 경로>

원본 데이터: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson
"""
import json, sys, os

ADMIN_OF = {
    'japan': 'Japan', 'thailand': 'Thailand', 'vietnam': 'Vietnam', 'philippines': 'Philippines',
    'china': 'China', 'taiwan': 'Taiwan', 'indonesia': 'Indonesia', 'laos': 'Laos',
    'malaysia': 'Malaysia', 'australia': 'Australia',
}

# 사이트의 area 값 -> 그 지역을 이루는 행정구역(name_en)
AREA_PROV = {
 'japan': {
  '후쿠오카/벳푸': ['Fukuoka Prefecture', 'Ōita Prefecture'],
  '구마모토': ['Kumamoto Prefecture'],
  '나가사키/기타큐슈/사가': ['Nagasaki Prefecture', 'Saga Prefecture'],
  '미야자키/가고시마': ['Miyazaki Prefecture', 'Kagoshima Prefecture'],
  '오키나와': ['Okinawa Prefecture'],
  '오사카/고베': ['Ōsaka Prefecture', 'Hyōgo Prefecture', 'Kyōto Prefecture', 'Nara Prefecture', 'Shiga Prefecture', 'Wakayama Prefecture'],
  '나고야': ['Aichi Prefecture', 'Gifu Prefecture', 'Mie Prefecture'],
  '시즈오카': ['Shizuoka Prefecture', 'Yamanashi Prefecture'],
  '동경': ['Tokyo', 'Chiba Prefecture', 'Kanagawa Prefecture', 'Saitama Prefecture', 'Ibaraki Prefecture', 'Tochigi Prefecture', 'Gunma Prefecture'],
  '고마츠': ['Ishikawa Prefecture', 'Fukui Prefecture', 'Toyama Prefecture'],
  '히로시마/마쓰야마/다카마츠': ['Hiroshima Prefecture', 'Ehime Prefecture', 'Kagawa Prefecture', 'Okayama Prefecture', 'Yamaguchi Prefecture', 'Tokushima Prefecture', 'Kōchi Prefecture', 'Tottori Prefecture', 'Shimane Prefecture'],
  '북해도': ['Hokkaidō'],
  '아오모리/센다이': ['Aomori Prefecture', 'Miyagi Prefecture', 'Iwate Prefecture', 'Akita Prefecture', 'Yamagata Prefecture', 'Fukushima Prefecture'],
 },
 'thailand': {
  '파타야': ['Chon Buri', 'Rayong'],
  '방콕': ['Bangkok', 'Samut Prakan', 'Pathum Thani', 'Nonthaburi', 'Samut Sakhon', 'Nakhon Pathom'],
  '아유타야/카오야이': ['Phra Nakhon Si Ayutthaya', 'Nakhon Ratchasima', 'Saraburi', 'Nakhon Nayok'],
  '치앙마이': ['Chiang Mai', 'Chiang Rai', 'Lamphun', 'Lampang'],
  '푸켓': ['Phuket', 'Phang Nga', 'Krabi'],
  '칸차나부리': ['Kanchanaburi', 'Ratchaburi'],
  '후아힌': ['Prachuap Khiri Khan', 'Phetchaburi'],
 },
 'vietnam': {
  '하노이': ['Hanoi', 'Ninh Bình', 'Vĩnh Phúc', 'Hòa Bình', 'Bắc Ninh', 'Hải Dương', 'Haiphong', 'Quảng Ninh', 'Hà Nam', 'Bắc Giang', 'Thái Nguyên', 'Phú Thọ', 'Nam Định', 'Thanh Hóa'],
  '다낭': ['Da Nang', 'Quảng Nam', 'Thừa Thiên Huế', 'Quảng Bình', 'Quảng Trị'],
  '나트랑': ['Khánh Hòa', 'Ninh Thuận', 'Phú Yên', 'Lâm Đồng'],
  '호치민/푸꾸옥': ['Ho Chi Minh', 'Đồng Tháp', 'Long An', 'Bình Dương', 'Đông Nam Bộ', 'Bà Rịa-Vũng Tàu', 'Kiên Giang', 'Bình Thuận', 'Tây Ninh', 'Bình Phước', 'Cần Thơ'],
 },
 'philippines': {
  '클락': ['Pampanga', 'Angeles', 'Tarlac', 'Nueva Ecija', 'Bulacan'],
  '수빅': ['Zambales', 'Olongapo', 'Bataan'],
  '마닐라': ['Metro Manila', 'Cavite', 'Laguna', 'Rizal', 'Batangas', 'Quezon'],
  '세부': ['Cebu', 'Lapu-Lapu', 'Mandaue', 'Bohol'],
  '보라카이': ['Aklan'],
  '바콜로드/네그로스': ['Negros Occidental', 'Bacolod'],
  '다바오': ['Davao', 'Davao del Sur', 'Davao del Norte', 'Davao de Oro', 'Davao Oriental'],
 },
 'china': {
  '청도/연태/위해': ['Shandong'], '대련/심양': ['Liaoning'],
  '제남/북경/천진': ['Beijing', 'Tianjin', 'Hebei'], '해남도': ['Hainan'],
  '광저우/선전/하문': ['Guangdong', 'Fujian'], '곤명/장가계': ['Yunnan', 'Hunan'],
 },
 'taiwan': {
  '타이베이': ['Taipei', 'New Taipei', 'Taoyuan', 'Keelung', 'Yilan', 'Hsinchu'],
  '가오슝/타이중': ['Kaohsiung', 'Taichung City', 'Tainan', 'Changhua', 'Nantou', 'Chiayi', 'Yunlin', 'Pingtung'],
 },
 'indonesia': {'발리': ['Bali'], '바탐/빈탄': ['Riau Islands']},
 'laos': {'비엔티안/루앙프라방': ['Vientiane', 'Vientiane Prefecture', 'Luang Prabang']},
 'malaysia': {'코타키나발루': ['Sabah'], '조호바루': ['Johor']},
 'australia': {'시드니': ['New South Wales'], '골드코스트/브리즈번': ['Queensland'], '멜버른': ['Victoria']},
}

def main(adm_path):
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    adm = json.load(open(adm_path))
    maps = json.load(open(f'{root}/src/data/world-maps.json'))
    out, missing = {}, []

    for slug, areas in AREA_PROV.items():
        m = maps.get(slug)
        if not m:
            continue
        P, (VW, VH) = m['proj'], m['viewBox']
        def proj(lng, lat):
            return ((lng - P['lng0']) * P['cos'] * P['unit'], (P['lat1'] - lat) * P['unit'])
        tol = (VW / (P['cos'] * P['unit'])) / 300

        byname = {}
        for f in adm['features']:
            if f['properties'].get('admin') != ADMIN_OF[slug]:
                continue
            n = f['properties'].get('name_en') or f['properties'].get('name')
            byname.setdefault(n, []).append(f)

        area_paths = {}
        for area, provs in areas.items():
            paths = []
            for pv in provs:
                if pv not in byname:
                    missing.append((slug, area, pv)); continue
                for f in byname[pv]:
                    g = f['geometry']
                    polys = [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
                    for poly in polys:
                        ring = poly[0]
                        xs = [c[0] for c in ring]; ys = [c[1] for c in ring]
                        if (max(xs) - min(xs)) * (max(ys) - min(ys)) < (tol * 3) ** 2:
                            continue
                        pts, last = [], None
                        for c in ring:
                            if last and abs(c[0] - last[0]) < tol and abs(c[1] - last[1]) < tol:
                                continue
                            pts.append(c); last = c
                        if len(pts) < 4:
                            continue
                        paths.append(''.join(
                            f"{'M' if i == 0 else 'L'}{proj(c[0], c[1])[0]:.1f} {proj(c[0], c[1])[1]:.1f}"
                            for i, c in enumerate(pts)) + 'Z')
            if paths:
                area_paths[area] = ' '.join(paths)
        out[slug] = area_paths

    json.dump(out, open(f'{root}/src/data/world-areas.json', 'w'), ensure_ascii=False, separators=(',', ':'))
    for k, v in out.items():
        print(f'{k:12s} 지역 {len(v)}개')
    if missing:
        print('매핑 실패:', missing)

if __name__ == '__main__':
    main(sys.argv[1])
