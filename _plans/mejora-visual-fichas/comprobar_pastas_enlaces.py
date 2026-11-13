import json,concurrent.futures
from pathlib import Path
from urllib.request import urlopen,Request
from urllib.parse import urljoin,urlparse,unquote
from html.parser import HTMLParser
class Document(HTMLParser):
 def __init__(self,body):
  super().__init__();self.links=set();self.ids=set();self.feed(body.decode('utf8'))
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  if tag=='a' and a.get('href'):self.links.add(a['href'])
BASE='https://italgel.com.co'
def get(u):
 with urlopen(Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=40) as r:return r.status,r.geturl(),r.read()
def check(item):
 route,href=item;u=urljoin(BASE+route,href);parsed=urlparse(u)
 try:
  status,final,body=get(u);anchor=not parsed.fragment or unquote(parsed.fragment) in Document(body).ids
  return {'route':route,'href':href,'status':status,'final':final,'anchor':anchor}
 except Exception as e:return {'route':route,'href':href,'error':str(e)}
items=[]
for route in ['/pastas-sabores-helado/']:
 soup=Document(get(BASE+route)[2])
 items.extend((route,h) for h in sorted({a for a in soup.links if urlparse(urljoin(BASE+route,a)).netloc=='italgel.com.co'}))
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:results=list(pool.map(check,items))
failures=[r for r in results if r.get('error') or r.get('status')!=200 or not r.get('anchor')]
Path(__file__).with_name('pastas-enlaces-vivo.json').write_text(json.dumps({'results':results,'failures':failures},ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'checked':len(results),'failures':failures}));assert not failures
