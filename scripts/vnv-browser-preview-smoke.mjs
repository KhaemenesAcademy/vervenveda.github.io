#!/usr/bin/env node
// Offline-only browser probe for a locally staged Gateway preview.
// External HTTP(S) requests are refused: no custom-domain deployment is tested.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const root = process.env.VNV_PREVIEW_ORIGIN || "http://127.0.0.1:8765";
const out = process.env.VNV_PREVIEW_EVIDENCE || process.cwd();
fs.mkdirSync(out, { recursive: true });
const report = { schema: "vnv-browser-preview-v1", previewOnly: true,
  remoteDomainsTested: false, cutoverApproved: false,
  cases: [], errors: [], missingSameOriginResources: [] };
const browser = await chromium.launch({ headless: true });

async function verifyViewport(name, viewport) {
  const context = await browser.newContext({ viewport, serviceWorkers: "block" });
  const page = await context.newPage();
  const pageErrors = [];
  const missing = [];
  await page.route("**/*", async route => {
    const req = route.request();
    if (new URL(req.url()).origin !== new URL(root).origin) {
      await route.abort("blockedbyclient");
      return;
    }
    await route.continue();
  });
  page.on("pageerror", e => pageErrors.push(e.message.slice(0, 300)));
  page.on("response", response => {
    const url = new URL(response.url());
    if (url.origin === new URL(root).origin && response.status() >= 400) {
      missing.push({ path: url.pathname, status: response.status() });
    }
  });
  const result = { name, viewport, state: "UNKNOWN" };
  try {
    const response = await page.goto(root + "/", { waitUntil: "domcontentloaded", timeout: 25000 });
    if (!response || response.status() !== 200) throw new Error("local root did not return HTTP 200");
    await page.locator("#ecosystemPageSearch").waitFor({ timeout: 20000 });
    await page.waitForFunction(() => {
      const el = document.getElementById("ecosystemPageStatus");
      return el && (el.textContent.includes("Indexed ") ||
        el.textContent.includes("temporarily unavailable"));
    }, { timeout: 45000 });
    const status = await page.locator("#ecosystemPageStatus").innerText();
    if (!status.includes("Indexed ")) throw new Error("catalog not available: " + status);
    const initialResults = await page.locator("#ecosystemPageResults a").count();
    if (!initialResults) throw new Error("catalog loaded but no rendered page links");
    await page.locator("#ecosystemPageSearch").fill("mathematics");
    const filteredStatus = await page.locator("#ecosystemPageStatus").innerText();
    if (!filteredStatus.includes("matches")) throw new Error("search did not produce match status");
    const filteredResults = await page.locator("#ecosystemPageResults a").count();
    if (!filteredResults) throw new Error("mathematics search returned zero indexed pages");
    if (await page.locator("#networkTicker").count() !== 1)
      throw new Error("333 ticker missing or duplicated");
    if (await page.locator("#menuButton").count() !== 1)
      throw new Error("main menu trigger missing or duplicated");
    if (await page.locator("#vnv-language-rail").count() !== 1)
      throw new Error("local language rail missing or duplicated");
    const criticalMissing = missing.filter(x => /\.(js|css|json|webmanifest)$/i.test(x.path));
    if (criticalMissing.length) throw new Error("local missing dependencies: " + JSON.stringify(criticalMissing));
    await page.screenshot({ path: path.join(out, name + "-preview.png"), fullPage: false });
    Object.assign(result, { state: "PASS", catalogStatus: status,
      initialLinks: initialResults, filteredLinks: filteredResults,
      networkTicker: 1, menuButton: 1, languageRail: 1 });
  } catch (error) {
    result.state = "FAIL";
    result.reason = String(error.message || error).slice(0, 900);
    await page.screenshot({ path: path.join(out, name + "-failure.png"), fullPage: false }).catch(() => {});
  }
  result.pageErrors = pageErrors;
  result.local404 = missing;
  report.cases.push(result);
  report.errors.push(...pageErrors.map(e => ({ viewport: name, message: e })));
  report.missingSameOriginResources.push(...missing.map(m => ({ viewport: name, ...m })));
  await context.close();
}
try {
  await verifyViewport("desktop", { width: 1440, height: 900 });
  await verifyViewport("mobile", { width: 390, height: 844 });
} finally {
  await browser.close();
  fs.writeFileSync(path.join(out, "browser-preview-receipt.json"),
    JSON.stringify(report, null, 2) + "\n");
}
console.log(JSON.stringify(report.cases.map(({name,state,reason,catalogStatus}) =>
  ({name,state,reason,catalogStatus})), null, 2));
if (report.cases.some(x => x.state !== "PASS")) process.exitCode = 2;
