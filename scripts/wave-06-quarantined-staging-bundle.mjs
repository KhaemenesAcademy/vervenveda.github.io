#!/usr/bin/env node
/* Quarantined staging bundle, artifact ONLY: do not publish or merge. */
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
const src=path.resolve("source-pinned"),lin=path.resolve("source-linguistics"),preview=path.resolve("wave-06-restricted-preview"),out=path.resolve("wave-06-quarantine-site");
const sha256=b=>createHash("sha256").update(b).digest("hex"),blob=b=>createHash("sha1").update("blob "+b.length+"\0").update(b).digest("hex");
const records=[];
function copy(root,p,d=p,pinned){
 const bytes=fs.readFileSync(path.join(root,p));
 if(pinned)assert.equal(blob(bytes),pinned,"Pinned source mismatch "+p);
 const file=path.join(out,d);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);
 records.push({route:"/"+d,bytes:bytes.length,sha256:sha256(bytes),source:p,originalGitBlob:blob(bytes)});
}
for(const [p,h] of [
 ["assets/vervenveda-global-standard.css","0f2846e2de3a938c939e60ee6e8807726cf267db"],
 ["assets/vnv-global-standard.css","4a1639543b3a96d9d756f88e13b8e7a26d8db0a2"],
 ["assets/khaemenes-campus-phrases.js","2a7c6c8030df3d62df7312cb9111acfe7a5534f6"],
 ["assets/khaemenes-interlingual-core.js","13955ca419bcdb785ba1289137553f67306b0d77"],
 ["assets/vnv-language.js","b65ef766cfbd0adcd88b4e7cc970a1e3ee35bd7c"],
 ["assets/vnv-ticker-autopopulate.js","0bd454d19f16dc7d253c3ef37c86449d57d4e213"],
 ["assets/vnv-ecosystem-toolbar.js","1018290c6c29ca4ed527df1febbd8b718e97c7bd"]
])copy(src,p,p,h);
for(const p of ["site.webmanifest","icon-192.png","apple-touch-icon.png"])copy(src,p);
for(const [p,h] of [
 ["khaemenes-translator-loader.js","1ebfa3c7e427cc416695cb45f935ba56a456c9b8"],
 ["khaemenes-campus-phrases.js","2a7c6c8030df3d62df7312cb9111acfe7a5534f6"],
 ["sovereign-dictionary.generated.js","dabfd6fa91de2192912d5cebf78869ff9101d44f"],
 ["khaemenes-lexicon-expansion.js","d98564e3405e8fed21743b914208706539366d05"],
 ["khaemenes-transliteration.js","8fb108fb9efc7f3dd36be595cf194b0add9ca033"],
 ["khaemenes-interlingual-core.js","0a5fd50a332e750c8361bbb6578d2193d26aa5a3"],
 ["khaemenes-review-policy.js","a47ed1a0297485d98fdea9e2d7b30a22962d52eb"]
])copy(lin,"assets/"+p,"Khaemenes_Linguistics.github.io/assets/"+p,h);
const release="registry/previews/2026-11-08-restricted",base=path.join(preview,release);
for(const p of ["registry/ecosystem-pages-a.json","registry/ecosystem-pages-b.json"])copy(base,p,release+"/"+p);
const m=JSON.parse(fs.readFileSync(path.join(preview,"restricted-preview-manifest.json")));
assert.equal(m.restrictedPageCount,11021);assert.equal(m.releaseAuthorized,false);
const pointer=fs.readFileSync(path.join(preview,"preview-master-pointer.json")),pointerRoute="ecosystem/master-ecosystem-directory.json";
fs.mkdirSync(path.dirname(path.join(out,pointerRoute)),{recursive:true});
fs.writeFileSync(path.join(out,pointerRoute),pointer);
records.push({route:"/"+pointerRoute,bytes:pointer.length,sha256:sha256(pointer),source:"restricted preview pointer"});
const original=fs.readFileSync(path.join(src,"index.html"),"utf8");
assert.equal(blob(Buffer.from(original)),"a883f035329a89e55d526160c54ffdac3c7af2f9");
const changes=[
 ["https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1","/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1"],
 ["https://vervenveda.com/assets/vnv-ecosystem-toolbar.js","/assets/vnv-ecosystem-toolbar.js"]
];
let altered=original;
for(const [before,after] of changes){assert.equal(altered.split(before).length-1,1,"Unexpected remote script count");altered=altered.replace(before,after);}
const csp='<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\' \'unsafe-inline\'; connect-src \'self\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data:; font-src \'self\'; frame-src \'none\'; worker-src \'none\'; object-src \'none\'; form-action \'none\'; base-uri \'self\';">';
assert.ok(altered.includes("</head>"));
altered=altered.replace("</head>",csp+"\n</head>");
assert.equal((altered.match(/<script\b[^>]+src=["']https?:\/\//gi)||[]).length,0,"Remote executable tag remains");
fs.writeFileSync(path.join(out,"index.html"),altered);
records.push({route:"/index.html",bytes:Buffer.byteLength(altered),sha256:sha256(Buffer.from(altered)),source:"original index + 2 localized script URLs + staging-only CSP"});
const bundle={schema:"vnv-wave-06-quarantined-staging-bundle-v1",sourceCommit:"836bdb78769f70b255e5c0bc7773b6f6de61a28d",
 linguisticsCommit:"ebd5e8053a9fa07c3a3ca0865501ced339621916",
 originalIndexGitBlob:"a883f035329a89e55d526160c54ffdac3c7af2f9",
 restrictedPages:11021,heldDeepSearchEntriesExcluded:3,files:records,
 stagingIndexSha256:sha256(Buffer.from(altered)),restrictions:{scriptExecution:"same-origin only",dataConnections:"same-origin only",externalNavigation:"not disabled",inlineScriptsAllowed:true,networkCompletenessNotProven:true},
 readiness:"UNDEPLOYED_REVIEW_CANDIDATE",publicDeploymentAuthorized:false,internetReachableStagingTested:false,previousLiveDeploymentRetained:false,stosImportAuthorized:false,productionSourcesUntouched:true};
fs.writeFileSync(path.join(out,"staging-bundle-manifest.json"),JSON.stringify(bundle,null,2)+"\n");
fs.writeFileSync("wave-06-quarantine-evidence.json",JSON.stringify({fileCount:records.length,restrictedPages:11021,
 remoteExecutableReferences:0,publicReleaseAllowed:false,sourceCommit:bundle.sourceCommit,linguisticsCommit:bundle.linguisticsCommit},null,2)+"\n");
console.log("QUARANTINED_PACKAGE=BUILT FILES="+records.length+" REMOTE_SCRIPT_TAGS=0 RESTRICTED_PAGES=11021");
console.log("STAGING_PUBLICATION=NO PRODUCTION_INDEX_UNCHANGED=YES CUTOVER=HOLD");
