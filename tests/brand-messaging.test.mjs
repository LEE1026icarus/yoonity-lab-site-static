import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const copyPath = new URL("../src/data/site-copy.ts", import.meta.url);
const homePath = new URL("../src/app/page.tsx", import.meta.url);
const axesComponentPath = new URL("../src/components/research-axes.tsx", import.meta.url);
const axesDataPath = new URL("../src/data/research-axes.ts", import.meta.url);
const processComponentPath = new URL("../src/components/process-steps.tsx", import.meta.url);
const articlesPath = new URL("../src/components/related-articles.tsx", import.meta.url);
const professorPath = new URL("../src/app/professor/page.tsx", import.meta.url);
const activitiesPath = new URL("../src/app/activities/page.tsx", import.meta.url);
const publicationsPath = new URL("../src/app/publications/page.tsx", import.meta.url);
const researchersPath = new URL("../src/app/researchers/page.tsx", import.meta.url);
const layoutPath = new URL("../src/app/layout.tsx", import.meta.url);
const aboutPath = new URL("../src/app/about/page.tsx", import.meta.url);
const headerPath = new URL("../src/components/site-header.tsx", import.meta.url);
const footerPath = new URL("../src/components/site-footer.tsx", import.meta.url);

test("site copy preserves the approved positioning and audience priority", async () => {
  const copy = await readFile(copyPath, "utf8");
  assert.match(copy, /복잡한 산업 문제를, 검증 가능한 해법으로\./);
  assert.match(copy, /현장의 문제에서 출발해/);
  assert.match(copy, /협업 논의하기/);
  assert.match(copy, /연구 참여 알아보기/);
  assert.match(copy, /yoonity25@gmail\.com/);
  assert.ok(copy.indexOf("협업 논의하기") < copy.indexOf("연구 참여 알아보기"));
});

test("shared pages use one collaboration-first message and contact", async () => {
  const [layout, about, header, footer] = await Promise.all([
    readFile(layoutPath, "utf8"),
    readFile(aboutPath, "utf8"),
    readFile(headerPath, "utf8"),
    readFile(footerPath, "utf8"),
  ]);
  assert.match(layout, /산업 문제 해결형 AI 연구실/);
  assert.match(about, /siteCopy\.brand\.headline/);
  assert.match(about, /siteCopy\.home\.meetingCta/);
  assert.match(header, /산학협력/);
  assert.match(footer, /siteCopy\.contact\.collaborationEmail/);
  assert.doesNotMatch(footer, /koreatechbigdatalab@gmail\.com/);
});

test("capabilities support one problem-led research process", async () => {
  const [axesComponent, axesData, processComponent] = await Promise.all([
    readFile(axesComponentPath, "utf8"),
    readFile(axesDataPath, "utf8"),
    readFile(processComponentPath, "utf8"),
  ]);
  assert.match(axesComponent, /세 가지 역량, 하나의 문제 해결 방식/);
  assert.match(axesComponent, /문제에 맞는 기술을 선택합니다/);
  assert.match(processComponent, /문제를 정의하고, 설계하고, 검증합니다/);
  assert.match(axesData, /미래 적용 가능성과 조직의 준비 조건/);
});

test("existing records are framed as credibility evidence", async () => {
  const [articles, professor, activities, publications, researchers] =
    await Promise.all([
      readFile(articlesPath, "utf8"),
      readFile(professorPath, "utf8"),
      readFile(activitiesPath, "utf8"),
      readFile(publicationsPath, "utf8"),
      readFile(researchersPath, "utf8"),
    ]);
  assert.match(articles, /연구와 현장을 연결한 기록/);
  assert.match(professor, /산업 경험과 학술 연구를 연결합니다/);
  assert.match(activities, /현장의 문제를 과제와 성과로/);
  assert.match(publications, /검증한 질문과 축적한 지식/);
  assert.match(researchers, /실제 문제를 함께 연구하는 사람들/);
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
