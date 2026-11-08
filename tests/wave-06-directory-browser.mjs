import assert from "node:assert/strict";
import fs from "node:fs";
import { createServer } from "node:http";
import { resolve, join, extname } from "node:path";
import { chromium } from "playwright";

const source=resolve("source-pinned");
const candidate=resolve("wave-06-candidate");
const release="registry/releases/2026-11-08T17-21-17Z/";
const routes=new Map([
 ["/ecosystem/master-ecosystem-directory.json",join(candidate,release,"ecosystem/master-ecosystem-directory.json")],
 ["/registry/ecosystem-pages-a.json",join(candidate,release,"registry/ecosystem-pages-a.json")],
 ["/registry/ecosystem-pages-b.json",join(candidate,release,"registry/ecosystem-pages-b.json")]
]);
const contentType=(p)=>({".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".css":"text/css; charset=utf-8",".png":"image/png",".svg":"image/svg+xml",".webmanifest":"application/manifest+json"})[extname(p)]||"application/octet-stream";
let unavailableShard=false;
const served=new Set();
const server=createServer((req,res)=>{
  const pathname=new URL(req.url,"http://localhost").pathname;
  if(unavailableShard&&pathname==="/registry/ecosystem-pages-b.json"){res.writeHead(503);res.end("simulated shard outage");return;}
  let file=routes.get(pathname);
  if(!file){
    const relative=pathname==="/index.html"||pathname==="/"?"/index.html":pathname;
    file=resolve(source,"."+relative);
    if(!file.startsWith(source+"/")){res.writeHead(403);res.end();return;}
  }
  try{
    const data=fs.readFileSync(file);
    served.add(pathname);
    res.writeHead(200,{"Content-Type":contentType(file),"Cache-Control":"no-store"});
    res.end(data);
  }catch{res.writeHead(404);res.end("not found");}
});
await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
const base="http://127.0.0.1:"+server.address().port;
const browser=await chromium.launch({headless:true});
const report={schema:"vnv-wave-06-directory-browser-v1",sourceCommit:"836bdb78769f70b255e5c0bc7773b6f6de61a28d",candidateRelease:release,scenarios:[],publicPromotionAuthorized:false};
async function scenario(name,viewport,shardOutage=false){
  unavailableShard=shardOutage;
  served.clear();
  const context=await browser.newContext({viewport,serviceWorkers:"block"});
  const page=await context.newPage();
  const errors=[],external=[],httpFailures=[];
  page.on("pageerror",e=>errors.push(e.message.slice(0,260)));
  page.on("response",res=>{if(res.status()>=400&&res.url().startsWith(base))httpFailures.push({path:res.url().slice(base.length),status:res.status()});});
  await page.route("**/*",route=>{
    if(route.request().url().startsWith(base+"/"))return route.continue();
    external.push(new URL(route.request().url()).hostname);
    return route.abort();
  });
  const result={name,viewport,shardOutage,assertions:[]};
  async function check(label,fn){await fn();result.assertions.push(label);}
  try{
    await page.goto(base+"/",{waitUntil:"domcontentloaded",timeout:30000});
    await check("canonical master and two shard HTTP requests",async()=>{
      await page.waitForTimeout(900);
      assert.ok(served.has("/ecosystem/master-ecosystem-directory.json"));
      assert.ok(served.has("/registry/ecosystem-pages-a.json"));
      if(!shardOutage)assert.ok(served.has("/registry/ecosystem-pages-b.json"));
    });
    const status=page.locator("#ecosystemPageStatus");
    if(!shardOutage){
      await check("11,024 index entries loaded",async()=>{
        await page.waitForFunction(()=>document.querySelector("#ecosystemPageStatus")?.textContent.includes("11,024"),{timeout:20000});
        assert.match(await status.innerText(),/11,024/);
      });
      await check("search finds mathematics catalog entries",async()=>{
        await page.locator("#ecosystemPageSearch").fill("mathematics");
        await page.waitForTimeout(130);
        assert.match(await status.innerText(),/11,024/);
        assert.ok(await page.locator("#ecosystemPageResults a").count()>0);
      });
      await check("repository filter limits result set",async()=>{
        const options=await page.locator("#ecosystemPageRepo option").evaluateAll(nodes=>nodes.map(x=>x.value).filter(Boolean));
        assert.equal(options.length,35);
        await page.locator("#ecosystemPageSearch").fill("");
        await page.locator("#ecosystemPageRepo").selectOption(options[0]);
        await page.waitForTimeout(130);
        assert.ok(await page.locator("#ecosystemPageResults a").count()>0);
      });
      await check("unmatched query shows a graceful empty state",async()=>{
        await page.locator("#ecosystemPageRepo").selectOption("");
        await page.locator("#ecosystemPageSearch").fill("vnv_no_such_result_280926");
        await page.waitForTimeout(130);
        assert.equal(await page.locator("#ecosystemPageResults a").count(),0);
        assert.match(await page.locator("#ecosystemPageResults").innerText(),/No public page matches/);
      });
    }else{
      await check("missing shard shows unavailable text and no partial catalog",async()=>{
        await page.waitForFunction(()=>document.querySelector("#ecosystemPageStatus")?.textContent.includes("temporarily unavailable"),{timeout:20000});
        assert.match(await status.innerText(),/temporarily unavailable/);
        assert.equal(await page.locator("#ecosystemPageResults a").count(),0);
        assert.ok(httpFailures.some(x=>x.path.startsWith("/registry/ecosystem-pages-b.json")&&x.status===503));
      });
    }
    await check("hamburger opens and closes with keyboard",async()=>{
      const trigger=page.locator("#menuButton");
      await trigger.focus();
      await page.keyboard.press("Enter");
      assert.equal(await trigger.getAttribute("aria-expanded"),"true");
      await page.keyboard.press("Escape");
      assert.equal(await trigger.getAttribute("aria-expanded"),"false");
    });
    result.status=await status.innerText();
    result.errors=errors;
    result.httpFailures=httpFailures.filter(x=>x.path.startsWith("/ecosystem/")||x.path.startsWith("/registry/"));
    result.externalHosts=[...new Set(external)].slice(0,20);
    assert.equal(result.assertions.length,shardOutage?3:6);
    console.log("DIRECTORY_BROWSER_SCENARIO=PASS "+JSON.stringify(result));
    report.scenarios.push(result);
  }finally{await context.close();}
}
try{
 await scenario("desktop-full-catalog",{width:1440,height:900});
 await scenario("mobile-full-catalog",{width:390,height:844});
 await scenario("desktop-missing-shard-fail-closed",{width:1440,height:900},true);
 report.acceptance="PASS_WITH_DOCUMENTED_LIMITATIONS";
}finally{
 await browser.close();
 await new Promise(ok=>server.close(ok));
 fs.writeFileSync("wave-06-browser-report.json",JSON.stringify(report,null,2)+"\n");
}
console.log("DIRECTORY_BROWSER_GATE="+report.acceptance+" ACTIVE_POINTER=UNCHANGED PUBLIC_RELEASE=HOLD");
