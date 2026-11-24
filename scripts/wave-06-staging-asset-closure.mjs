#!/usr/bin/env node
/**
 * Wave 06: deployment dependency-closure inventory.
 * Strictly read-only; never deploys or recopies full site into Academy public main.
 * Inventory is a preflight, not comprehensive JS dynamic import/network analysis.
 */
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
const sourceRoot=path.resolve(process.env.VNV_SOURCE_DIR||"source-pinned");
const candidateRoot=path.resolve("wave-06-restricted-preview");
const original=fs.readFileSync(path.join(sourceRoot,"index.html"),"utf8");
const master=JSON.parse(fs.readFileSync(path.join(candidateRoot,"preview-master-pointer.json"),"utf8"));
const manifest=JSON.parse(fs.readFileSync(path.join(candidateRoot,"restricted-preview-manifest.json"),"utf8"));
assert.equal(master.pageCatalog.publicPageCount,11021);
assert.equal(manifest.restrictedPageCount,11021);
const hash=b=>createHash("sha256").update(b).digest("hex");
const sha1=b=>createHash("sha1").update("blob "+b.length+"\0").update(b).digest("hex");
const originalBytes=Buffer.from(original);
assert.equal(sha1(originalBytes),"a883f035329a89e55d526160c54ffdac3c7af2f9");
const refs=[];
for(const m of original.matchAll(/<(script|link|img)\b([^>]+)>/gi)){
 const kind=m[1].toLowerCase(),attrs=m[2],url=attrs.match(/\b(?:src|href)\s*=\s*(["'])(.*?)\1/i)?.[2];
 if(!url||url.startsWith("data:")||url.includes("\${"))continue;
 if(kind==="link"&&!/\brel\s*=\s*["'](?:stylesheet|manifest|icon|apple-touch-icon|preload|modulepreload)["']/i.test(attrs))continue;
 let pathname,category,exists=null;
 if(/^https?:\/\//i.test(url)){
   pathname=new URL(url).pathname;category="external";
 }else if(url.startsWith("#")||url.startsWith("mailto:"))continue;
 else{
   pathname="/"+url.split(/[?#]/)[0].replace(/^\/+/,"");
   category="same-origin";
   const local=path.resolve(sourceRoot,"."+pathname);
   exists=local.startsWith(sourceRoot+path.sep)&&fs.existsSync(local)&&fs.statSync(local).isFile();
 }
 refs.push({element:kind,src:url.slice(0,260),path:pathname,category,sourceFilePresent:exists});
}
const missing=refs.filter(r=>r.category==="same-origin"&&!r.sourceFilePresent);
const externalExecutable=refs.filter(r=>r.category==="external"&&(r.element==="script"||r.src.endsWith(".js")));
const localJS=refs.filter(r=>r.element==="script"&&r.category==="same-origin");
const prodHosts=[...new Set(externalExecutable.map(r=>new URL(r.src).host))];
const dynamicReferences=[
 "KhaemenesTranslatorLoader.ensure",
 "fetch(",
 "serviceWorker",
 "vnv-ticker-autopopulate.js",
 "ecosystem/master-ecosystem-directory.json"
].map(term=>({term,count:original.split(term).length-1}));
const prohibitedRoutes=["teacher-admin/index.html","courses/mathematics/evidence-vault/index.html"];
const summaries={
 schema:"vnv-wave-06-staging-asset-closure-preflight-v1",
 mode:"READ_ONLY_NOT_DEPLOYED",sourceRepository:"vervenveda/vervenveda.github.io",
 pinnedCommit:"836bdb78769f70b255e5c0bc7773b6f6de61a28d",
 restrictedDirectoryPages:master.pageCatalog.publicPageCount,
 directRefs:refs,missingDirectSourceFiles:missing,
 externalExecutableDependencies:externalExecutable,
 externalExecutableHosts:prodHosts,localScripts:localJS,dynamicReferenceMarkers:dynamicReferences,
 knownHeldPaths:prohibitedRoutes,
 publicHttpsStagingReady:false,independentOfflineRuntimeVerified:false,
 reason:"Unrewritten original homepage includes external production executable references; even resolving source files does not isolate runtime data flows. No separate public HTTPS staging host is configured.",
 nextRequirements:[
   "Select an authorized separate staging host with CA-trusted HTTPS, isolated origin and no production credentials",
   "Mirror/replace required executable dependencies in a versioned staging build with exact source hashes or inert mocks; reject any unexpected outbound executable source",
   "Serve restricted manifest + two shards atomically, preserve previous deployed bytes and rehearse real rollback",
   "Run the existing multi-browser UI and WCAG tests against the independent staging URL",
   "Do not promote the three sensitive held entries or assume deep-search exclusion removes direct URLs"
 ],
 liveGatewayModified:false,pagesPublished:false,stosWrites:false
};
fs.writeFileSync("wave-06-staging-closure-evidence.json",JSON.stringify(summaries,null,2)+"\n");
console.log("CLOSURE_PREFLIGHT=COMPLETE LOCAL_SCRIPTS="+localJS.length+" MISSING_SOURCE_DIRECT_REFS="+missing.length+" EXTERNAL_EXECUTABLES="+externalExecutable.length);
console.log("PUBLIC_STAGING_READY=NO PROD_HOST_DEPENDENCIES="+prodHosts.join(",")+" CUTOVER=HOLD");
