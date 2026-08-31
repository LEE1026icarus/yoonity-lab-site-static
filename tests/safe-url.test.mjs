import test from "node:test";
import assert from "node:assert/strict";
import { safeHttpUrl } from "../src/lib/safe-url.ts";

test("safeHttpUrl accepts HTTPS URLs and normalizes whitespace", () => {
  assert.equal(safeHttpUrl("  https://example.com/path  "), "https://example.com/path");
});

test("safeHttpUrl rejects executable, insecure, malformed, and empty URLs", () => {
  for (const value of [
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "http://example.com",
    "not a URL",
    "",
    undefined,
  ]) {
    assert.equal(safeHttpUrl(value), undefined);
  }
});
