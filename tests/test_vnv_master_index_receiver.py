"""Regression checks for the one-way VNV index receiver."""
import importlib.util
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "vnv-master-index-receiver.py"
spec = importlib.util.spec_from_file_location("vnv_receiver", SCRIPT)
receiver = importlib.util.module_from_spec(spec)
spec.loader.exec_module(receiver)


class IndexReceiverTests(unittest.TestCase):
    def test_identical_homepages_noop(self):
        actual = receiver.classify("b", "b", ["b", "a"], ["b", "a"])
        self.assertEqual(actual["decision"], "MATCH")

    def test_master_ahead_gateway_unchanged(self):
        actual = receiver.classify("c", "a", ["c", "b", "a"], ["a"])
        self.assertEqual(actual["decision"], "RECEIVE_MASTER")
        self.assertEqual(actual["common"], "a")

    def test_gateway_edit_never_writes_upstream(self):
        actual = receiver.classify("a", "z", ["a"], ["z", "a"])
        self.assertEqual(actual["decision"], "HOLD_GATEWAY_EDITED")

    def test_both_modified_hold(self):
        actual = receiver.classify("b", "z", ["b", "a"], ["z", "a"])
        self.assertEqual(actual["decision"], "HOLD_GATEWAY_EDITED")

    def test_no_shared_history_hold(self):
        actual = receiver.classify("b", "z", ["b", "a"], ["z", "x"])
        self.assertEqual(actual["decision"], "HOLD_NO_COMMON_BASELINE")

    def test_master_rolled_back_gateway_later_revision_hold(self):
        actual = receiver.classify("a", "b", ["a", "b"], ["b", "a"])
        self.assertEqual(actual["decision"], "HOLD_GATEWAY_EDITED")

    def test_only_index_can_be_staged(self):
        evidence = {"decision": "RECEIVE_MASTER", "masterCommit": "ma",
                    "gatewayCommit": "ga", "masterIndexBlob": "blob"}
        with tempfile.TemporaryDirectory() as temp:
            base = Path(temp)
            master = base / "master"
            gateway = base / "gateway"
            master.mkdir()
            gateway.mkdir()
            (master / "index.html").write_bytes(b"valid index")
            def fake_git(repo, *args):
                if args == ("status", "--porcelain"):
                    return ""
                if args == ("rev-parse", "HEAD"):
                    return "ma" if repo == master else "ga"
                if args == ("hash-object", "index.html"):
                    return "blob"
                if args == ("diff", "--cached", "--name-only"):
                    return "index.html\nassets/private.txt"
                raise AssertionError((repo, args))
            with patch.object(receiver, "git", side_effect=fake_git):
                with patch.object(receiver.subprocess, "run") as run:
                    with self.assertRaises(ValueError):
                        receiver.apply(master, gateway, evidence)
                    self.assertFalse(any("push" in str(call) for call in run.call_args_list))


if __name__ == "__main__":
    unittest.main()
