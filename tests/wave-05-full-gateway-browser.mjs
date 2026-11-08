import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { resolve,dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const file=p=>readFileSync(resolve(root,p));
const gitBlob=buffer=>createHash("sha1").update("blob "+buffer.length+"\0").update(buffer).digest("hex");
const pinned={
 "index.html":"a883f035329a89e55d526160c54ffdac3c7af2f9",
 "assets/khaemenes-interlingual-core.js":"13955ca419bcdb785ba1289137553f67306b0d77",
 "tests/fixtures/vnv-language.source-snapshot.js":"b65ef766cfbd0adcd88b4e7cc970a1e3ee35bd7c",
 "tests/fixtures/vnv-ticker-autopopulate.source-snapshot.js":"0bd454d19f16dc7d253c3ef37c86449d57d4e213",
 "tests/fixtures/vnv-ecosystem-toolbar.source-snapshot.js":"1018290c6c29ca4ed527df1febbd8b718e97c7bd",
 "tests/fixtures/khaemenes-translator-loader.v1.1.js":"1ebfa3c7e427cc416695cb45f935ba56a456c9b8"
};
for(const [name,sha] of Object.entries(pinned))assert.equal(gitBlob(file(name)),sha,"upstream source hash changed: "+name);

const assets=new Map([
 ["/","index.html"],
 ["/index.html","index.html"],
 ["/assets/vervenveda-global-standard.css","assets/vervenveda-global-standard.css"],
 ["/assets/vnv-global-standard.css","assets/vnv-global-standard.css"],
 ["/assets/khaemenes-campus-phrases.js","assets/khaemenes-campus-phrases.js"],
 ["/assets/khaemenes-interlingual-core.js","assets/khaemenes-interlingual-core.js"],
 ["/assets/vnv-language.js","tests/fixtures/vnv-language.source-snapshot.js"],
 ["/assets/vnv-ticker-autopopulate.js","tests/fixtures/vnv-ticker-autopopulate.source-snapshot.js"]
]);
const server=createServer((req,res)=>{
 const pathname=new URL(req.url,"http://127.0.0.1").pathname;
 const path=assets.get(pathname);
 if(!path){res.writeHead(404);res.end("isolated staging missing: "+pathname);return;}
 res.writeHead(200,{"Cache-Control":"no-store","Content-Type":pathname.endsWith(".css")?"text/css":pathname.endsWith(".js")?"text/javascript":"text/html; charset=utf-8"});
 res.end(file(path));
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const base="http://127.0.0.1:"+server.address().port;
const browser=await chromium.launch({headless:true});
const external=new Map([
 ["https://vervenveda.com/assets/vnv-ecosystem-toolbar.js","tests/fixtures/vnv-ecosystem-toolbar.source-snapshot.js"],
 ["https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js","tests/fixtures/khaemenes-translator-loader.v1.1.js"],
 ["https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-interlingual-core.js","tests/fixtures/khaemenes-interlingual-core.canonical-snapshot.js"]
]);
const canonicalExtras={
 "sovereign-dictionary.generated.js":"window.KhaemenesSovereignDictionary={entries:[],creativeVocabulary:[]};",
 "khaemenes-lexicon-expansion.js":"window.KhaemenesLexiconExpansion={entries:[]};",
 "khaemenes-transliteration.js":"window.KhaemenesTransliteration={};",
 "khaemenes-review-policy.js":"window.KhaemenesReviewPolicy={};"
};
async function scenario(viewport,label,blockDictionary=false){
 const context=await browser.newContext({viewport,serviceWorkers:"block"});
 const page=await context.newPage();
 const errors=[],blocked=[],missing=[];
 page.on("pageerror",e=>errors.push(e.message.slice(0,200)));
 page.on("response",res=>{if(res.status()>=400&&res.url().startsWith(base))missing.push(res.url().slice(base.length));});
 await page.route("**/*",async route=>{
  const u=new URL(route.request().url());
  if(u.origin===base)return route.continue();
  const stripped=u.origin+u.pathname;
  if(external.has(stripped)){
   return route.fulfill({status:200,contentType:"text/javascript",body:file(external.get(stripped))});
  }
  const prefix="https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/";
  if(stripped.startsWith(prefix)){
   const name=stripped.slice(prefix.length);
   if(blockDictionary&&name==="sovereign-dictionary.generated.js"){
     blocked.push("simulated missing canonical dictionary");
     return route.abort();
   }
   if(Object.hasOwn(canonicalExtras,name))return route.fulfill({status:200,contentType:"text/javascript",body:canonicalExtras[name]});
  }
  // Do not allow any real network calls, including translation services.
  blocked.push(stripped.slice(0,160));
  return route.abort();
 });
 try{
  await page.goto(base+"/?chrome_audit=1",{waitUntil:"domcontentloaded",timeout:30000});
  await page.waitForTimeout(1100);
  const result=await page.evaluate(()=>{
   const bootstrap=window.VNVGatewayBootstrap?.verify?.();
   const count=sel=>document.querySelectorAll(sel).length;
   return {
    title:document.title,
    gateway:count("#gatewayTitle"),
    tickers:{native:count("#networkTicker"),auto:count("#vnvTickerAutoPopulate")},
    header:count("body > .site-header"),
    menu:count("#menuOverlay"),drawer:count("#menuDrawer"),
    rail:count("#vnv-language-rail"),selector:count("#vnv-language-switch"),
    toolbar:count("#vnvEcosystemUtilityDock"),
    languageApi:!!window.VNVLanguage,languageCount:window.VNVLanguage?.availableLanguages?.().length,
    legacyApi:!!window.KhaemenesSovereignTranslate,
    canonicalCore:typeof window.KhaemenesSovereignTranslate?.listLocalEntries==="function",
    loader:window.KhaemenesTranslatorLoader?.status?.()||null,
    bootstrap:bootstrap||null,
    earlyTrace:window.VNVEarlyRefreshTrace?.events?.().slice(-18)||[]
   };
  });
  console.log("FULL_PAGE_EVIDENCE "+label+" "+JSON.stringify({result,errors,blocked:blocked.slice(0,15),missing:missing.slice(0,15)}));
  assert.equal(result.gateway,1,label+" gateway");
  assert.equal(result.header,1,label+" header");
  assert.equal(result.tickers.native,1,label+" native ticker");
  assert.equal(result.tickers.auto,1,label+" auto ticker");
  assert.equal(result.menu,1,label+" hamburger overlay");
  assert.equal(result.rail,1,label+" translation rail");
  assert.equal(result.selector,1,label+" translator selector");
  assert.equal(result.languageCount,13,label+" language count");
  assert.equal(result.toolbar,1,label+" utility rail");
  assert.equal(result.legacyApi,true,label+" translator core");
  assert.equal(result.canonicalCore,!blockDictionary,label+" canonical upgrade/fallback");
  await page.evaluate(()=>window.VNVLanguage.setLanguage("es",false));
  await page.waitForFunction(()=>document.documentElement.lang==="es");
  assert.equal(await page.locator("#vnv-language-switch").count(),1,"no duplicate language selector");
  console.log("PASS complete homepage: "+label);
 }finally{await context.close();}
}
try{
 await scenario({width:1440,height:900},"desktop");
 await scenario({width:390,height:844},"mobile");
 await scenario({width:1440,height:900},"canonical-dictionary-unavailable",true);
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
console.log("FULL_PAGE_BROWSER_AUDIT=PASS; PRODUCTION_HTML_UNCHANGED=YES; STOS_WRITE=NONE; CUTOVER=HOLD");
