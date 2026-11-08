#!/usr/bin/env node
/**
 * A local rehearsal of public master-pointer advancement and rollback only.
 * This does not publish files, mutate repository sources, or authorize release.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
const sha256=b=>createHash("sha256").update(b).digest("hex");
const original=fs.readFileSync("source-pinned/ecosystem/master-ecosystem-directory.json");
const candidate=fs.readFileSync("wave-06-candidate/atomic-pointer-preview.json");
const candidateManifest=JSON.parse(fs.readFileSync("wave-06-candidate/candidate-manifest.json","utf8"));
assert.equal(sha256(candidate),candidateManifest.atomicPointerPreview.sha256);
const activeOld=JSON.parse(original),activeNew=JSON.parse(candidate);
assert.deepEqual(activeOld.pageCatalog.parts,["/registry/ecosystem-pages-a.json","/registry/ecosystem-pages-b.json"]);
assert.deepEqual(activeNew.pageCatalog.parts,candidateManifest.atomicPointerPreview.versionedParts);
assert.equal(activeNew.pageCatalog.publicPageCount,activeOld.pageCatalog.publicPageCount);
const temp=fs.mkdtempSync(path.join(os.tmpdir(),"vnv-wave-06-rollback-"));
const active=path.join(temp,"active-master.json");
const snapshot=path.join(temp,"previous-master.json");
const staged=path.join(temp,"staged-master.json");
function replaceAtomic(target,payload){const t=target+".new";fs.writeFileSync(t,payload);fs.renameSync(t,target);}
try {
  fs.writeFileSync(active,original);
  fs.writeFileSync(snapshot,fs.readFileSync(active));
  fs.writeFileSync(staged,candidate);
  // No file is promoted unless the entire immutable pair has already passed integrity checks.
  assert.equal(candidateManifest.integrity,"PASS");
  assert.equal(candidateManifest.files.length,3);
  assert.equal(candidateManifest.publicPublicationApproved,false);
  replaceAtomic(active,fs.readFileSync(staged));
  assert.equal(sha256(fs.readFileSync(active)),sha256(candidate));
  // Rehearse operator-initiated rollback in a private temporary directory only.
  replaceAtomic(active,fs.readFileSync(snapshot));
  assert.equal(sha256(fs.readFileSync(active)),sha256(original));
  assert.deepEqual(JSON.parse(fs.readFileSync(active)).pageCatalog.parts,activeOld.pageCatalog.parts);
  const report={schema:"vnv-wave-06-rollback-rehearsal-v1",scope:"TEMPORARY_LOCAL_FILES_ONLY",
    candidateHash:sha256(candidate),previousMasterHash:sha256(original),
    stagedPointerAdvancement:"SIMULATED_PASS",
    previousManifestRollback:"SIMULATED_PASS",externalAssetsPreviouslyReachable:"NOT_VERIFIED",
    activePublicSiteModified:false,releaseAuthorized:false};
  fs.writeFileSync("wave-06-rollback-rehearsal.json",JSON.stringify(report,null,2)+"\n");
  console.log("TEMP_POINTER_ADVANCE=PASS TEMP_POINTER_ROLLBACK=PASS LIVE_POINTER=UNTOUCHED");
} finally {fs.rmSync(temp,{recursive:true,force:true});}
