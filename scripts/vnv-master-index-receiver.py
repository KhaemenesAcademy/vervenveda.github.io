#!/usr/bin/env python3
"""One-way, fail-closed full-index synchronization from VNV master to public gateway.

Only --check is used by offline PR regressions. --apply is reserved for a
separately reviewed protected main-branch workflow, never a public browser.
"""
from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path

SOURCE = "vervenveda/vervenveda.github.io"
TARGET = "KhaemenesAcademy/vervenveda.github.io"


def git(repo: Path, *arguments: str) -> str:
    return subprocess.check_output(["git", "-C", str(repo), *arguments], text=True).strip()


def index_history(repo: Path) -> list[str]:
    commits = git(repo, "log", "--format=%H", "--", "index.html").splitlines()
    return [git(repo, "rev-parse", f"{commit}:index.html") for commit in commits]


def classify(master_current: str, gateway_current: str,
             master_history: list[str], gateway_history: list[str]) -> dict:
    if master_current == gateway_current:
        return {"decision": "MATCH", "common": master_current}
    gateway_known = set(gateway_history)
    common = next((digest for digest in master_history if digest in gateway_known), None)
    if common is None:
        return {"decision": "HOLD_NO_COMMON_BASELINE", "common": None}
    if gateway_current != common:
        return {"decision": "HOLD_GATEWAY_EDITED", "common": common}
    if master_current == common:
        return {"decision": "HOLD_MASTER_NOT_AHEAD", "common": common}
    return {"decision": "RECEIVE_MASTER", "common": common}


def inspect(master: Path, gateway: Path) -> dict:
    master_blob = git(master, "rev-parse", "HEAD:index.html")
    gateway_blob = git(gateway, "rev-parse", "HEAD:index.html")
    outcome = classify(master_blob, gateway_blob, index_history(master),
                       index_history(gateway))
    return {"schema": "vnv-index-receiver-evidence-v1",
            "master": SOURCE, "gateway": TARGET,
            "masterCommit": git(master, "rev-parse", "HEAD"),
            "gatewayCommit": git(gateway, "rev-parse", "HEAD"),
            "masterIndexBlob": master_blob, "gatewayIndexBlob": gateway_blob,
            **outcome}


def apply(master: Path, gateway: Path, evidence: dict) -> None:
    if evidence["decision"] != "RECEIVE_MASTER":
        raise ValueError("No authorized update decision")
    if git(gateway, "status", "--porcelain"):
        raise ValueError("Gateway worktree not clean")
    if git(master, "rev-parse", "HEAD") != evidence["masterCommit"]:
        raise ValueError("Master changed during verification")
    if git(gateway, "rev-parse", "HEAD") != evidence["gatewayCommit"]:
        raise ValueError("Gateway changed during verification")

    data = (master / "index.html").read_bytes()
    if not data or git(master, "hash-object", "index.html") != evidence["masterIndexBlob"]:
        raise ValueError("Invalid master index bytes")
    (gateway / "index.html").write_bytes(data)
    if git(gateway, "hash-object", "index.html") != evidence["masterIndexBlob"]:
        raise ValueError("Gateway index byte mismatch")
    subprocess.run(["git", "-C", str(gateway), "add", "--", "index.html"], check=True)
    staged = git(gateway, "diff", "--cached", "--name-only").splitlines()
    if staged != ["index.html"]:
        raise ValueError("Unexpected staged file; refusing commit")
    subprocess.run(["git", "-C", str(gateway), "config", "user.name",
                    "VNV Master Index Receiver"], check=True)
    subprocess.run(["git", "-C", str(gateway), "config", "user.email",
                    "github-actions[bot]@users.noreply.github.com"], check=True)
    subprocess.run(["git", "-C", str(gateway), "commit", "-m",
                    "chore(sync): receive master index.html only"], check=True)
    # A protected/changed main branch rejects this non-force push.
    subprocess.run(["git", "-C", str(gateway), "push", "origin", "HEAD:main"], check=True)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--master", type=Path, required=True)
    parser.add_argument("--gateway", type=Path, default=Path.cwd())
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    evidence = inspect(args.master.resolve(), args.gateway.resolve())
    print(json.dumps(evidence, indent=2))
    if evidence["decision"].startswith("HOLD_"):
        return 2
    if args.apply and evidence["decision"] == "RECEIVE_MASTER":
        apply(args.master.resolve(), args.gateway.resolve(), evidence)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
