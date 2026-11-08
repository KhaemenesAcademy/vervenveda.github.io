#!/usr/bin/env node
/**
 * VNV Wave 06: stage an immutable, complete TWO-SHARD public catalog candidate
 * in the Actions runner ONLY. No writes to GitHub branches, STOS, DNS, Pages.
 * Audit/manifest is returned as evidence; the candidate is still unapproved.
 */
import fs from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";
import assert from "node:assert/strict";

const source=path.resolve(process.env.VNV_SOURCE_DIR||"source-pinned");
const out=path.resolve(process.env.VNV_CANDIDATE_DIR||"wave-06-candidate");
const generation="2026-11-08T17-21-17Z";
const root="registry/releases/"+generation;
const files=[
 ["ecosystem/master-ecosystem-directory.json","239d87575b9019741efb77eb44455e3494c2af2d","b12abe09f18e8648a5a106d3c2c910909b3d09bf5b2569a2cb0fc7c4c3fa0956"],
 ["registry/ecosystem-pages-a.json","d1b976966ff2819c6d6307e719cbd8ae54c21156","27fc73d7980eecd849ccefe32bd36c5b93b207a10fbaf0d19c2da641cfe70d5e"],
 ["registry/ecosystem-pages-b.json","0b9ef34f43c5909d4b90eee1b4d9674068d1a1d0","9a0783c039b7b5267e3c34c5d1353263e96ab5b852d83dec36f7bea0cfdbd422"]
];
const hex=b=>createHash("sha256").update(b).digest("hex");
const blob=b=>createHash("sha1").update("blob "+b.length+"\0").update(b).digest("hex");
const loaded={};
for(const [name,sha,sha256] of files){
 const bytes=fs.readFileSync(path.join(source,name));
 assert.equal(blob(bytes),sha,"Pinned Git blob mismatch "+name);
 assert.equal(hex(bytes),sha256,"Pinned SHA256 mismatch "+name);
 loaded[name]=JSON.parse(bytes.toString("utf8"));
 const to=path.join(out,root,name);
 fs.mkdirSync(path.dirname(to),{recursive:true});
 fs.copyFileSync(path.join(source,name),to);
 assert.equal(hex(fs.readFileSync(to)),sha256,"Staged candidate differs "+name);
}
const master=loaded[files[0][0]];
const paths=master.pageCatalog.parts;
assert.deepEqual(paths,["/registry/ecosystem-pages-a.json","/registry/ecosystem-pages-b.json"]);
assert.equal(master.pageCatalog.publicPageCount,11024);
assert.equal(master.pageCatalog.repositoryCount,35);
assert.equal(master.pageCatalog.autoSync.stos,"dormant-excluded");
const pages=[];
for(const route of paths){
 const content=loaded[route.slice(1)];
 assert.equal(content.generatedAt,"2026-11-08T17:21:17Z");
 assert.equal(content.pages.length,5512);
 pages.push(...content.pages);
}
assert.equal(pages.length,master.pageCatalog.publicPageCount);
const seen=new Set(),repoCounts={},hostCounts={},flags=[];
const forbidden=/(\b|[._/-])(private|internal|secret|credential|vault|password|token|admin|staging|debug)(\b|[._/-])/i;
for(const [index,p] of pages.entries()){
 assert.ok(p&&typeof p.title==="string"&&p.title.trim(),"Empty title "+index);
 assert.ok(typeof p.url==="string"&&p.url.length,"Empty URL "+index);
 assert.ok(typeof p.repo==="string"&&p.repo.length,"Empty repo "+index);
 const url=new URL(p.url);
 assert.equal(url.protocol,"https:","Unencrypted URL "+index);
 const normal=p.url.replace(/\/+$/,"").toLowerCase();
 assert.ok(!seen.has(normal),"Duplicate URL "+index);
 seen.add(normal);
 repoCounts[p.repo]=(repoCounts[p.repo]||0)+1;
 hostCounts[url.hostname]=(hostCounts[url.hostname]||0)+1;
 if(forbidden.test(url.pathname)||forbidden.test(p.path||"")||forbidden.test(p.title||"")){
   if(flags.length<60)flags.push({index,repo:p.repo,path:String(p.path||"").slice(0,170),reason:"restricted-looking name; manual review"});
 }
}
const expectedRepoCount=new Set(pages.map(p=>p.repo)).size;
const unmatchedRepoMetadata=expectedRepoCount!==master.pageCatalog.repositoryCount;
const manifest={
 schema:"vnv-registry-candidate-v1",
 status:"STAGED_NOT_APPROVED",sourceRepository:"vervenveda/vervenveda.github.io",
 sourceCommit:"836bdb78769f70b255e5c0bc7773b6f6de61a28d",
 releaseId:generation,basePath:root,
 generation:"2026-11-08T17:21:17Z",
 masterExpectedPublicPageCount:11024,actualPages:pages.length,uniqueUrls:seen.size,
 masterRepositoryCount:35,observedRepositoryCount:expectedRepoCount,
 repositoryCountMatches:!unmatchedRepoMetadata,
 files:files.map(([name,gitBlob,sha256])=>({
  path:root+"/"+name,bytes:fs.statSync(path.join(out,root,name)).size,gitBlob,sha256
 })),
 privacyScreen:{
  scope:"public URL/title/path heuristics only, NOT inspection of destination contents",
  flaggedSampleCount:flags.length,flaggedSamples:flags,
  manualReviewRequired:true,approved:false
 },
 integrity:"PASS",atomicPromotion:"NOT_PERFORMED",publicPathActive:false,
 publicPublicationApproved:false,stosImportApproved:false,cutoverReady:false,
 previousLiveFallback:"https://vervenveda.com/",
 rollbackRule:"Do not update active directory manifest/pointer until complete immutable pair and read-only browser tests pass"
};
fs.writeFileSync(path.join(out,"candidate-manifest.json"),JSON.stringify(manifest,null,2)+"\n");
fs.writeFileSync("wave-06-candidate-report.json",JSON.stringify({
  ...manifest,files:manifest.files,topRepositoryCounts:Object.entries(repoCounts).sort((a,b)=>b[1]-a[1]).slice(0,15),
  hostCounts,manifestCandidateFilesPresent:true,
  unverified:["Current live HTTPS/HTTP response for each destination","Admin/student data inside linked pages","Cross-device and STOS ingestion","Browser end-to-end directory interactions"]
},null,2)+"\n");
console.log("CANDIDATE_COMPLETE=PASS PAGES="+pages.length+" REPOS_ACTUAL="+expectedRepoCount+" MASTER_REPOS=35");
console.log("PRIVACY_NAME_FLAGS="+flags.length+" PUBLICATION_APPROVED=NO");
console.log("VERSIONED_CANDIDATE="+root+" STOS_WRITE=NONE");
