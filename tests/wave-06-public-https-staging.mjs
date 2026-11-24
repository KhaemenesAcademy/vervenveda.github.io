#!/usr/bin/env node
/**
 * Wave 06 — independent staging origin audit only.
 * Requires operator-provided CA-trusted HTTPS origin and a separately deployed
 * quarantined bundle. Never uploads, writes remote state, or performs login.
 */
import fs from "node:fs";
import {createHash} from "node:crypto";
import assert from "node:assert/strict";
import {chromium,firefox,webkit} from "playwright";

const supplied=String(process.env.VNV_STAGING_URL||"").trim();
assert.ok(supplied,"VNV_STAGING_URL must be explicitly supplied");
const origin=new URL(supplied);
assert.equal(origin.protocol,"https:","HTTPS required");
assert.equal(origin.username,"","No credentials in staging URL");
assert.equal(origin.password,"","No credentials in staging URL");
assert.equal(origin.search,"","No query strings in staging origin");
assert.equal(origin.hash,"","No fragments in staging origin");
assert.ok(origin.pathname==="/"||origin.pathname==="","Staging must be mounted at origin root");
assert.equal(origin.port,"","Only standard CA-trusted HTTPS port permitted");
const host=origin.hostname.toLowerCase().replace(/\.$/,"");
assert.ok(host.includes("."),"Public DNS staging hostname required");
assert.ok(!/^(?:localhost|127\.|10\.|192\.168\.|0\.|169\.254\.)/.test(host),"Local address not independent staging");
assert.ok(!host.endsWith(".local")&&!host.endsWith(".internal"),"Nonpublic address rejected");
const disallowed=[
 "vervenveda.com","vervenveda.github.io","www.vervenveda.com",
 "khaemenesacademy.github.io","github.com","raw.githubusercontent.com"
];
assert.ok(!disallowed.some(x=>host===x||host.endsWith("."+x)),"Production/GitHub origin is not an independent staging destination");
assert.ok(/(?:^|[-.])(?:stage|staging|preview|sandbox|canary)(?:[-.]|$)/i.test(host),
 "Staging host must explicitly be identified as staging/preview/canary");
