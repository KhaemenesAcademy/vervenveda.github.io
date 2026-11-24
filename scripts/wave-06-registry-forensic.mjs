#!/usr/bin/env node
/**
 * Read-only registry forensic gate. Input: original VNV source checked out at
 * an immutable pinned commit. No remote calls, no gateway asset publication.
 * "PASS" means source integrity and basic structural consistency ONLY.
 */
import fs from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";

const original=process.env.VNV_SOURCE_DIR || "source-pinned";
const repoRoot=path.resolve(original);
const expected={
  "ecosystem/master-ecosystem-directory.json":"239d87575b9019741efb77eb44455e3494c2af2d",
  "registry/ecosystem-pages-a.json":"d1b976966ff2819c6d6307e719cbd8ae54c21156",
  "registry/ecosystem-pages-b.json":"0b9ef34f43c5909d4b90eee1b4d9674068d1a1d0"
};
const errors=[],warnings=[],hashes={};
function fail(message){errors.push(message)}
function blob(buffer){return createHash("sha1").update("blob "+buffer.length+"\0").update(buffer).digest("hex")}
function file(relative){
 const abs=path.resolve(repoRoot,relative);
 if(!abs.startsWith(repoRoot+path.sep))throw Error("Path escape denied");
 return fs.readFileSync(abs);
}
const raw={};
for(const [key,hash] of Object.entries(expected)){
 try {
  const bytes=file(key);const git=blob(bytes);
  hashes[key]={bytes:bytes.length,gitBlob:git,sha256:createHash("sha256").update(bytes).digest("hex"),matchesPinned:git===hash};
  if(git!==hash)fail("Pinned Git blob mismatch: "+key);
  raw[key]=JSON.parse(bytes.toString("utf8"));
 }catch(e){fail("Source file inaccessible or malformed: "+key+" "+e.message)}
}
const master=raw["ecosystem/master-ecosystem-directory.json"];
const listed=master?.pageCatalog?.parts;
const count=master?.pageCatalog?.publicPageCount;
const expectedPaths=["/registry/ecosystem-pages-a.json","/registry/ecosystem-pages-b.json"];
if(!Array.isArray(listed)||listed.length!==2||listed.some((x,i)=>x!==expectedPaths[i]))
 fail("Master catalog does not authorize the expected exact two shard paths");
if(!Number.isSafeInteger(count)||count<1)fail("Master publicPageCount must be a positive safe integer");
const summaries=[],unique=new Set(),duplicates=[],badDestinations=[],riskyIndicators=[];
let generation=null,total=0;
for(const item of expectedPaths){
 const payload=raw[item.slice(1)];
 if(!payload)continue;
 const pages=payload.pages;
 if(!Array.isArray(pages)){fail("Missing pages array in "+item);continue}
 const gen=String(payload.generatedAt||"");
 if(!gen)fail("Shard missing generation timestamp: "+item);
 if(generation===null)generation=gen;
 else if(generation!==gen)fail("Shard generation mismatch: "+item);
 for(const [i,page] of pages.entries()){
  if(!page||typeof page.title!=="string"||!page.title.trim()||typeof page.url!=="string"){
   if(badDestinations.length<20)badDestinations.push({part:item,index:i,reason:"missing title or URL"});
   continue;
  }
  try{
   const u=new URL(page.url);
   if(u.protocol!=="https:"||!u.hostname){
    if(badDestinations.length<20)badDestinations.push({part:item,index:i,reason:"non HTTPS"});
   }
   const key=page.url.replace(/\/+$/,"").toLowerCase();
   if(unique.has(key)){if(duplicates.length<20)duplicates.push({part:item,index:i,url:page.url.slice(0,200)})}
   else unique.add(key);
   const suspicious=/(?:^|\/)(?:admin|private|secrets?|vault|credentials?|\.git)(?:\/|$)/i.test(u.pathname);
   if(suspicious && riskyIndicators.length<30)riskyIndicators.push({part:item,index:i,issue:"sensitive-looking path; manual review",host:u.hostname,path:u.pathname.slice(0,180)});
  }catch{
   if(badDestinations.length<20)badDestinations.push({part:item,index:i,reason:"not a URL"});
  }
 }
 total+=pages.length;
 summaries.push({file:item,records:pages.length,generation:gen,firstPageFields:pages.length?Object.keys(pages[0]).sort():[]});
}
if(total!==count)fail("Catalog count differs from master: actual="+total+", expected="+count);
if(duplicates.length)fail("Duplicate page URLs detected (first 20 recorded)");
if(badDestinations.length)fail("Invalid page records detected (first 20 recorded)");
if(riskyIndicators.length)warnings.push("Sensitive-looking public paths need human review; no automatic publication authority");
if(master?.pageCatalog?.autoSync?.stos!=="dormant-excluded")warnings.push("Unexpected STOS autoSync policy metadata");
const report={
 schema:"vnv-wave-06-registry-source-forensic-v1",
 mode:"READ_ONLY_SOURCE_AUDIT",sourceRepository:"vervenveda/vervenveda.github.io",
 pinnedCommit:"836bdb78769f70b255e5c0bc7773b6f6de61a28d",
 expectedShards:expectedPaths,masterExpectedCount:count,
 manifestRepositoryCount:master?.pageCatalog?.repositoryCount??null,
 manifestGeneration:master?.pageCatalog?.autoSync?.generatedAt??null,
 shards:summaries,records:total,uniqueUrls:unique.size,
 duplicateSamples:duplicates,invalidSamples:badDestinations,
 sensitivePathReviewSamples:riskyIndicators,hashes,warnings,errors,
 sourceIntegrity:errors.length?"FAIL":"PASS",
 publicPublishAuthorized:false,cutoverReady:false,stosImportAuthorized:false,
 limitations:[
  "This verifies pinned public-source catalog only, not current remote destination availability or HTTP status",
  "No proof of access authorization for each public URL; manual security/privacy review required",
  "No actual copy of registry shards into simplified gateway, no native STOS access",
  "Human review is required before public asset promotion, domain cutover, or source privatization"
 ]
};
fs.writeFileSync("wave-06-registry-evidence.json",JSON.stringify(report,null,2)+"\n");
console.log("REGISTRY_EXPECTED="+count+" REGISTRY_FOUND="+total+" UNIQUE_URLS="+unique.size);
console.log("GENERATION="+(generation||"UNAVAILABLE"));
console.log("SENSITIVE_PATH_REVIEW="+riskyIndicators.length+" ERRORS="+errors.length);
console.log("SOURCE_INTEGRITY="+report.sourceIntegrity+" PUBLIC_PROMOTION=HOLD STOS_IMPORT=HOLD");
if(errors.length){for(const e of errors)console.error(e);process.exitCode=1;}
