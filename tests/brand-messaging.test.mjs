import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const copyPath = new URL("../src/data/site-copy.ts", import.meta.url);
const homePath = new URL("../src/app/page.tsx", import.meta.url);

test("site copy preserves the approved positioning and audience priority", async () => {
  const copy = await readFile(copyPath, "utf8");
  assert.match(copy, /복잡한 산업 문제를, 검증 가능한 해법으로\./);
  assert.match(copy, /현장의 문제에서 출발해/);
  assert.match(copy, /협업 논의하기/);
  assert.match(copy, /연구 참여 알아보기/);
  assert.match(copy, /yoonity25@gmail\.com/);
  assert.ok(copy.indexOf("협업 논의하기") < copy.indexOf("연구 참여 알아보기"));
});

test("home leads with collaboration and keeps recruitment secondary", async () => {
  const home = await readFile(homePath, "utf8");
  assert.match(home, /siteCopy\.brand\.headline/);
  assert.match(home, /siteCopy\.home\.primaryCta/);
  assert.match(home, /siteCopy\.home\.secondaryCta/);
  assert.match(home, /siteCopy\.home\.collaborationTitle/);
  assert.match(home, /encodeURIComponent\(siteCopy\.contact\.meetingSubject\)/);
  assert.ok(home.indexOf("primaryCta") < home.indexOf("secondaryCta"));
});
