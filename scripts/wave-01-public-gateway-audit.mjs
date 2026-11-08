#!/usr/bin/env node
/**
 * Wave 01: source-only inspection of the VNV public gateway candidate.
 * This code does not fetch repositories, publish files, or access STOS.
 * Exit success means the REPORT was generated and pinned source matched;
 * it DOES NOT mean the site is ready for cutover.
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const index = readFileSync(resolve(root, "index.html"));
const blob = createHash("sha1").update(`blob ${index.length}\0`).update(index).digest("hex");
const sha256 = createHash("sha256").update(index).digest("hex");
const expected = "a883f035329a89e55d526160c54ffdac3c7af2f9";
const refs = [...index.toString("utf8").matchAll(/<(?:script|link)\b[^>]*?\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)]
  .map(m => m[1]);
const sameOriginPaths = [...new Set(refs.filter(x => !/^(?:[a-z]+:|\/\/|#|data:)/i.test(x)).map(x => {
  const path = x.split(/[?#]/)[0];
  const normalized = path.replace(/^\/+/, "");
  if (!normalized || normalized.includes("..") || normalized.includes("\\")) return null;
  return normalized;
}).filter(Boolean))].sort();
const resources = sameOriginPaths.map(path => ({ path, presentInGatewayRepo: existsSync(resolve(root, path)) }));
const missing = resources.filter(x => !x.presentInGatewayRepo).map(x => x.path);
const report = {
  schema: "vnv-incremental-migration-wave-01-v1",
  auditOnly: true,
  promotionAuthorized: false,
  repository: "KhaemenesAcademy/vervenveda.github.io",
  originalRepository: "vervenveda/vervenveda.github.io",
  originalPinnedCommit: "836bdb78769f70b255e5c0bc7773b6f6de61a28d",
  referenceIndexGitBlob: expected,
  candidateIndexGitBlob: blob,
  candidateIndexSha256: sha256,
  sourceParity: blob === expected ? "PASS" : "FAIL",
  localDirectResourceCount: resources.length,
  localDirectResources: resources,
  missingLocalDirectResources: missing,
  publicAssetIndependence: missing.length === 0 ? "STATIC_DIRECT_REFERENCES_PRESENT_ONLY" : "HOLD",
  unverified: [
    "Dynamic JavaScript fetch targets, deep paths, host routing and public HTTPS",
    "Verified live source server, STOS import and sovereign storage commissioning",
    "STOS authorization, deployment, rollback and external functional checks"
  ],
  cutoverReady: false
};
const out = process.env.VNV_AUDIT_OUTPUT || "wave-01-report.json";
writeFileSync(resolve(root, out), JSON.stringify(report, null, 2) + "\n", { flag: "w" });
console.log(`SOURCE_PARITY=${report.sourceParity}`);
console.log(`LOCAL_RESOURCES_CHECKED=${resources.length}`);
console.log(`MISSING_FROM_SIMPLIFIED_REPOSITORY=${missing.length}`);
missing.forEach(x => console.log(`MISSING=${x}`));
console.log("CUTOVER=HOLD (audit only; no STOS or domain changes)");
if (blob !== expected) process.exitCode = 2;
