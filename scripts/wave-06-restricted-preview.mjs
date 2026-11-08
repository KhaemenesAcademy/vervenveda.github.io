#!/usr/bin/env node
/* Restricted PREVIEW candidate, not approved release or mutation of source.
 * Filter HOLD entries from the deep-search page catalog only. The curated
 * master entries are preserved except for their pageCatalog pointer metadata.
 */
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
const sha256=b=>createHash("sha256").update(b).digest("hex");
const source="wave-06-candidate";
const base=path.resolve(source);
const manifest=JSON.parse(fs.readFileSync(path.join(base,"candidate-manifest.json"),"utf8"));
const policy=JSON.parse(fs.readFileSync("policy/wave-06-directory-access-review.json","utf8"));
const root="registry/previews/2026-11-08-restricted/";
const out=path.resolve("wave-06-restricted-preview");
const fileSet=manifest.files.map(f=>({entry:f,bytes:fs.readFileSync(path.join(base,f.path))}));
for(const item of fileSet)assert.equal(sha256(item.bytes),item.entry.sha256,"Tampered original input");
const original=fileSet.map(x=>JSON.parse(x.bytes.toString("utf8")));
const [master,a,b]=original;
assert.deepEqual(master.pageCatalog.parts,["/registry/ecosystem-pages-a.json","/registry/ecosystem-pages-b.json"]);
const match=(p,d)=>String(p.repo).toLowerCase()===String(d.repository).toLowerCase() &&
 String(p.path).replace(/^\/+/,"").toLowerCase()===String(d.path).replace(/^\/+/,"").toLowerCase();
const removed=[];
const pieces=[a,b].map((shard,index)=>{
 const copy=structuredClone(shard);
 copy.pages=copy.pages.filter(p=>{
  const hold=policy.decisions.find(d=>d.reviewStatus==="HOLD"&&match(p,d));
  if(hold){removed.push({repo:p.repo,path:p.path,sourceShard:index});return false}
  return true;
 });
 return copy;
});
assert.equal(removed.length,3,"Unexpected held-entry count");
assert.equal(new Set(removed.map(x=>x.repo+"|"+x.path)).size,3);
const pages=pieces.flatMap(x=>x.pages);
assert.equal(pages.length,11021);
assert.equal(pieces[0].generatedAt,pieces[1].generatedAt);
for(const d of policy.decisions)assert.equal(pages.filter(p=>match(p,d)).length,0,"Held route found in preview");
const preview=structuredClone(master);
preview.pageCatalog.parts=["/"+root+"registry/ecosystem-pages-a.json","/"+root+"registry/ecosystem-pages-b.json"];
preview.pageCatalog.publicPageCount=pages.length;
preview.pageCatalog.releaseCandidate={id:"2026-11-08-restricted",status:"PREVIEW_HOLD_EXCLUSIONS",ownerApproved:false};
const outputs=[
 ["ecosystem/master-ecosystem-directory.json",preview],
 ["registry/ecosystem-pages-a.json",pieces[0]],
 ["registry/ecosystem-pages-b.json",pieces[1]]
];
const outputInfo=[];
for(const [relative,value] of outputs){
 const data=Buffer.from(JSON.stringify(value,null,2)+"\n");
 const destination=path.join(out,root,relative);
 fs.mkdirSync(path.dirname(destination),{recursive:true});
 fs.writeFileSync(destination,data);
 outputInfo.push({route:"/"+root+relative,sha256:sha256(data),bytes:data.length});
}
const entry=Buffer.from(JSON.stringify(preview,null,2)+"\n");
fs.writeFileSync(path.join(out,"preview-master-pointer.json"),entry);
const summary={
 schema:"vnv-wave-06-restricted-preview-v1",sourcePinnedCommit:manifest.sourceCommit,
 sourceMasterCount:master.pageCatalog.publicPageCount,restrictedPageCount:pages.length,
 retainedOriginalUnchanged:true,excluded:removed,sha256:outputInfo,
 generation:pieces[0].generatedAt,masterPointerPreviewOnly:true,
 releaseAuthorized:false,livePublicSiteModified:false,stosImport:false,
 note:"Preview excludes three pending public-discovery links only. It does not revoke direct access to the original public URLs, nor establish authorization, and it must not replace the original canonical catalog without owner review."
};
fs.writeFileSync(path.join(out,"restricted-preview-manifest.json"),JSON.stringify(summary,null,2)+"\n");
fs.writeFileSync("wave-06-restricted-preview-evidence.json",JSON.stringify(summary,null,2)+"\n");
console.log("RESTRICTED_PREVIEW=PASS SOURCE_PAGES="+master.pageCatalog.publicPageCount+" PREVIEW_PAGES="+pages.length+" HOLD_EXCLUDED="+removed.length+" RELEASE=HOLD");
