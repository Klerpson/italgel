import json,concurrent.futures
from pathlib import Path
from urllib.request import urlopen,Request
from urllib.parse import urljoin,urlparse,unquote
from bs4 import BeautifulSoup
BASE='https://italgel.com.co'
def get(u):
 with urlopen(Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=40) as r:return r.status,r.url(),r.read()
def check(item):
 route,href=item;u=urljoin(BASE+route,href);parsed=urlparse(u)
 try:
  status,final,body=get(u);anchor=not parsed.fragment or BeautifulSoup(body,'html.parser').find(id=unquote(parsed.fragment)) is not None
  return {'route':route,'href':href,'status':status,'final':final,'anchor':anchor}
 except Exception as e:return {'route':route,'href':href,'error':str(e)}
items=[]
for route in ['/productos-quella/','/insumos-heladeria-medellin/']:
 soup=BeautifulSoup(get(BASE+route)[2],'html.parser')
 items.extend((route,h) for h in sorted({a['href'] for a in soup.select('a[href]') if urlparse(urljoin(BASE+route,a['href'])).netloc=='italgel.com.co'}))
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:results=list(pool.map(check,items))
failures=[r for r in results if r.get('error') or r.get('status')!=200 or not r.get('anchor')]
Path(__file__).with_name('pulido-enlaces-vivo.json').write_text(json.dumps({'results':results,'failures':failures},ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'checked':len(results),'failures':failures}));assert not failures
