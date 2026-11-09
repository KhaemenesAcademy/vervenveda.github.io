#!/usr/bin/env python3
"""Read-only HTTP snapshot of selected current VNV cross-account project routes.

Not a post-cutover test. This tool never edits DNS, GitHub or STOS. HTTP
errors and network restrictions are recorded as observations, not treated as
conclusive evidence that the web application is permanently unreachable.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

TARGETS = (
    ("gateway", "https://vervenveda.com/"),
    ("academy-family", "https://vervenveda.com/Khaemenes_Academy.github.io/family/"),
    ("academy-adult", "https://vervenveda.com/Khaemenes_Academy.github.io/adult/"),
    ("academy-home", "https://vervenveda.com/KhaemenesAcademy_Home.github.io/"),
    ("academy-student", "https://vervenveda.com/Khaemenes_Academy.github.io/student/"),
    ("high-school-09-profile", "https://vervenveda.com/Khaemenes_High.github.io/grades/grade-09/student-profile/"),
    ("linguistics-loader", "https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1"),
    ("pages-academy-family", "https://vervenveda.github.io/Khaemenes_Academy.github.io/family/"),
    ("pages-high-school", "https://vervenveda.github.io/Khaemenes_High.github.io/grades/grade-09/student-profile/"),
)

def observe(name: str, url: str) -> dict:
    record = {"name": name, "requested": url, "observation": "UNKNOWN"}
    request = Request(url, headers={"User-Agent": "VNV-Gateway-Route-ReadOnly-Audit/1.0",
                                    "Accept": "text/html,application/javascript,*/*"})
    try:
        with urlopen(request, timeout=12) as response:
            prefix = response.read(512)
            record.update({"observation": "HTTP_RESPONSE",
                           "status": response.status,
                           "finalUrl": response.geturl(),
                           "contentType": response.headers.get("Content-Type", ""),
                           "sampleBytes": len(prefix)})
    except HTTPError as exc:
        record.update({"observation": "HTTP_ERROR", "status": exc.code,
                       "finalUrl": exc.geturl()})
    except (URLError, OSError, TimeoutError, ValueError) as exc:
        record.update({"observation": "NETWORK_UNVERIFIED",
                       "detail": type(exc).__name__})
    return record

def main() -> int:
    results = [observe(name, url) for name, url in TARGETS]
    print(json.dumps({
        "schema": "vnv-live-route-precutover-observation-v1",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "method": "unauthenticated GET, 512-byte prefix",
        "preCutoverOnly": True,
        "domainMigrationApproved": False,
        "routingAfterDomainMove": "UNVERIFIED",
        "routes": results,
    }, indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
