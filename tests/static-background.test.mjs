import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const scenePath = new URL(
  "../src/components/background-scene.tsx",
  import.meta.url,
);
const packagePath = new URL("../package.json", import.meta.url);

test("background is a static gradient without WebGL or client animation", async () => {
  const scene = await readFile(scenePath, "utf8");
  const packageJson = JSON.parse(await readFile(packagePath, "utf8"));

  assert.match(scene, /radial-gradient/);
  assert.doesNotMatch(scene, /use client|canvas|requestAnimationFrame|THREE|gsap/);
  assert.equal(packageJson.dependencies.three, undefined);
  assert.equal(packageJson.dependencies.gsap, undefined);
  assert.equal(packageJson.devDependencies["@types/three"], undefined);
});
