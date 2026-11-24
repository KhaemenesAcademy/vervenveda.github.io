import fs from "node:fs";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import path from "node:path";
const base="wave-06-restricted-preview";
const m=JSON.parse(fs.readFileSync(path.join(base,"restricted-preview-manifest.json")));
assert.equal(m.restrictedPageCount,11021);
assert.equal(m.excluded.length,3);
assert.equal(m.releaseAuthorized,false);
const values=m.sha256.map(item=>{
  const file=path.join(base,item.route.slice(1)),b=fs.readFileSync(file);
  assert.equal(createHash("sha256").update(b).digest("hex"),item.sha256,"Preview mutated: "+item.route);
  return JSON.parse(b.toString("utf8"));
});
const [master,a,b]=values;
assert.equal(master.pageCatalog.publicPageCount,11021);
assert.deepEqual(master.pageCatalog.parts,[m.sha256[1].route,m.sha256[2].route]);
assert.equal(a.generatedAt,b.generatedAt);
const pages=[...a.pages,...b.pages];
assert.equal(pages.length,11021);
const normalize=(x)=>x.replace(/\/+$/,"").toLowerCase();
assert.equal(new Set(pages.map(x=>normalize(x.url))).size,11021);
for(const held of m.excluded){
 assert.equal(pages.filter(p=>p.repo===held.repo&&p.path===held.path).length,0);
 assert.equal(pages.filter(p=>normalize(p.url).includes(held.path.toLowerCase())).length,0);
}
const matches=q=>pages.filter(p=>(p.title+" "+p.repo+" "+p.path).toLowerCase().includes(q.toLowerCase()));
assert.ok(matches("mathematics").length>0);
assert.ok(matches("science").length>0);
assert.equal(matches("not_a_real_destination_9f14").length,0);
const original=JSON.parse(fs.readFileSync("source-pinned/ecosystem/master-ecosystem-directory.json","utf8"));
assert.equal(original.pageCatalog.publicPageCount,11024);
assert.deepEqual(original.pageCatalog.parts,["/registry/ecosystem-pages-a.json","/registry/ecosystem-pages-b.json"]);
console.log("RESTRICTED_PREVIEW_ACCEPTANCE=PASS PAGE_COUNT=11021 ORIGINAL_PRESERVED=YES PUBLISH=NO");
