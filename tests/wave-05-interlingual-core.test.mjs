import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createHash } from "node:crypto";

const read = path => fs.readFileSync(new URL(path, import.meta.url));
const blob = path => {
  const bytes=read(path);
  return createHash("sha1").update("blob "+bytes.length+"\0").update(bytes).digest("hex");
};
const core=read("../assets/khaemenes-interlingual-core.js").toString("utf8");
const fixture=read("./fixtures/khaemenes-translator-loader.v1.1.js").toString("utf8");
const seedSource=read("../assets/khaemenes-campus-phrases.js").toString("utf8");

function loadCore({storageValue=null,seed=true,dictionary=null}={}) {
  const storageReads=[];
  const root={
    localStorage:{getItem(key){storageReads.push(key);return storageValue;}},
    KhaemenesSovereignDictionary:dictionary || {entries:[],creativeVocabulary:[]}
  };
  root.window=root;
  vm.runInNewContext(seedSource,root,{timeout:3000});
  if(!seed)delete root.KhaemenesSovereignSeeds;
  vm.runInNewContext(core,root,{timeout:3000});
  return {api:root.KhaemenesSovereignTranslate,root,storageReads};
}
const lib=(pairs)=>JSON.stringify({schema:"khaemenes-interlingual-library",version:2,pairs});

test("01 exact source blobs and unchanged gateway/previous public assets",()=>{
  assert.equal(blob("../assets/khaemenes-interlingual-core.js"),"13955ca419bcdb785ba1289137553f67306b0d77");
  assert.equal(blob("./fixtures/khaemenes-translator-loader.v1.1.js"),"1ebfa3c7e427cc416695cb45f935ba56a456c9b8");
  assert.equal(blob("../assets/khaemenes-campus-phrases.js"),"2a7c6c8030df3d62df7312cb9111acfe7a5534f6");
  assert.equal(blob("../assets/vervenveda-global-standard.css"),"0f2846e2de3a938c939e60ee6e8807726cf267db");
  assert.equal(blob("../assets/vnv-global-standard.css"),"4a1639543b3a96d9d756f88e13b8e7a26d8db0a2");
  assert.equal(blob("../index.html"),"a883f035329a89e55d526160c54ffdac3c7af2f9");
});

