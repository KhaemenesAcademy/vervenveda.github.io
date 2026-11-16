/* Verve N Veda front door: local static checks only.
 * Run: node --test tests/front-door-synchronization.test.mjs
 * No site deployment, user storage, DNS, authentication, or network calls.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const html=read("index.html");
const master=JSON.parse(read("ecosystem/master-ecosystem-directory.json"));
const manifest=JSON.parse(read("site.webmanifest"));
const shards=master.pageCatalog.parts.map(p=>JSON.parse(read(p.replace(/^\//,""))));
const repoUrl=/https?:\/\/(?:www\.)?(?:github\.com|github\.dev|raw\.githubusercontent\.com)(?:\/|$)/i;
const publishedHosts=new Set(["vervenveda.github.io","vervenveda.com","www.vervenveda.com","artist1970.github.io","jenniferpearl2028.github.io"]);
test("front door preserves repaired hamburger, hall browsing and civic navigation",()=>{
 assert.match(html,/\$\("menuButton"\)\.addEventListener\("click",\(\) => openMenu\(""\)\)/);
 assert.match(html,/src="assets\/vnv-ecosystem-toolbar\.js/);
 assert.doesNotMatch(html,/href="#campaign"/);
 assert.match(html,/data-group-browse="Public Service"/);
 assert.match(html,/renderMenuBranch\(target\)/);
 assert.match(html,/vnv-gateway-action-legibility-20261116/);
});
test("front door uses project-relative root dependencies",()=>{
 for(const asset of [
  "assets/vervenveda-global-standard.css","assets/vnv-global-standard.css",
  "assets/khaemenes-campus-phrases.js","assets/khaemenes-interlingual-core.js",
  "assets/vnv-language.js","assets/vnv-ticker-autopopulate.js","assets/vnv-ecosystem-toolbar.js",
  "assets/vnv-gateway-chrome-forensic-probe.js","assets/vnv-ecosystem-menu.css",
  "assets/vnv-beta-link.js","admin/index.html","privacy-policy.html","site.webmanifest"
 ])assert.ok(fs.existsSync(path.join(root,asset)),asset+" is missing");
 assert.match(html,/const source="ecosystem\/master-ecosystem-directory\.json"/);
 assert.match(html,/fetch\(new URL\(url\.replace/);
 assert.doesNotMatch(html,/(?:src|href)="\/(?:assets|privacy-policy|site\.webmanifest)/);
});
test("all public buttons and registered destinations avoid GitHub repository/source-code pages",()=>{
 assert.doesNotMatch(html,repoUrl);
 for(const item of master.entries){
  assert.ok(!repoUrl.test(item.url||""),"Repository link in "+item.title);
  const url=new URL(item.url);
  assert.equal(url.protocol,"https:");
  assert.ok(publishedHosts.has(url.hostname),"Unexpected host in "+item.title+": "+url.hostname);
 }
 for(const shard of shards)for(const page of shard.pages){
  assert.ok(!repoUrl.test(page.url||""),"Repository page in public catalog");
  const url=new URL(page.url);
  assert.ok(publishedHosts.has(url.hostname),"Unexpected public catalog host: "+url.hostname);
 }
});
test("canonical page catalog and scoped manifest are complete",()=>{
 assert.equal(master.entryCount,master.entries.length);
 assert.equal(shards.reduce((n,part)=>n+part.pages.length,0),master.pageCatalog.publicPageCount);
 assert.equal(new Set(shards.map(part=>part.generatedAt)).size,1);
 assert.equal(manifest.start_url,"./");
 assert.equal(manifest.scope,"./");
 for(const icon of manifest.icons)assert.ok(fs.existsSync(path.join(root,icon.src)),icon.src+" absent");
});
