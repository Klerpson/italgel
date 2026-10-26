const { chromium } = require('C:/Users/Camilo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
// El servidor de revisión solo escucha en loopback.
const BASE = process.env.HAMBACH_BASE || 'http://127.0.0.1:4174';
const suffix = process.env.HAMBACH_BASE ? '-produccion' : '';
const out = 'C:/Users/Camilo/.codex/visualizations/2026/10/26/01a17952-c6f3-7341-9635-824b4183d88a';
(async () => {
  const browser = await chromium.launch({headless:true, channel:'msedge'});
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(BASE+'/equipos-cafe/', { waitUntil:'networkidle' });
  await page.locator('.cafe-main img, .cafe-hero img').evaluateAll(async els => {
    await Promise.all(els.map(async img => { img.loading = 'eager'; await img.decode(); }));
  });
  await page.screenshot({path:out+'/hambach-escritorio'+suffix+'.png',fullPage:true});
  const report = {h1:await page.locator('h1').allTextContents(),cards:await page.locator('.cafe-card').count(),brokenImages:await page.locator('.cafe-main img, .cafe-hero img').evaluateAll(els=>els.filter(e=>!e.complete||!e.naturalWidth).map(e=>e.src)),desktopOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)};
  await page.locator('#mini-neo summary').click();
  report.fichaAbierta = await page.locator('#mini-neo details').getAttribute('open') !== null;
  report.whatsapp = await page.locator('#mini-neo a').getAttribute('href');
  report.canonical = await page.locator('link[rel=canonical]').getAttribute('href');
  await page.setViewportSize({width:390,height:844});
  await page.goto(BASE+'/equipos-cafe/',{waitUntil:'networkidle'});
  await page.locator('.cafe-main img, .cafe-hero img').evaluateAll(async els => {
    await Promise.all(els.map(async img => { img.loading = 'eager'; await img.decode(); }));
  });
  report.mobileViewport = await page.evaluate(()=>innerWidth);
  report.mobileOverflow = await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  await page.screenshot({path:out+'/hambach-movil'+suffix+'.png',fullPage:true});
  await page.locator('#hamburger').click();
  await page.locator('.mobile-accordion-btn').filter({hasText:'Equipos'}).click();
  report.mobileCoffeeLink = await page.locator('.mobile-menu a[href="/equipos-cafe/"]').isVisible();
  for (const path of ['/','/equipos/']) {
    await page.goto(BASE+path,{waitUntil:'networkidle'});
    report[path] = {promo:await page.locator('.cafe-promo').count(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)};
  }
  const sitemap = await (await page.request.get(BASE+'/sitemap.xml')).text();
  report.sitemap=sitemap.includes('https://italgel.com.co/equipos-cafe/');
  const search = await (await page.request.get(BASE+'/search.json')).json();
  report.search=search.some(x=>x.url==='/equipos-cafe/');
  report.pdfs=[];
  for(const pdf of ['catalogo-hambach.pdf','catalogo-molinos.pdf']) report.pdfs.push({pdf,status:(await page.request.get(BASE+'/catalogos/'+pdf)).status()});
  fs.writeFileSync(out+'/hambach-validacion'+suffix+'.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
