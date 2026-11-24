import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const refs={
  "/assets/khaemenes-campus-phrases.js":"assets/khaemenes-campus-phrases.js",
  "/assets/legacy-core.js":"assets/khaemenes-interlingual-core.js",
  "/assets/trust-adapter.js":"assets/khaemenes-interlingual-trust-adapter.js",
  "/assets/vnv-language.js":"tests/fixtures/vnv-language.source-snapshot.js",
  "/assets/khaemenes-translator-loader.js":"tests/fixtures/khaemenes-translator-loader.v1.1.js",
  "/assets/khaemenes-interlingual-core.js":"tests/fixtures/khaemenes-interlingual-core.canonical-snapshot.js"
};
const expected={
  "index.html":"a883f035329a89e55d526160c54ffdac3c7af2f9",
  "assets/khaemenes-campus-phrases.js":"2a7c6c8030df3d62df7312cb9111acfe7a5534f6",
  "assets/khaemenes-interlingual-core.js":"13955ca419bcdb785ba1289137553f67306b0d77",
  "tests/fixtures/khaemenes-translator-loader.v1.1.js":"1ebfa3c7e427cc416695cb45f935ba56a456c9b8",
  "tests/fixtures/khaemenes-interlingual-core.canonical-snapshot.js":"0a5fd50a332e750c8361bbb6578d2193d26aa5a3",
  "tests/fixtures/vnv-language.source-snapshot.js":"b65ef766cfbd0adcd88b4e7cc970a1e3ee35bd7c"
};
for(const [path,sha] of Object.entries(expected)){
  const content=readFileSync(resolve(root,path));
  assert.equal(createHash("sha1").update("blob "+content.length+"\0").update(content).digest("hex"),sha,
    "Pinned source mismatch: "+path);
}

