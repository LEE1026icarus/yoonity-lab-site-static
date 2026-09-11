import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const layoutPath = new URL("../src/app/layout.tsx", import.meta.url);
const globalsPath = new URL("../src/app/globals.css", import.meta.url);
const packagePath = new URL("../package.json", import.meta.url);

test("the primary font stack does not depend on a late-loading web font", async () => {
  const [layout, globals, packageJson] = await Promise.all([
    readFile(layoutPath, "utf8"),
    readFile(globalsPath, "utf8"),
    readFile(packagePath, "utf8"),
  ]);

  assert.doesNotMatch(layout, /pretendard\/dist\/web/);
  assert.match(globals, /--font-sans:\s*-apple-system,\s*BlinkMacSystemFont/);
  assert.doesNotMatch(globals, /"Pretendard Variable"/);
  assert.equal(JSON.parse(packageJson).dependencies.pretendard, undefined);
});
