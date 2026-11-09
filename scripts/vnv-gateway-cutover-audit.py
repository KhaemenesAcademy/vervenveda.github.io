#!/usr/bin/env python3
"""Read-only VNV Gateway dependency and domain-cutover readiness inventory.

Never modifies the gateway, master, DNS, or STOS. JSON goes to stdout only.
Missing resources are explicitly not repaired by mirroring master assets:
the index-only boundary remains authoritative.
"""
from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

CANONICAL_JSON = "/ecosystem/master-ecosystem-directory.json"
CATALOG_SHARDS = ("/registry/ecosystem-pages-a.json",
                  "/registry/ecosystem-pages-b.json")
ROUTE_HOSTS = {"vervenveda.com", "www.vervenveda.com"}
CSS_JS = {".css", ".js", ".json", ".webmanifest", ".png", ".ico", ".html"}
FETCH_LITERAL = re.compile(r'\bfetch\s*\(\s*["\x27](/[^"\x27]+)["\x27]', re.I)
SOURCE_LITERAL = re.compile(r'\bconst\s+source\s*=\s*["\x27](/[^"\x27]+)["\x27]')
SHARD_FALLBACK = re.compile(r'/registry/ecosystem-pages-[ab]\.json')

JS_SRC_LITERAL = re.compile(r'\\b[A-Za-z_$][\\w$]*\\.src\\s*=\\s*["\\x27](/[^"\\x27]+)["\\x27]')


class DirectRefs(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag not in {"script", "link", "img", "a", "source"}:
            return
        attributes = dict(attrs)
        for attr in ("src", "href"):
            value = attributes.get(attr)
            if value and not any(t in value for t in ("${", "{{", "<%")):
                self.refs.add(value)


def local_path(value: str) -> str | None:
    if not value or value.startswith(("#", "//", "data:", "mailto:", "tel:")):
        return None
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc:
        return None
    path = unquote(parsed.path)
    if not path or "\\" in path or "\x00" in path:
        return None
    parts = path.lstrip("/").split("/")
    if any(x in {"", ".", ".."} for x in parts):
        return None
    return "/".join(parts)


def inspect(index: str, gateway_paths: set[str], master_paths: set[str]) -> dict:
    parser = DirectRefs()
    parser.feed(index)
    same_origin = set(parser.refs)
    same_origin.update(FETCH_LITERAL.findall(index))
    same_origin.update(SOURCE_LITERAL.findall(index))
    same_origin.update(JS_SRC_LITERAL.findall(index))
    # The catalogue is declared dynamically by the canonical registry.
    # It is a runtime contract even if the shard names are not literal in HTML.
    if CANONICAL_JSON in same_origin:
        same_origin.update(CATALOG_SHARDS)
    required = sorted({p for value in same_origin if (p := local_path(value))})
    evidence = [
        {"path": path,
         "gateway": "PRESENT" if path in gateway_paths else "MISSING",
         "master": "PRESENT" if path in master_paths else "NOT_IN_MASTER"}
        for path in required
    ]
    missing = [x["path"] for x in evidence if x["gateway"] == "MISSING"]
    external = sorted({urlsplit(v).netloc.lower() for v in parser.refs
                       if urlsplit(v).scheme in {"http", "https"}})
    domain_routes = sorted({v for v in parser.refs
                           if urlsplit(v).netloc.lower() in ROUTE_HOSTS
                           and urlsplit(v).path.startswith("/")
                           and urlsplit(v).path != "/"})
    # Check only static URL references. Dynamic JS navigation remains unverified.
    project_routes = sorted({urlsplit(v).path for v in domain_routes
                             if ".github.io/" in urlsplit(v).path})
    return {
        "schema": "vnv-gateway-cutover-readiness-v1",
        "mode": "READ_ONLY",
        "gateway": "KhaemenesAcademy/vervenveda.github.io",
        "master": "vervenveda/vervenveda.github.io",
        "indexOnlySyncContract": True,
        "directDependencyCount": len(evidence),
        "directDependencies": evidence,
        "missingGatewayDependencyCount": len(missing),
        "missingGatewayDependencies": missing,
        "hardcodedVervenvedaDomainRouteCount": len(domain_routes),
        "hardcodedVervenvedaDomainRoutes": domain_routes,
        "crossAccountProjectRouteCount": len(project_routes),
        "crossAccountProjectRoutes": project_routes,
        "externalHosts": external,
        "unverified": [
            "Server-side URL routing and domain ownership after cutover",
            "Dynamically assembled routes and runtime network request success",
            "Cross-origin policies for any proposed shared authoritative JSON",
            "Live browser ticker, menu, translator and account links",
            "STOS admission, terminal activation and deployment"
        ],
        "cutoverReady": False,
        "decision": "HOLD" if missing or project_routes else "REVIEW_REQUIRED",
    }


def paths_from_tree(tree_path: Path) -> set[str]:
    obj = json.loads(tree_path.read_text(encoding="utf-8"))
    if not isinstance(obj, dict) or not isinstance(obj.get("tree"), list):
        raise ValueError("Invalid Git tree JSON")
    if obj.get("truncated"):
        raise ValueError("Truncated Git tree; cannot certify dependency completeness")
    return {x["path"] for x in obj["tree"]
            if x.get("type") == "blob" and isinstance(x.get("path"), str)}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--gateway", type=Path, default=Path.cwd())
    ap.add_argument("--master-tree-json", type=Path, required=True)
    opts = ap.parse_args()
    gateway = opts.gateway.resolve()
    source = (gateway / "index.html").read_text(encoding="utf-8")
    paths = {str(x.relative_to(gateway)).replace("\\", "/") for x in gateway.rglob("*")
             if x.is_file() and ".git" not in x.relative_to(gateway).parts}
    result = inspect(source, paths, paths_from_tree(opts.master_tree_json))
    print(json.dumps(result, indent=2, ensure_ascii=True))
    # A HOLD is an accurate audit result; do not confuse with script failure.
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
