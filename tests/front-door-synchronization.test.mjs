import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const html=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");
const HOME="https://vervenveda.com/Khaemenes_Academy.github.io/";
test("front door displays a minimal Academy welcome with exactly one public action",()=>{
 assert.match(html,/<h1[^>]*>Khaemenes Academy<\/h1>/);
 const actions=[...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/gi)];
 assert.equal(actions.length,1,"The welcome page must have only one button/link");
 assert.equal(actions[0][1],HOME,"The only action must open the public Academy Home");
 assert.match(html,/Enter Khaemenes Academy/);
});
test("front door does not duplicate the full Academy application or learner accounts",()=>{
 for(const prohibited of [
  "<script","localStorage","sessionStorage","indexedDB",
  "khaemenes-family-registry.js","khaemenes-front-door-router.js",
  "vnvEnrichedMenuOverlay","vnvTickerAutoPopulate","vnv333NetworkTicker",
  "drawerBg","fetch("
 ])assert.ok(!html.includes(prohibited),"Unexpected duplicated application feature: "+prohibited);
});
test("one-button entrance uses a public destination and accessible base styling",()=>{
 const u=new URL(HOME);
 assert.equal(u.protocol,"https:");
 assert.equal(u.hostname,"vervenveda.com");
 assert.match(html,/class="action"/);
 assert.match(html,/:focus-visible/);
 assert.match(html,/font-size:16px/);
});