test("02 standalone core has no network, eval, storage writes or STOS endpoint",()=>{
  for(const [name,re] of [
    ["network",/\b(?:fetch\s*\(|WebSocket|XMLHttpRequest|sendBeacon\s*\()/],
    ["dynamic eval",/\beval\s*\(|new\s+Function\s*\(/],
    ["storage write",/\b(?:setItem|removeItem|clear)\s*\(/],
    ["STOS calls",/\/api\/stos\//]
  ])assert.equal(re.test(core),false,name);
});

test("03 source phrase seed is explicitly a draft, not a verified translation",()=>{
  const {api}=loadCore();
  assert.ok(Object.isFrozen(api));
  const translated=api.lookupLocal({from:"en",to:"es",text:"Explore"});
  assert.equal(translated.translation,"Explorar");
  assert.equal(translated.verified,false);
  assert.equal(translated.source,"sovereign-campus-draft");
  assert.equal(api.lookupLocal({from:"en",to:"en",text:"Explore"}).status,"identity");
  assert.equal(api.lookupLocal({from:"en",to:"fr",text:"DOES_NOT_EXIST_849"}),null);
});

test("04 load order matters: late seed is not automatically rebound",()=>{
  const {api,root}=loadCore({seed:false});
  assert.equal(api.lookupLocal({from:"en",to:"es",text:"Explore"}),null);
  vm.runInNewContext(seedSource,root,{timeout:3000});
  assert.equal(api.lookupLocal({from:"en",to:"es",text:"Explore"}),null);
});

test("05 malformed and unsupported browser libraries fail soft",()=>{
  const cases=[
    "{broken json",
    lib(null),
    JSON.stringify({schema:"unexpected",version:2,pairs:{}}),
    JSON.stringify({schema:"khaemenes-interlingual-library",version:3,pairs:{}}),
    JSON.stringify({schema:"khaemenes-interlingual-library",version:2,pairs:[]}),
    lib({"en→es":{"Explore":{verified:false,translation:"MALICIOUS"}}}),
    lib({"en→es":{"Explore":{verified:true,translation:123}}})
  ];
  for(const storageValue of cases){
    const result=loadCore({storageValue}).api.lookupLocal({from:"en",to:"es",text:"Explore"});
    assert.equal(result.translation,"Explorar");
    assert.equal(result.verified,false);
  }
});

test("06 local verified flags are not independent editorial authority (known HOLD)",()=>{
  const storageValue=lib({"en→es":{"Explore":{verified:true,translation:"MY PERSONAL PREFERENCE"}}});
  const {api,storageReads}=loadCore({storageValue});
  const result=api.lookupLocal({from:"en",to:"es",text:"Explore"});
  assert.equal(result.translation,"MY PERSONAL PREFERENCE");
  assert.equal(result.verified,true);
  assert.equal(result.source,"sovereign-local-reviewed");
  assert.ok(storageReads.includes("khaemenes_interlingual_library_v2"));
  // This test records existing behavior; it does NOT certify the flag as privileged review.
});

test("07 the core ignores unexpected non-English pivot requests",()=>{
  const {api}=loadCore();
  assert.equal(api.lookupLocal({from:"de",to:"fr",text:"Hallo"}),null);
  assert.equal(api.stats().network,"never");
});

function loadCanonicalLoader({unavailable=[],legacy=true}={}){
  const listeners=new Map(),requests=[],events=[];
  const root={
    KhaemenesSovereignTranslate:legacy?{lookupLocal(){return null;}}:undefined,
    KhaemenesSovereignSeeds:{phrases:{}},
    KhaemenesSovereignDictionary:{entries:[]},
    KhaemenesLexiconExpansion:{entries:[]},
    KhaemenesTransliteration:{},
    KhaemenesReviewPolicy:{},
    CustomEvent:class {constructor(type,opts){this.type=type;this.detail=opts.detail;}},
    dispatchEvent(event){events.push(event);}
  };
  root.window=root;
  const document={
    currentScript:{src:"https://example.test/assets/khaemenes-translator-loader.js"},
    createElement(name){
      assert.equal(name,"script");
      const handlers={};
      return {
        async:true,src:"",
        addEventListener(type,cb){handlers[type]=cb;},
        trigger(type){handlers[type]?.();}
      };
    },
    head:{appendChild(tag){
      const filename=new URL(tag.src).pathname.split("/").pop();
      requests.push(filename);
      queueMicrotask(()=>{
        if(unavailable.includes(filename)){tag.trigger("error");return;}
        if(filename==="khaemenes-interlingual-core.js"){
          root.KhaemenesSovereignTranslate={listLocalEntries(){return [];}};
        }
        tag.trigger("load");
      });
    }}
  };
  root.document=document;
  root.URL=URL;
  vm.runInNewContext(fixture,root,{timeout:3000});
  return {root,requests,events};
}

test("08 canonical loader upgrades legacy core only after dependencies succeed",async()=>{
  const {root,requests,events}=loadCanonicalLoader();
  const report=await root.KhaemenesTranslatorLoader.ensure({full:true,upgradeLegacyCore:true});
  assert.equal(report.canonicalCore,true);
  assert.ok(requests.includes("khaemenes-interlingual-core.js"));
  assert.equal(typeof root.KhaemenesSovereignTranslate.listLocalEntries,"function");
  assert.equal(events.at(-1)?.type,"khaemenes:translator-resources");
});

test("09 missing optional dictionary prevents canonical replacement, preserves fallback",async()=>{
  const {root,requests}=loadCanonicalLoader({unavailable:["sovereign-dictionary.generated.js"]});
  const old=root.KhaemenesSovereignTranslate;
  const report=await root.KhaemenesTranslatorLoader.ensure({full:true,upgradeLegacyCore:true});
  assert.equal(report.canonicalCore,false);
  assert.equal(root.KhaemenesSovereignTranslate,old);
  assert.equal(requests.includes("khaemenes-interlingual-core.js"),false);
  assert.ok(report.records.some(x=>x.state==="unavailable"));
  assert.ok(report.records.some(x=>x.key==="core"&&x.state==="skipped-incomplete-resources"));
});

test("10 repeated loader calls with an already upgraded core are idempotent",async()=>{
  const {root,requests}=loadCanonicalLoader();
  await root.KhaemenesTranslatorLoader.ensure({full:true,upgradeLegacyCore:true});
  const count=requests.length;
  const report=await root.KhaemenesTranslatorLoader.ensure({full:true,upgradeLegacyCore:true});
  assert.equal(report.canonicalCore,true);
  assert.equal(requests.length,count);
});
