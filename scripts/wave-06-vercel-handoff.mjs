#!/usr/bin/env node
/**
 * Export an INERT standalone Vercel preview candidate under the Actions runner.
 * This DOES NOT create a Vercel project, perform a deployment, or change DNS.
 * The operator must inspect and approve this artifact before any public hosting.
 */
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";

const source=path.resolve("wave-06-quarantine-site");
const target=path.resolve("wave-06-vercel-handoff");
const pub=path.join(target,"public");
const sha256=b=>createHash("sha256").update(b).digest("hex");
const data=JSON.parse(fs.readFileSync(path.join(source,"staging-bundle-manifest.json"),"utf8"));
assert.equal(data.files.length,21);
assert.equal(data.restrictedPages,11021);
assert.equal(data.publicDeploymentAuthorized,false);
assert.equal(data.stosImportAuthorized,false);
assert.equal(data.internetReachableStagingTested,false);

fs.mkdirSync(pub,{recursive:true});
for(const file of data.files){
  assert.ok(/^\/[A-Za-z0-9_.\/-]+$/.test(file.route) && !file.route.includes(".."),"Invalid route");
  const rel=file.route.slice(1);
  const bytes=fs.readFileSync(path.join(source,rel));
  assert.equal(sha256(bytes),file.sha256,"Changed source asset "+rel);
  const out=path.join(pub,rel);
  fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,bytes);
}
const manifestBytes=fs.readFileSync(path.join(source,"staging-bundle-manifest.json"));
fs.writeFileSync(path.join(pub,"staging-bundle-manifest.json"),manifestBytes);
fs.writeFileSync(path.join(pub,"robots.txt"),"User-agent: *\nDisallow: /\n");
const index=fs.readFileSync(path.join(pub,"index.html"),"utf8");
assert.ok(index.includes("script-src 'self'"),"Staging CSP missing");
assert.equal((index.match(/<script\b[^>]*src=["']https?:\/\//gi)||[]).length,0);
const header=(key,value)=>({key,value});
const shared=[
  header("X-Robots-Tag","noindex, nofollow, noarchive"),
  header("X-Content-Type-Options","nosniff"),
  header("Referrer-Policy","no-referrer"),
  header("X-Frame-Options","DENY"),
  header("Permissions-Policy","camera=(), microphone=(), geolocation=(), payment=()"),
  header("Content-Security-Policy","default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-src 'none'; frame-ancestors 'none'; worker-src 'none'; object-src 'none'; form-action 'none'; base-uri 'self';")
];
const config={
  "$schema":"https://openapi.vercel.sh/vercel.json",
  "framework":null,
  "outputDirectory":"public",
  "headers":[
    {source:"/(.*)",headers:shared},
    {source:"/index.html",headers:[header("Cache-Control","no-store")]},
    {source:"/",headers:[header("Cache-Control","no-store")]},
    {source:"/ecosystem/master-ecosystem-directory.json",headers:[header("Cache-Control","no-store")]},
    {source:"/staging-bundle-manifest.json",headers:[header("Cache-Control","no-store")]},
    {source:"/registry/previews/2026-11-08-restricted/(.*)",headers:[header("Cache-Control","public, max-age=31536000, immutable")]}
  ]
};
fs.writeFileSync(path.join(target,"vercel.json"),JSON.stringify(config,null,2)+"\n");
const audit={
 schema:"vnv-wave-06-vercel-isolated-handoff-v1",
 mode:"UNDEPLOYED_PACKAGE_ONLY",
 sourceCommit:data.sourceCommit,
 linguisticsCommit:data.linguisticsCommit,
 originalIndexGitBlob:data.originalIndexGitBlob,
 restrictedPages:11021,
 copiedAssets:data.files.length,
 stagedPaths:[...data.files.map(x=>x.route),"/staging-bundle-manifest.json","/robots.txt"],
 configSha256:sha256(fs.readFileSync(path.join(target,"vercel.json"))),
 manifestSha256:sha256(manifestBytes),
 publishingAuthorized:false,
 stagingHostConnected:false,
 productionCutoverAuthorized:false,
 dnsModified:false,
 verificationNotes:[
  "Vercel deploy protection must be reviewed before any publicly reachable staging preview",
  "No live student/teacher/admin data may be added to preview",
  "No production-domain aliases or rewrites may be configured",
  "The 3 held deep-search entries are excluded, but old direct source URLs are unaffected",
  "Do not connect this PR branch or the existing public main branch to automatic production deploy",
  "Vercel framework/output settings require runtime validation on an independently authorized staging project"
 ]
};
fs.writeFileSync(path.join(target,"HANDOFF-EVIDENCE.json"),JSON.stringify(audit,null,2)+"\n");
fs.writeFileSync("wave-06-vercel-handoff-evidence.json",JSON.stringify(audit,null,2)+"\n");
console.log("VERCEL_HANDOFF=PASS PINNED_ASSETS=21 STAGED_PAGES=11021 NOINDEX=YES PUBLIC_DEPLOY=NO");