const base=origin.origin;
const report={
 schema:"vnv-wave-06-public-https-staging-audit-v1",
 host,sourceMode:"REMOTE_READ_ONLY",releaseApproved:false,productionChanged:false,
 status:"IN_PROGRESS",assets:[],browsers:[],violations:[],errors:[]
};
function digest(bytes){return createHash("sha256").update(bytes).digest("hex")}
async function get(path){
 const url=base+path;
 const res=await fetch(url,{redirect:"manual",signal:AbortSignal.timeout(15000),headers:{"Cache-Control":"no-cache"}});
 assert.equal(res.status,200,"Unexpected HTTP response "+res.status+" for "+path);
 assert.equal(res.url,url,"Redirect rejected for "+path);
 return {res,bytes:Buffer.from(await res.arrayBuffer())};
}
try {
 const {bytes:mb}=await get("/staging-bundle-manifest.json");
 const m=JSON.parse(mb.toString("utf8"));
 assert.equal(m.publicDeploymentAuthorized,false);
 assert.equal(m.restrictedPages,11021);
 assert.equal(m.files.length,21);
 assert.equal(m.originalIndexGitBlob,"a883f035329a89e55d526160c54ffdac3c7af2f9");
 assert.ok(m.files.every(e=>e.route.startsWith("/")&&!e.route.includes("..")));
 const fileMap=new Map(m.files.map(f=>[f.route,f]));
 assert.equal(fileMap.size,m.files.length);
 for(const entry of m.files){
   const {res,bytes}=await get(entry.route);
   const actual=digest(bytes);
   assert.equal(actual,entry.sha256,"Staging file differs from pinned candidate "+entry.route);
   if(entry.route.endsWith(".json"))assert.match(res.headers.get("content-type")||"",/application\/json/i);
   if(entry.route.endsWith(".js"))assert.match(res.headers.get("content-type")||"",/(?:javascript|ecmascript)/i);
   report.assets.push({path:entry.route,sha256:actual,bytes:bytes.length,ok:true});
 }
 assert.equal(digest((await get("/index.html")).bytes),m.stagingIndexSha256);
 const master=JSON.parse((await get("/ecosystem/master-ecosystem-directory.json")).bytes.toString("utf8"));
 assert.equal(master.pageCatalog.publicPageCount,11021);
 assert.equal(master.pageCatalog.parts.length,2);
 assert.ok(master.pageCatalog.parts.every(p=>p.startsWith("/registry/previews/2026-11-08-restricted/")));
 const members=[];
 for(const p of master.pageCatalog.parts){
   const shard=JSON.parse((await get(p)).bytes.toString("utf8"));
   members.push(shard);
 }
 assert.equal(members[0].generatedAt,members[1].generatedAt);
 const entries=[...members[0].pages,...members[1].pages];
 assert.equal(entries.length,11021);
 for(const item of entries){
  const p=String(item.path||"").toLowerCase().replace(/^\/+/, "");
  assert.ok(!p.includes("teacher-admin/index.html")&&!p.includes("courses/mathematics/evidence-vault/index.html"),
   "Held route must not appear in new directory index");
 }
 const variants=[["chromium",chromium],["firefox",firefox],["webkit",webkit]];
 for(const [name,engine] of variants){
  const browser=await engine.launch({headless:true});
  try{
   for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
    const context=await browser.newContext({viewport,serviceWorkers:"block"});
    const page=await context.newPage();
    const outbound=[],jsErrors=[];
    page.on("request",request=>{
      const u=new URL(request.url());
      if(u.origin!==base && ["script","fetch","xhr","websocket","eventsource","worker"].includes(request.resourceType()))
        outbound.push({type:request.resourceType(),origin:u.origin});
    });
    page.on("pageerror",e=>jsErrors.push(e.message.slice(0,240)));
    try{
     await page.goto(base+"/",{waitUntil:"domcontentloaded",timeout:30000});
     await page.waitForFunction(()=>document.querySelector("#ecosystemPageStatus")?.textContent.includes("11,021"),null,{timeout:30000});
     assert.equal(await page.locator("#vnvEcosystemUtilityDock").count(),1);
     assert.equal(await page.locator("#vnv-language-switch").count(),1);
     assert.equal(await page.locator("#vnvTickerAutoPopulate").count(),1);
     assert.equal(await page.locator("#networkTicker").count(),1);
     assert.equal(await page.locator("#menuOverlay").count(),1);
     assert.equal(await page.locator("#ecosystemPageRepo option").count(),36);
     await page.locator("#ecosystemPageSearch").fill("mathematics");
     assert.ok(await page.locator("#ecosystemPageResults a").count()>0);
     await page.locator("#ecosystemPageCategory").selectOption("education");
     assert.ok(await page.locator("#ecosystemPageResults a").count()>0);
     await page.locator("#ecosystemPageCategory").selectOption("");
     for(const held of ["teacher-admin/index.html","courses/mathematics/evidence-vault/index.html"]){
      await page.locator("#ecosystemPageSearch").fill(held);
      assert.equal(await page.locator("#ecosystemPageResults a").count(),0,"Held route visible in search");
     }
     // Scoped WCAG baseline: record failures without claiming full-site compliance.
     await page.addScriptTag({path:"node_modules/axe-core/axe.min.js"});
     const wcag=await page.evaluate(async()=>{
       const target=document.querySelector("#completePageIndex");
       if(!target)return [{id:"index-absent",nodes:1,impact:"critical"}];
       const findings=await window.axe.run(target,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa"]}});
       return findings.violations.map(v=>({id:v.id,nodes:v.nodes.length,impact:v.impact}));
     });
     report.violations.push({engine:name,viewport,findings:wcag});
     assert.deepEqual(outbound,[],"Unexpected production/external executable request");
     const unexpected=jsErrors.filter(e=>!(/service\s*worker/i.test(e)&&/sandboxed/i.test(e)));
     assert.deepEqual(unexpected,[],"Unexpected script exception on independent stage");
     report.browsers.push({engine:name,viewport,passed:true,externalExecutableRequests:0});
     console.log("REMOTE_HTTPS_BROWSER=PASS "+name+" "+viewport.width);
    }finally{await context.close();}
   }
  }finally{await browser.close();}
 }
 report.status="PASS_REMOTE_READ_ONLY";
 console.log("REMOTE_HTTPS_STAGE=PASS FILES="+report.assets.length+" ENGINES=3 VIEWPORTS=2 AUTH=HOLD");
} catch(error){
 report.status="FAIL";
 report.errors.push(String(error.stack||error));
 console.error("REMOTE_HTTPS_STAGE=FAIL "+error.message);
 process.exitCode=1;
}finally{
 fs.writeFileSync("wave-06-public-https-stage-report.json",JSON.stringify(report,null,2)+"\n");
}
