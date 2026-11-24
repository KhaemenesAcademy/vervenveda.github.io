import assert from "node:assert/strict";
import fs from "node:fs";
import {createServer} from "node:http";
import path from "node:path";
import {chromium} from "playwright";

/* All records are synthetic. Browser is isolated from external networks. */
const repos={
 academy:{root:path.resolve("source-academy"),url:"/Khaemenes_Academy.github.io/teacher-admin/index.html"},
 high:{root:path.resolve("source-high"),url:"/Khaemenes_High.github.io/courses/mathematics/evidence-vault/index.html"},
 higher:{root:path.resolve("source-higher"),url:"/Khaemenes_Higher_Learning.github.io/courses/mathematics/evidence-vault/index.html"}
};
const mapping=new Map(Object.values(repos).map(o=>[o.url,path.join(o.root,o.url.split("/").slice(2).join("/"))]));
const server=createServer((req,res)=>{
 const p=new URL(req.url,"http://localhost").pathname;
 if(!mapping.has(p)){res.writeHead(404);res.end("not served in audit");return;}
 res.writeHead(200,{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"});
 res.end(fs.readFileSync(mapping.get(p)));
});
await new Promise(done=>server.listen(0,"127.0.0.1",done));
const origin="http://127.0.0.1:"+server.address().port;
const browser=await chromium.launch({headless:true});
const results=[];
async function withPage(testName,target,seed,fn){
 const context=await browser.newContext({serviceWorkers:"block"});
 const page=await context.newPage(),errors=[],blocked=[];
 page.on("pageerror",e=>errors.push(e.message.slice(0,240)));
 await page.route("**/*",route=>{
  if(mapping.has(new URL(route.request().url()).pathname) && route.request().url().startsWith(origin))return route.continue();
  blocked.push(route.request().url().slice(0,130));
  return route.abort();
 });
 if(seed)await page.addInitScript(seed);
 try{
  await page.goto(origin+target.url,{waitUntil:"domcontentloaded",timeout:30000});
  await page.waitForTimeout(160);
  const evidence=await fn(page);
  results.push({testName,passed:true,...evidence,errors:errors.slice(0,6),remoteRequestsBlocked:blocked.length});
  console.log("ACCESS_BROWSER_CHECK=PASS "+JSON.stringify(results.at(-1)));
 }finally{await context.close();}
}
try{
 for(const id of ["high","higher"]){
  await withPage(id+" guest cannot enumerate learner evidence",repos[id],null,async page=>{
   assert.match(await page.locator("#ownerNotice").innerText(),/No Academy learner is selected/i);
   assert.equal(await page.locator("#courseGrid").locator("article").count(),0);
   assert.equal(await page.locator("#exportBtn").isDisabled(),true);
   return {guestExportDisabled:true,guestEvidenceCards:0};
  });
  const fake='(()=>{const key="audit-fabricated-learner";localStorage.setItem("khaemenes_active_learner_v1",JSON.stringify(key));localStorage.setItem("khaemenes_family_registry_v1",JSON.stringify({learners:{[key]:{learnerId:key,name:"AUDIT FICTIONAL LEARNER"}}}));})();';
  await withPage(id+" local identity is not server authorization",repos[id],fake,async page=>{
   assert.match(await page.locator("#ownerNotice").innerText(),/AUDIT FICTIONAL LEARNER/);
   assert.equal(await page.locator("#exportBtn").isDisabled(),false);
   return {identityCreatedByLocalStorage:true,exportButtonEnabled:true,serverAuthorizationVerified:false,releaseClassification:"HOLD"};
  });
 }
 await withPage("teacher guest empty review queue",repos.academy,null,async page=>{
  assert.match(await page.locator("#queue").innerText(),/No review records match this view/);
  return {queueEmpty:true,authenticatedTeacherSessionVerified:false};
 });
 const fakeQueue='(()=>{localStorage.setItem("khaemenes.evidence-review-holds.v1",JSON.stringify([{assessmentId:"TEST-ONLY-MOCK-ASSESSMENT",itemId:"TEST-01",note:"Synthetic no real child data",evidenceState:"review",resolved:false,createdAt:"2026-11-08T00:00:00Z"}]));})();';
 await withPage("teacher queue from local storage without login",repos.academy,fakeQueue,async page=>{
  assert.match(await page.locator("#queue").innerText(),/TEST-ONLY-MOCK-ASSESSMENT/);
  assert.equal(await page.locator("#openCount").innerText(),"1");
  return {localQueueVisibleWithoutTeacherAuthentication:true,syntheticDataOnly:true,releaseClassification:"HOLD"};
 });
 console.log("ACCESS_GUEST_BROWSER_GATE=PASS_WITH_SECURITY_HOLDS");
}finally{
 await browser.close();
 await new Promise(done=>server.close(done));
 fs.writeFileSync("wave-06-guest-access-evidence.json",JSON.stringify({
  schema:"vnv-wave-06-guest-access-browser-v1",mode:"UNPUBLISHED_TEST_ONLY",
  syntheticFixturesOnly:true,tests:results,
  releaseAuthorized:false,sourceOwnerApproval:false,
  conclusion:"HOLD_THREE_DIRECTORY_ENTRIES",
  interpretation:"Browser-local learner selection and teacher queues are not server authentication. Guest vault default is empty, but fabricated local state enables learner-view/export UI and teacher-review display. This is an access-design finding, not proof of remote cross-account access."
 },null,2)+"\n");
}
