"""Offline verification for preview-only public dependency allowlist."""
import importlib.util
import tempfile
import unittest
from pathlib import Path

MOD = Path(__file__).resolve().parents[1] / "scripts" / "build_public_dependency_preview.py"
spec = importlib.util.spec_from_file_location("public_preview", MOD)
preview = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preview)

class PublicDependencyPreviewTests(unittest.TestCase):
    def test_exact_allowed_file_inventory_and_repository_immutability(self):
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            master, gateway, out = (base / x for x in ("master", "gateway", "preview"))
            for root in (master, gateway):
                (root / "assets").mkdir(parents=True)
            (gateway / "index.html").write_text("PUBLIC GATEWAY")
            (gateway / "assets" / "unique.css").write_text("gateway design")
            (master / "assets" / "unique.css").write_text("different master design")
            for path in preview.REQUIRED_PUBLIC:
                p = master / path
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text("master public file: " + path)
            result = preview.stage(gateway, master, out)
            self.assertEqual(result["mode"], "PREVIEW_ONLY")
            self.assertEqual(result["repositoryWrites"], 0)
            self.assertEqual(len(result["publicMasterDependencies"]), 11)
            self.assertEqual((out / "assets" / "unique.css").read_text(), "gateway design")
            self.assertEqual((gateway / "index.html").read_text(), "PUBLIC GATEWAY")
            self.assertFalse((gateway / "registry").exists())

    def test_missing_file_fail_closed(self):
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            (base / "gateway").mkdir()
            (base / "master").mkdir()
            (base / "gateway" / "index.html").write_text("home")
            with self.assertRaises(ValueError):
                preview.stage(base / "gateway", base / "master", base / "preview")

    def test_symlink_and_unsafe_destination_are_refused(self):
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            (base / "gateway").mkdir()
            (base / "master").mkdir()
            (base / "gateway" / "index.html").write_text("home")
            (base / "gateway" / "assets").mkdir()
            (base / "gateway" / "assets" / "link.css").symlink_to(
                base / "gateway" / "index.html")
            with self.assertRaises(ValueError):
                preview.validate_safe_regular_file(base / "gateway", "assets/link.css")
            with self.assertRaises(ValueError):
                preview.stage(base / "gateway", base / "master", base / "gateway" / "preview")

if __name__ == "__main__":
    unittest.main()
