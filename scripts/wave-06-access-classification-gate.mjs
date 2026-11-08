#!/usr/bin/env node
/* Source-only public discoverability gate: this is a policy test, NOT approval. */
import fs from "node:fs";
import assert from "node:assert/strict";
const policy=JSON.parse(fs.readFileSync("policy/wave-06-directory-access-review.json","utf8"));
const manifest=JSON.parse(fs.readFileSync("wave-06-candidate/candidate-manifest.json","utf8"));
const root="wave-06-candidate/";
const parts=manifest.files.filter(x=>/registry\/ecosystem-pages-[ab]\.json$/.test(x.path));
assert.equal(parts.length,2);
const pages=parts.flatMap(x=>JSON.parse(fs.readFileSync(root+x.path,"utf8")).pages);
assert.equal(pages.length,11024);
function key(repo,path){return String(repo).toLowerCase().replace(/\.github\.io$/,"")+"|"+String(path).toLowerCase().replace(/^\/+/,"");}
function verifiedDecision(decision){
  return decision.reviewStatus==="APPROVED_PUBLIC_DISCOVERY" &&
    typeof decision.reviewer==="string" && decision.reviewer.trim().length>=4 &&
    /^\d{4}-\d{2}-\d{2}$/.test(decision.reviewDate||"") &&
    typeof decision.authorizationScope==="string" && decision.authorizationScope.length>=12 &&
    Array.isArray(decision.evidenceUrls) && decision.evidenceUrls.length>=2 &&
    decision.evidenceUrls.every(url=>{try{return new URL(url).protocol==="https:"}catch{return false}});
}
const indexed=new Map();
for(const page of pages){const k=key(page.repo,page.path);indexed.set(k,(indexed.get(k)||0)+1);}
const summary={schema:"vnv-wave-06-classification-gate-v1",sourcePages:pages.length,
  pending:[],approved:[],unmatched:[],approvedForRelease:false,releaseAuthorized:false,
  conclusion:"BLOCK_PUBLIC_PROMOTION"};
for(const d of policy.decisions){
  const k=key(d.repository,d.path);
  const count=indexed.get(k)||0;
  if(count!==1)summary.unmatched.push({repository:d.repository,path:d.path,count});
  else if(verifiedDecision(d))summary.approved.push({repository:d.repository,path:d.path});
  else summary.pending.push({repository:d.repository,path:d.path,status:d.reviewStatus});
}
assert.equal(summary.unmatched.length,0,"Review policy paths must exist in the canonical catalog exactly once");
assert.equal(summary.pending.length,3,"Three public discovery reviews must remain blocked until reviewed");
assert.equal(summary.approved.length,0,"No unverified source-owner approvals may be presumed");
assert.equal(policy.releaseAuthorized,false);
assert.equal(manifest.publicPublicationApproved,false);
assert.equal(verifiedDecision({...policy.decisions[0],reviewStatus:"APPROVED_PUBLIC_DISCOVERY"}),false,
 "Flipping a status alone must never elevate an entry");
assert.equal(verifiedDecision({...policy.decisions[0],reviewStatus:"APPROVED_PUBLIC_DISCOVERY",reviewer:"anon"}),false,
 "Reviewer identity alone must never bypass evidence");
fs.writeFileSync("wave-06-access-classification.json",JSON.stringify(summary,null,2)+"\n");
console.log("ACCESS_CLASSIFICATION=HOLD MATCHED="+(summary.pending.length+summary.approved.length)+" PENDING="+summary.pending.length+" PUBLIC_PROMOTION=BLOCKED");
