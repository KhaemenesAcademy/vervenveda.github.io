#!/usr/bin/env node
/* Wave 06 candidate-only acceptance. Never touches live site or authorizes publishing. */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";

const basedir=path.resolve("wave-06-candidate");
const m=JSON.parse(fs.readFileSync(path.join(basedir,"candidate-manifest.json"),"utf8"));
const load=relative=>fs.readFileSync(path.join(basedir,relative));
function openCandidate(entryOverrides={}){
 const files=m.files.map(f=>{
   const raw=entryOverrides[f.path]??load(f.path);
   if(!Buffer.isBuffer(raw))throw Error("Missing candidate blob: "+f.path);
   const sha=createHash("sha256").update(raw).digest("hex");
   if(sha!==f.sha256)throw Error("Hash mismatch: "+f.path);
   return JSON.parse(raw.toString("utf8"));
 });
 const [master,partA,partB]=files;
 if(master?.pageCatalog?.parts?.length!==2)throw Error("Master pointer not two-shard");
 if(partA.generatedAt!==partB.generatedAt)throw Error("Mixed catalog generation");
 const pages=[...partA.pages,...partB.pages];
 if(pages.length!==master.pageCatalog.publicPageCount)throw Error("Truncated catalog");
 const urls=new Set(pages.map(p=>p.url.toLowerCase().replace(/\/+$/,"")));
 if(urls.size!==pages.length)throw Error("Duplicate destination");
 return {pages,master};
}
const valid=openCandidate();
assert.equal(valid.pages.length,11024);
const search=(query,category="",repo="")=>valid.pages.filter(p=>
 (!query||[p.title,p.repo,p.path,p.source].join(" ").toLowerCase().includes(query.toLowerCase()))&&
 (!category||p.category===category)&&(!repo||p.repo===repo));
assert.equal(search("").length,11024);
assert.ok(search("mathematics").length>0);
assert.ok(search("mathematics","education").length>0);
assert.ok(search("impossibly_nonexistent_search_token_8273").length===0);
const repo=valid.pages[0].repo;
assert.ok(search("", "", repo).every(p=>p.repo===repo));

const victim=m.files[2].path;
assert.throws(()=>openCandidate({[victim]:null}),/Missing candidate blob/);
const corrupt=Buffer.from(load(victim));
corrupt[10]^=1;
assert.throws(()=>openCandidate({[victim]:corrupt}),/Hash mismatch/);
const previousManifest={activeGeneration:"existing-live-version"};
const currentManifest=structuredClone(previousManifest);
const promote=({approved,allFilesValid})=>{
 if(!approved||!allFilesValid)return false;
 currentManifest.activeGeneration=m.releaseId;return true;
};
assert.equal(promote({approved:false,allFilesValid:true}),false);
assert.equal(promote({approved:true,allFilesValid:false}),false);
assert.deepEqual(currentManifest,previousManifest);
const report={schema:"vnv-wave-06-candidate-functionality-v1",candidateIntegrity:"PASS",
 totalPages:valid.pages.length,searchFilterSmoke:"PASS",
 missingShardFailsClosed:true,hashCorruptionFailsClosed:true,
 activePointerUnchanged:true,publicationApproved:false,
 caution:"Isolated data/catalog acceptance only, NOT actual gateway DOM or end-to-end accessibility and network testing"};
fs.writeFileSync("wave-06-candidate-acceptance.json",JSON.stringify(report,null,2)+"\n");
console.log("CANDIDATE_DATA_TEST=PASS SEARCH=PASS FILTER=PASS MISSING_SHARD=FAIL_CLOSED SHA_CORRUPTION=FAIL_CLOSED");
