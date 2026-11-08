import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const read=p=>fs.readFileSync(new URL(p,import.meta.url),"utf8");
const core=read("../assets/khaemenes-interlingual-core.js");
const adapter=read("../assets/khaemenes-interlingual-trust-adapter.js");
const library=JSON.stringify({schema:"khaemenes-interlingual-library",version:2,pairs:{"en→es":{"Explore":{verified:true,translation:"MY PERSONAL COPY"}}}});
function fixture(){
  const reads=[];
  const writes=[];
  const root={
    localStorage:{
      getItem(k){reads.push(k);return library;},
      setItem(...args){writes.push(args);throw Error("must never write");}
    }
  };
  root.window=root;
  vm.runInNewContext(core,root,{timeout:2000});
  vm.runInNewContext(adapter,root,{timeout:2000});
  return {root,reads,writes};
}
test("01 preserve old local review in legacy API, but never grant editorial/STOS authority through adapter",()=>{
  const {root,reads,writes}=fixture();
  const old=root.KhaemenesSovereignTranslate.lookupLocal({from:"en",to:"es",text:"Explore"});
  assert.equal(old.verified,true);
  assert.equal(old.translation,"MY PERSONAL COPY");
  const normalized=root.KhaemenesInterlingualTrust.lookup({from:"en",to:"es",text:"Explore"});
  assert.equal(normalized.translation,"MY PERSONAL COPY");
  assert.equal(normalized.locallyReviewed,true);
  assert.equal(normalized.reviewScope,"origin-local-user-review");
  assert.equal(normalized.verified,false);
  assert.equal(normalized.publisherReviewed,false);
  assert.equal(normalized.sovereignApproved,false);
  assert.equal(normalized.authoritative,false);
  assert.ok(Object.isFrozen(normalized));
  assert.ok(reads.includes("khaemenes_interlingual_library_v2"));
  assert.equal(writes.length,0);
});
test("02 missing or untrusted result cannot manufacture a trusted authority",()=>{
  const {root}=fixture(), api=root.KhaemenesInterlingualTrust;
  assert.equal(api.interpret(null),null);
  assert.equal(api.interpret({translation:123,verified:true}),null);
  const result=api.interpret({translation:"X",verified:true,source:"publisher-reviewed",status:"verified"});
  assert.equal(result.verified,false);
  assert.equal(result.authoritative,false);
  assert.equal(result.publisherReviewed,false);
  assert.equal(result.reviewScope,"unverified-source");
});
test("03 identity and draft have explicitly non-authoritative output labels",()=>{
  const {root}=fixture(), api=root.KhaemenesInterlingualTrust;
  const identity=api.lookup({from:"en",to:"en",text:"Hello"});
  assert.equal(identity.reviewScope,"same-language-identity");
  assert.equal(identity.verified,false);
  assert.equal(api.lookup({from:"en",to:"es",text:"unknown_phrase_247"}),null);
});
test("04 adapter stays independent of browser storage and network",()=>{
  assert.doesNotMatch(adapter,/\b(?:localStorage|sessionStorage|indexedDB|fetch\s*\(|XMLHttpRequest|WebSocket)\b/);
  assert.doesNotMatch(adapter,/\b(?:eval\s*\(|new\s+Function\s*\()\b/);
  assert.equal(fixture().root.KhaemenesInterlingualTrust.sovereignAuthority,false);
});