const html=['<!doctype html><html lang="en"><head><meta charset="utf-8"><title>VNV test gateway</title></head>',
'<body><header class="site-header"><div class="header-inner">VNV test header</div></header>',
'<div id="menuDrawer"></div><div id="vnv-language-rail" role="group"></div>',
'<main id="main"><h1>Explore</h1><p id="translation-target">Explore</p>',
'<p id="long-text" data-i18n-ignore>Do not translate private content in smoke test.</p></main></body></html>'].join("");
const staticMocks={
  "sovereign-dictionary.generated.js":"window.KhaemenesSovereignDictionary={entries:[],creativeVocabulary:[]};",
  "khaemenes-lexicon-expansion.js":"window.KhaemenesLexiconExpansion={entries:[]};",
  "khaemenes-transliteration.js":"window.KhaemenesTransliteration={};",
  "khaemenes-review-policy.js":"window.KhaemenesReviewPolicy={};"
};
const server=createServer((req,res)=>{
  const url=new URL(req.url,"http://localhost");
  if(url.pathname==="/"){res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});res.end(html);return;}
  let js;
  if(url.pathname.startsWith("/assets/")){
    const name=url.pathname.slice("/assets/".length);
    js=staticMocks[name];
    const path=refs[url.pathname];
    if(!js&&path)js=readFileSync(resolve(root,path),"utf8");
  }
  if(js!==undefined){res.writeHead(200,{"Content-Type":"text/javascript; charset=utf-8","Cache-Control":"no-store"});res.end(js);return;}
  res.writeHead(404);res.end("not found");
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const base="http://127.0.0.1:"+server.address().port;
const browser=await chromium.launch({headless:true});
let completed=0;
async function scenario(name,fn){
  const context=await browser.newContext({serviceWorkers:"block"});
  const page=await context.newPage();
  const errors=[];
  const remote=[];
  page.on("pageerror",err=>errors.push(err.message));
  page.on("request",req=>{if(!req.url().startsWith(base))remote.push(req.url());});
  try {
    await page.goto(base,{waitUntil:"domcontentloaded"});
    await fn(page);
    assert.deepEqual(errors,[],"Browser exceptions in "+name);
    assert.deepEqual(remote,[],"Unexpected network requests in "+name);
    console.log("PASS browser: "+name);
    completed++;
  }finally{await context.close();}
}
const add=async(page,path)=>page.addScriptTag({url:base+"/assets/"+path});
try {
  await scenario("public seed, legacy core, origin-local trust and 13-language rail",async page=>{
    await add(page,"khaemenes-campus-phrases.js");
    await add(page,"legacy-core.js");
    await add(page,"trust-adapter.js");
    await add(page,"vnv-language.js");
    assert.equal(await page.evaluate(()=>window.KhaemenesSovereignTranslate.lookupLocal({from:"en",to:"es",text:"Explore"}).verified),false);
    assert.equal(await page.evaluate(()=>window.KhaemenesInterlingualTrust.lookup({from:"en",to:"es",text:"Explore"}).sovereignApproved),false);
    assert.equal(await page.evaluate(()=>window.VNVLanguage.availableLanguages().length),13);
    await page.evaluate(()=>window.VNVLanguage.setLanguage("es",false));
    await page.waitForFunction(()=>document.querySelector("#translation-target")?.textContent==="Explorar");
    assert.equal(await page.locator("#vnv-language-switch").count(),1);
    assert.equal(await page.locator("#vnv-language-rail #vnv-language-switch").count(),1);
    await page.evaluate(()=>window.VNVLanguage.refresh());
    assert.equal(await page.locator("#vnv-language-switch").count(),1);
  });

  await scenario("local reviewed phrase remains a preference rather than STOS authority",async page=>{
    await page.evaluate(()=>{
      localStorage.setItem("khaemenes_interlingual_library_v2",JSON.stringify({
        schema:"khaemenes-interlingual-library",version:2,
        pairs:{"en→es":{"Explore":{verified:true,translation:"MY USER PREFERENCE"}}}
      }));
    });
    await add(page,"khaemenes-campus-phrases.js");
    await add(page,"legacy-core.js");
    await add(page,"trust-adapter.js");
    const data=await page.evaluate(()=>{
      const raw=window.KhaemenesSovereignTranslate.lookupLocal({from:"en",to:"es",text:"Explore"});
      const safe=window.KhaemenesInterlingualTrust.lookup({from:"en",to:"es",text:"Explore"});
      return {rawVerified:raw.verified,translation:safe.translation,local:safe.locallyReviewed,authority:safe.sovereignApproved,editorial:safe.publisherReviewed};
    });
    assert.deepEqual(data,{rawVerified:true,translation:"MY USER PREFERENCE",local:true,authority:false,editorial:false});
    assert.match(await page.evaluate(()=>localStorage.getItem("khaemenes_interlingual_library_v2")),/MY USER PREFERENCE/);
  });

  await scenario("canonical loader upgrades legacy core after all dependencies load",async page=>{
    await add(page,"khaemenes-campus-phrases.js");
    await add(page,"legacy-core.js");
    await add(page,"khaemenes-translator-loader.js");
    const result=await page.evaluate(async()=>{
      const before=window.KhaemenesSovereignTranslate;
      const report=await window.KhaemenesTranslatorLoader.ensure({full:true,upgradeLegacyCore:true});
      const after=window.KhaemenesSovereignTranslate;
      const again=await window.KhaemenesTranslatorLoader.ensure({full:true,upgradeLegacyCore:true});
      return {beforeDifferent:before!==after,canonical:report.canonicalCore,
        repeated:again.canonicalCore,capability:typeof after.listLocalEntries,
        unavailable:report.records.filter(x=>x.state==="unavailable").length};
    });
    assert.deepEqual(result,{beforeDifferent:true,canonical:true,repeated:true,capability:"function",unavailable:0});
  });

  await scenario("missing dictionary holds canonical upgrade and preserves legacy fallback",async page=>{
    await page.route("**/assets/sovereign-dictionary.generated.js",route=>route.abort());
    await add(page,"khaemenes-campus-phrases.js");
    await add(page,"legacy-core.js");
    await add(page,"khaemenes-translator-loader.js");
    const result=await page.evaluate(async()=>{
      const before=window.KhaemenesSovereignTranslate;
      const report=await window.KhaemenesTranslatorLoader.ensure({full:true,upgradeLegacyCore:true});
      return {same:before===window.KhaemenesSovereignTranslate,canonical:report.canonicalCore,
        skipped:report.records.some(x=>x.key==="core"&&x.state==="skipped-incomplete-resources"),
        unavailable:report.records.some(x=>x.state==="unavailable")};
    });
    assert.deepEqual(result,{same:true,canonical:false,skipped:true,unavailable:true});
  });
  console.log("BROWSER_SCENARIOS_PASSED="+completed);
  console.log("STOS_WRITE=NONE; LIVE_SITE=UNCHANGED; HOMEPAGE_SCRIPT_ACTIVATION=HOLD");
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
