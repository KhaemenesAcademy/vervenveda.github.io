import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import assert from "node:assert/strict";
import {chromium} from "playwright";
const root=path.resolve("wave-06-quarantine-site");
const manifest=JSON.parse(fs.readFileSync(path.join(root,"staging-bundle-manifest.json"),"utf8"));
assert.equal(manifest.files.length,21);
assert.equal(manifest.restrictedPages,11021);
assert.equal(manifest.publicDeploymentAuthorized,false);
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".css":"text/css",".png":"image/png",".webmanifest":"application/manifest+json"};
const server=https.createServer({
 key:fs.readFileSync("staging-local-key.pem"),cert:fs.readFileSync("staging-local-cert.pem")
},(req,res)=>{
 const pathname=new URL(req.url,"https://localhost").pathname;
 const target=path.resolve(root,"."+((pathname==="/")?"/index.html":pathname));
 if(!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 try{
  const data=fs.readFileSync(target);
  res.writeHead(200,{"Content-Type":types[path.extname(target)]||"application/octet-stream","Cache-Control":"no-store"});
  res.end(data);
 }catch{res.writeHead(404);res.end("not found");}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const origin="https://127.0.0.1:"+server.address().port;
const browser=await chromium.launch({headless:true});
const evidence=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
 const context=await browser.newContext({ignoreHTTPSErrors:true,viewport,serviceWorkers:"block"});
 const page=await context.newPage(),requests=[],errors=[],fails=[],externalExecutable=[];
 page.on("pageerror",e=>errors.push(e.message.slice(0,220)));
 page.on("response",resp=>{if(resp.url().startsWith(origin)&&resp.status()>=400)fails.push({url:resp.url().slice(origin.length),status:resp.status()})});
 await page.route("**/*",route=>{
  const url=route.request().url();
  if(url.startsWith(origin+"/"))return route.continue();
  requests.push({url:url.slice(0,170),type:route.request().resourceType()});
  if(["script","fetch","xhr","worker"].includes(route.request().resourceType()))externalExecutable.push(url.slice(0,170));
  return route.abort();
 });
 try{
  await page.goto(origin+"/",{waitUntil:"domcontentloaded",timeout:30000});
  await page.waitForFunction(()=>document.querySelector("#ecosystemPageStatus")?.textContent.includes("11,021"),null,{timeout:20000});
  const upgrade=await page.evaluate(async()=>{
    const loader=window.KhaemenesTranslatorLoader;
    if(!loader)return {present:false,canonical:false,records:[]};
    const result=await loader.ensure({full:true,upgradeLegacyCore:true});
    return {present:true,canonical:result.canonicalCore,records:result.records.map(x=>({key:x.key,state:x.state}))};
  });
  assert.equal(upgrade.present,true,"Canonical loader missing from quarantined bundle");
  assert.equal(upgrade.canonical,true,"Canonical core did not activate after local dependencies");
  assert.equal(upgrade.records.some(x=>x.state==="unavailable"),false,"Missing Linguistics dependency in staging bundle");
  const state=await page.evaluate(()=>({
   pageIndex:document.querySelectorAll("#completePageIndex").length,
   nativeTicker:document.querySelectorAll("#networkTicker").length,
   autoTicker:document.querySelectorAll("#vnvTickerAutoPopulate").length,
   menu:document.querySelectorAll("#menuOverlay").length,
   languageSelector:document.querySelectorAll("#vnv-language-switch").length,
   toolbar:document.querySelectorAll("#vnvEcosystemUtilityDock").length,
   languageCount:window.VNVLanguage?.availableLanguages?.().length,
   translatorCore:!!window.KhaemenesSovereignTranslate,
   canonicalCore:typeof window.KhaemenesSovereignTranslate?.listLocalEntries==="function"
  }));
  assert.equal(state.pageIndex,1);
  assert.equal(state.nativeTicker,1);
  assert.equal(state.autoTicker,1);
  assert.equal(state.menu,1);
  assert.equal(state.languageSelector,1);
  assert.equal(state.toolbar,1);
  assert.equal(state.languageCount,13);
  assert.equal(state.translatorCore,true);
  assert.equal(state.canonicalCore,true);
  assert.deepEqual(externalExecutable,[],"Staging bundle attempted external executable/data requests");
  const blocking=errors.filter(s=>!/Service\s*Worker|serviceWorker/.test(s));
  assert.deepEqual(blocking,[],"Unexpected homepage script errors");
  assert.deepEqual(fails.filter(x=>x.url.startsWith("/assets/")||x.url.startsWith("/registry/")||x.url.startsWith("/Khaemenes_Linguistics.github.io/")||x.url.startsWith("/ecosystem/")),[],"Missing staging assets");
  const item={viewport,success:true,state,upgrade,externalBlocked:requests,externalExecutable,errors,missingAssetResponses:fails};
  evidence.push(item);
  console.log("QUARANTINE_BROWSER=PASS "+JSON.stringify(item).slice(0,1700));
 }finally{await context.close();}
}
await browser.close();
await new Promise(resolve=>server.close(resolve));
fs.writeFileSync("wave-06-quarantine-browser-evidence.json",JSON.stringify({schema:"vnv-wave-06-quarantine-browser-v1",tests:evidence,
 publiclyReachable:false,publicReleaseAuthorized:false,scope:"Ephemeral self-signed HTTPS, network-isolated Chromium only"},null,2)+"\n");
console.log("QUARANTINE_BROWSER_GATE=PASS PRODUCTION_ASSETS=UNTOUCHED PUBLIC_STAGING=NOT_TESTED");
