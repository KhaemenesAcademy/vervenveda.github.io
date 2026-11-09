"""No-network test suite for VNV Gateway cutover inventory."""
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "vnv-gateway-cutover-audit.py"
spec = importlib.util.spec_from_file_location("vnv_cutover_audit", SCRIPT)
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


class GatewayCutoverTests(unittest.TestCase):
    def test_inventory_identifies_missing_but_master_present(self):
        html = """<link href="/assets/local.css"><script src="/assets/missing.js"></script>
        <a href="https://vervenveda.com/Khaemenes_Academy.github.io/student/">Student</a>
        <script>const source="/ecosystem/master-ecosystem-directory.json";</script>"""
        gateway = {"index.html", "assets/local.css"}
        master = gateway | {"assets/missing.js", "ecosystem/master-ecosystem-directory.json",
                            "registry/ecosystem-pages-a.json",
                            "registry/ecosystem-pages-b.json"}
        result = audit.inspect(html, gateway, master)
        self.assertEqual(result["decision"], "HOLD")
        self.assertIn("assets/missing.js", result["missingGatewayDependencies"])
        self.assertIn("registry/ecosystem-pages-a.json",
                      result["missingGatewayDependencies"])
        self.assertEqual(result["crossAccountProjectRouteCount"], 1)
        self.assertFalse(result["cutoverReady"])

    def test_url_queries_and_dynamic_interpolation(self):
        html = """<script src="assets/app.js?v=2"></script>
        <a href="${escapeAttribute(page.url)}">Dynamic</a>"""
        result = audit.inspect(html, {"assets/app.js"}, {"assets/app.js"})
        self.assertEqual(result["missingGatewayDependencyCount"], 0)
        self.assertEqual(result["directDependencyCount"], 1)

    def test_literal_javascript_src_assignment_is_a_dependency(self):
        html = '<script>probe.src="/assets/optional-diagnostic.js?v=1";</script>'
        result = audit.inspect(html, set(), {"assets/optional-diagnostic.js"})
        self.assertIn("assets/optional-diagnostic.js",
                      result["missingGatewayDependencies"])

    def test_unverified_does_not_mean_cutover_ready(self):
        html = '<script src="assets/app.js"></script>'
        result = audit.inspect(html, {"assets/app.js"}, {"assets/app.js"})
        self.assertEqual(result["decision"], "REVIEW_REQUIRED")
        self.assertFalse(result["cutoverReady"])

    def test_path_safety_and_truncated_tree(self):
        for path in ("/../secrets/x", "assets/../../x.js", "data:text/plain,test"):
            self.assertIsNone(audit.local_path(path))
        with tempfile.TemporaryDirectory() as temp:
            tree = Path(temp) / "tree.json"
            tree.write_text(json.dumps({"truncated": True, "tree": []}))
            with self.assertRaises(ValueError):
                audit.paths_from_tree(tree)


if __name__ == "__main__":
    unittest.main()
