#!/usr/bin/env python3
"""Stage a *preview artifact only* of public Gateway runtime dependencies.

No writes to either Git repository, no production deployment, and no STOS API.
This explicit list is a review contract, not an authorization to make the
Gateway mirror any master folder or to auto-sync supporting assets.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import shutil
from pathlib import Path

SOURCE_REPOSITORY = "vervenveda/vervenveda.github.io"
TARGET_REPOSITORY = "KhaemenesAcademy/vervenveda.github.io"

# Exact public files inspected in the full master. Do not glob directories.
REQUIRED_PUBLIC = (
    "site.webmanifest",
    "icon-192.png",
    "apple-touch-icon.png",
    "privacy-policy.html",
    "assets/khaemenes-interlingual-core.js",
    "assets/vnv-language.js",
    "assets/vnv-ticker-autopopulate.js",
    "assets/vnv-gateway-chrome-forensic-probe.js",
    "ecosystem/master-ecosystem-directory.json",
    "registry/ecosystem-pages-a.json",
    "registry/ecosystem-pages-b.json",
)

def validate_safe_regular_file(root: Path, relative: str) -> Path:
    parts = Path(relative).parts
    if (not parts or Path(relative).is_absolute()
            or any(x in ("", ".", "..") for x in parts)
            or any(x.startswith(".") for x in parts)):
        raise ValueError(f"unsafe path: {relative!r}")
    target = root / relative
    if not target.is_file() or target.is_symlink():
        raise ValueError(f"missing or non-regular public dependency: {relative}")
    resolved = target.resolve()
    if not resolved.is_relative_to(root.resolve()):
        raise ValueError(f"outside source root: {relative}")
    return target

def stage(gateway_root: Path, master_root: Path, output: Path) -> dict:
    gateway_root, master_root, output = (
        gateway_root.resolve(), master_root.resolve(), output.resolve())
    if output.is_relative_to(gateway_root) or output.is_relative_to(master_root):
        raise ValueError("preview output cannot be inside a source repository")
    if output.exists() and any(output.iterdir()):
        raise ValueError("preview output must be an empty directory")

    gateway_paths = ("index.html", *sorted(
        p.relative_to(gateway_root).as_posix()
        for p in (gateway_root / "assets").rglob("*")
        if p.is_file() and not p.is_symlink()
    ))
    copied = []
    for relative in gateway_paths:
        source = validate_safe_regular_file(gateway_root, relative)
        target = output / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        copied.append({"path": relative, "origin": "gateway",
                       "sha256": hashlib.sha256(target.read_bytes()).hexdigest()})

    staged_master = []
    for relative in REQUIRED_PUBLIC:
        source = validate_safe_regular_file(master_root, relative)
        target = output / relative
        if target.exists():
            raise ValueError(f"conflicting public preview dependency: {relative}")
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        sha = hashlib.sha256(target.read_bytes()).hexdigest()
        staged_master.append({"path": relative, "origin": SOURCE_REPOSITORY,
                              "sha256": sha, "bytes": target.stat().st_size})

    if not (output / "index.html").read_bytes() == (
            gateway_root / "index.html").read_bytes():
        raise ValueError("homepage byte parity was lost in preview")
    return {
        "schema": "vnv-public-dependency-preview-v1",
        "mode": "PREVIEW_ONLY",
        "gateway": TARGET_REPOSITORY,
        "master": SOURCE_REPOSITORY,
        "indexOnlyAutomaticSync": True,
        "gatewayFileCount": len(copied),
        "publicMasterDependencies": staged_master,
        "reviewOnly": True,
        "repositoryWrites": 0,
        "stosOperations": 0,
        "domainCutoverApproved": False,
        "limitations": [
            "Artifact is not an active web site and cannot certify live routes.",
            "Only enumerated public paths are copied into a runner-local preview.",
            "No automatic synchronization of supporting files is authorized.",
            "Dynamic transitive imports, CORS, redirects and DNS need browser checks."
        ]
    }

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--gateway", required=True, type=Path)
    parser.add_argument("--master", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    opts = parser.parse_args()
    result = stage(opts.gateway, opts.master, opts.output)
    print(json.dumps(result, indent=2, ensure_ascii=True))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
