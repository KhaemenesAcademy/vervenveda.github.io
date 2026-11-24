#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
const root="wave-06-vercel-handoff";
const config=JSON.parse(fs.readFileSync(path.join(root,"vercel.json"),"utf8"));
const state=JSON.parse(fs.readFileSync(path.join(root,"HANDOFF-EVIDENCE.json"),"utf8"));
const original=JSON.parse(fs.readFileSync(path.join(root,"public/staging-bundle-manifest.json"),"utf8"));
assert.equal(config.outputDirectory,"public");
assert.equal(config.framework,null);
assert.equal(state.publishingAuthorized,false);
assert.equal(state.productionCutoverAuthorized,false);
assert.equal(original.files.length,21);
assert.equal(original.restrictedPages,11021);
const hash=b=>createHash("sha256").update(b).digest("hex");
for(const item of original.files){
 const route=item.route.slice(1);
 const raw=fs.readFileSync(path.join(root,"public",route));
 assert.equal(hash(raw),item.sha256,"Staging file hash differs "+route);
}
assert.equal(fs.readFileSync(path.join(root,"public/robots.txt"),"utf8"),"User-agent: *\nDisallow: /\n");
const all=config.headers.find(h=>h.source==="/(.*)")?.headers||[];
const values=Object.fromEntries(all.map(h=>[h.key.toLowerCase(),h.value]));
assert.match(values["x-robots-tag"],/noindex/);
assert.match(values["content-security-policy"],/script-src 'self'/);
assert.match(values["content-security-policy"],/connect-src 'self'/);
assert.match(values["content-security-policy"],/frame-ancestors 'none'/);
assert.match(values["permissions-policy"],/payment=\(\)/);
for(const exact of ["/index.html","/ecosystem/master-ecosystem-directory.json","/staging-bundle-manifest.json"]){
 const h=config.headers.find(h=>h.source===exact)?.headers;
 assert.ok(h?.some(x=>x.key==="Cache-Control"&&x.value==="no-store"),"Pointer caching not disabled "+exact);
}
const immutable=config.headers.find(h=>h.source.startsWith("/registry/previews/"))?.headers||[];
assert.ok(immutable.some(h=>h.key==="Cache-Control"&&h.value.includes("immutable")));
const files=[];
function walk(p){
 for(const entry of fs.readdirSync(p,{withFileTypes:true})){
  const item=path.join(p,entry.name);
  if(entry.isDirectory())walk(item);
  else files.push(path.relative(path.join(root,"public"),item).replace(/\\/g,"/"));
 }
}
walk(path.join(root,"public"));
const allowed=new Set([...original.files.map(x=>x.route.slice(1)),"staging-bundle-manifest.json","robots.txt"]);
assert.deepEqual(new Set(files),allowed,"Unexpected file content in public export");
for(const forbidden of ["teacher-admin/index.html","courses/mathematics/evidence-vault/index.html"]){
 assert.equal(files.some(x=>x.includes(forbidden)),false,"Held route accidentally uploaded");
}
console.log("VERCEL_PREDEPLOY_GATE=PASS FILE_HASHES=21 CONTENTS_EXACT=23 NOINDEX=YES CACHE_POLICY=PASS DEPLOY=NO");
