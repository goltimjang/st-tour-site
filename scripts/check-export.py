"""Static export regression: metadata, structured data, local links/assets, known quote defects."""
from pathlib import Path
from html.parser import HTMLParser
import json
from urllib.parse import urlsplit, unquote
ROOT=Path(__file__).resolve().parents[1]/'out'
class Page(HTMLParser):
 def __init__(self, html):
  super().__init__(); self.assets=[];self.links=[];self.ld=[];self.ids=set();self.canonical=[];self.h1=0;self.inld=False;self.feed(html)
 def handle_starttag(self, tag, attrs):
  a=dict(attrs)
  if a.get('id'): self.ids.add(a['id'])
  if tag=='h1': self.h1+=1
  if tag=='link' and a.get('rel')=='canonical': self.canonical.append(a.get('href'))
  if tag=='script' and a.get('type')=='application/ld+json': self.inld=True
  if tag in ['img','video','source','script'] and a.get('src','').startswith('/'): self.assets.append(a['src'])
  if tag=='a' and a.get('href','').startswith('/'): self.links.append(a['href'])
 def handle_endtag(self, tag):
  if tag=='script':self.inld=False
 def handle_data(self, data):
  if self.inld:self.ld.append(json.loads(data))
pages={('/' if p.parent==ROOT else '/'+p.parent.relative_to(ROOT).as_posix()+'/'):Page(p.read_text()) for p in ROOT.rglob('index.html') if '_not-found' not in p.parts}
errors=[]
for route,p in pages.items():
 if route=='/404/':continue
 if p.h1!=1:errors.append(f'{route}: h1 count {p.h1}')
 if p.canonical!=['https://www.stgolftours.com'+route]:errors.append(f'{route}: canonical {p.canonical}')
 for typ in ['TravelAgency','WebSite','WebPage']:
  if not any(ld.get('@type')==typ for ld in p.ld): errors.append(f'{route}: missing {typ}')
 for asset in p.assets:
  if not (ROOT/unquote(urlsplit(asset).path).lstrip('/')).is_file(): errors.append(f'{route}: missing asset {asset}')
 for link in p.links:
  u=urlsplit(link); target=unquote(u.path); file=ROOT/target.lstrip('/')
  if not (file.is_file() or (file/'index.html').is_file()):errors.append(f'{route}: broken link {link}')
  if u.fragment and target.rstrip('/')+'/' in pages and u.fragment not in pages[target.rstrip('/')+'/'].ids:errors.append(f'{route}: missing anchor {link}')
 for ld in p.ld:
  if ld.get('@type')=='FAQPage':
   qs=[q['name'] for q in ld['mainEntity']]
   if len(qs)!=len(set(qs)):errors.append(f'{route}: duplicate FAQ')
assert '25,000' in (ROOT/'about/index.html').read_text(), 'stats must render server-side'
from datetime import datetime, timedelta
modified = next(ld['dateModified'] for ld in pages['/'].ld if ld.get('@type')=='WebPage')
expected = (datetime.fromisoformat(modified)-timedelta(hours=9)).strftime('%Y-%m-%dT%H:%M:%S.000Z')
assert expected in (ROOT/'sitemap.xml').read_text(), 'sitemap freshness'
assert 'Sitemap: https://www.stgolftours.com/sitemap.xml' in (ROOT/'robots.txt').read_text()
if errors: raise SystemExit('\n'.join(sorted(set(errors))))
print(f'PASS: {len(pages)} pages, unique H1/canonical, structured data, local links/anchors/assets, static stats and sitemap')
