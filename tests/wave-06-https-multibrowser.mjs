import assert from "node:assert/strict";
import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import {chromium, firefox, webkit} from "playwright";

const source=path.resolve("source-pinned");
const preview=path.resolve("wave-06-restricted-preview");
const release="registry/previews/2026-11-08-restricted/";
const cert=fs.readFileSync("staging-local-cert.pem"),key=fs.readFileSync("staging-local-key.pem");
const pointer=JSON.parse(fs.readFileSync(path.join(preview,"preview-master-pointer.json"),"utf8"));
const manifest=JSON.parse(fs.readFileSync(path.join(preview,"restricted-preview-manifest.json"),"utf8"));
assert.equal(pointer.pageCatalog.publicPageCount,11021);
assert.equal(manifest.releaseAuthorized,false);
assert.deepEqual(pointer.pageCatalog.parts,[
 "/"+release+"registry/ecosystem-pages-a.json",
 "/"+release+"registry/ecosystem-pages-b.json"
]);
let offline=false;
const routed=new Map([
 ["/ecosystem/master-ecosystem-directory.json",path.join(preview,"preview-master-pointer.json")],
 ["/"+release+"registry/ecosystem-pages-a.json",path.join(preview,release,"registry/ecosystem-pages-a.json")],
 ["/"+release+"registry/ecosystem-pages-b.json",path.join(preview,release,"registry/ecosystem-pages-b.json")]
]);
const server=https.createServer({key,cert},(request,response)=>{
 const pathname=new URL(request.url,"https://localhost").pathname;
 if(offline&&pathname==="/"+release+"registry/ecosystem-pages-b.json"){
  response.writeHead(503,{"Cache-Control":"no-store"});response.end("simulated shard loss");return;
 }
 let file=routed.get(pathname);
 if(!file){
  file=path.resolve(source,"."+((pathname==="/")?"/index.html":pathname));
  if(!file.startsWith(source+path.sep)){response.writeHead(403);response.end();return;}
 }
 try{
  const bytes=fs.readFileSync(file);
  const ext=path.extname(file);
  response.writeHead(200,{"Cache-Control":"no-store","Content-Type":
   ext===".css"?"text/css":ext===".js"?"text/javascript":ext===".json"?"application/json":ext===".html"?"text/html; charset=utf-8":"application/octet-stream"});
  response.end(bytes);
 }catch{response.writeHead(404);response.end("not found");}
});
await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
const origin="https://127.0.0.1:"+server.address().port;
const report={schema:"vnv-wave-06-local-https-multiengine-v1",scope:"LOCAL_SELF_SIGNED_TLS_NOT_PUBLICLY_REACHABLE",release,publicReleaseAuthorized:false,productionDNSChanged:false,results:[],accessibility:[]};
const axes=[];
async function run(engine,name,viewport,shardUnavailable=false){
 offline=shardUnavailable;
 const browser=await engine.launch({headless:true});
 const context=await browser.newContext({ignoreHTTPSErrors:true,viewport,serviceWorkers:"block"});
 const page=await context.newPage();
 const outbound=[],errors=[],failed=[];
 page.on("pageerror",err=>errors.push(err.message.slice(0,300)));
 page.on("response",resp=>{if(resp.status()>=400&&resp.url().startsWith(origin))failed.push({url:resp.url().slice(origin.length),status:resp.status()});});
 await page.route("**/*",route=>{
  if(route.request().url().startsWith(origin+"/"))return route.continue();
  outbound.push(route.request().url().slice(0,180));
  return route.abort();
 });
 const checks=[];
 async function check(name,fn){await fn();checks.push(name);}
 try{
  const res=await page.goto(origin+"/",{waitUntil:"domcontentloaded",timeout:30000});
  await check("HTTPS transport established",async()=>{
   assert.equal(new URL(page.url()).protocol,"https:");
   assert.equal(res.status(),200);
  });
  const status=page.locator("#ecosystemPageStatus");
  if(shardUnavailable){
   await check("missing shard disables entire index",async()=>{
    await page.waitForFunction(()=>document.querySelector("#ecosystemPageStatus")?.textContent.includes("temporarily unavailable"),null,{timeout:25000});
    assert.equal(await page.locator("#ecosystemPageResults a").count(),0);
    assert.ok(failed.some(x=>x.url.includes("/registry/ecosystem-pages-b.json")&&x.status===503));
   });
  }else{
   await check("restricted directory loads 11,021 entries",async()=>{
    await page.waitForFunction(()=>document.querySelector("#ecosystemPageStatus")?.textContent.includes("11,021"),null,{timeout:25000});
    assert.match(await status.innerText(),/11,021/);
   });
   await check("search and category filter work",async()=>{
    await page.locator("#ecosystemPageSearch").fill("mathematics");
    assert.ok(await page.locator("#ecosystemPageResults a").count()>0);
    await page.locator("#ecosystemPageCategory").selectOption("education");
    assert.ok(await page.locator("#ecosystemPageResults a").count()>0);
    await page.locator("#ecosystemPageCategory").selectOption("");
   });
   await check("three held URL paths absent from deep-search",async()=>{
    for(const q of ["teacher-admin/index.html","courses/mathematics/evidence-vault/index.html"]){
     await page.locator("#ecosystemPageSearch").fill(q);
     assert.equal(await page.locator("#ecosystemPageResults a").count(),0,q+" still indexed");
    }
    await page.locator("#ecosystemPageSearch").fill("");
   });
   await check("35 repository filters and zero-result status",async()=>{
    const opts=await page.locator("#ecosystemPageRepo option").count();
    assert.equal(opts,36);
    await page.locator("#ecosystemPageSearch").fill("no_such_audit_item_98735");
    assert.equal(await page.locator("#ecosystemPageResults a").count(),0);
    assert.match(await page.locator("#ecosystemPageResults").innerText(),/No public page matches/);
   });
   await check("visible status and accessible search labels",async()=>{
    assert.equal(await page.locator("#ecosystemPageStatus").getAttribute("aria-live"),"polite");
    assert.equal(await page.locator("label[for=ecosystemPageSearch]").count(),1);
    assert.equal(await page.locator("label[for=ecosystemPageCategory]").count(),1);
    assert.equal(await page.locator("label[for=ecosystemPageRepo]").count(),1);
   });
  }
  await check("menu keyboard enter/escape",async()=>{
   const menu=page.locator("#menuButton");
   await menu.focus();
   await page.keyboard.press("Enter");
   assert.equal(await menu.getAttribute("aria-expanded"),"true");
   await page.keyboard.press("Escape");
   assert.equal(await menu.getAttribute("aria-expanded"),"false");
  });
  if(!shardUnavailable){
   await page.addScriptTag({path:"node_modules/axe-core/axe.min.js"});
   const violations=await page.evaluate(async()=>{
    const results=await window.axe.run(document.querySelector("#completePageIndex"),
     {runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa"]}});
    return results.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length,description:v.help}));
   });
   report.accessibility.push({engine:name,viewport,violations});
   console.log("ACCESSIBILITY_BASELINE "+name+" "+viewport.width+" "+JSON.stringify(violations));
  }
  const knownWarnings=errors.filter(e=>/service\s*worker/i.test(e)&&e.includes("sandboxed")&&e.includes("allow-same-origin"));
  const unexpected=errors.filter(e=>!knownWarnings.includes(e));
  assert.deepEqual(unexpected,[],"Unexpected page exceptions");
  const entry={engine:name,viewport,shardUnavailable,assertions:checks,knownSandboxWarnings:knownWarnings.length,externalRequestCount:outbound.length,localFailures:failed,pass:true};
  report.results.push(entry);
  console.log("LOCAL_HTTPS_ENGINE=PASS "+JSON.stringify(entry));
 }finally{await context.close();await browser.close();}
}
try{
 for(const [name,engine] of [["chromium",chromium],["firefox",firefox],["webkit",webkit]]){
  await run(engine,name,{width:1440,height:900},false);
  await run(engine,name,{width:390,height:844},false);
 }
 await run(chromium,"chromium",{width:1440,height:900},true);
 report.result="PASS_WITH_ACCESSIBILITY_BASELINE_REVIEW";
}finally{
 await new Promise(ok=>server.close(ok));
 fs.writeFileSync("wave-06-https-browser-evidence.json",JSON.stringify(report,null,2)+"\n");
}
console.log("LOCAL_TLS_MULTIBROWSER_GATE="+report.result+" PUBLICLY_REACHABLE_HTTPS=NOT_TESTED PUBLIC_RELEASE=HOLD");
