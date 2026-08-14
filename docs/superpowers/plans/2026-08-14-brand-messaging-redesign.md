# Yoonity Brand Messaging Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite Yoonity Lab's website messaging so industry–academia collaboration managers understand the lab as an industry-problem-solving research partner and can immediately send an inquiry or request a meeting, while prospective researchers retain a clear secondary path.

**Architecture:** Keep frequently changed records in the existing data and Sheets layer, but centralize stable public-facing brand copy in one typed module so page components share the same positioning and calls to action. Add a compact collaboration conversion section to Home, rewrite the existing research and evidence copy in place, and apply the same message hierarchy to `/about` after its separate implementation plan is complete.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4, Node built-in test runner, ESLint.

## Global Constraints

- Primary audience: corporate, public-sector, and educational-organization managers responsible for industry–academia collaboration, AI strategy, digital transformation, or research programs.
- Secondary audience: prospective graduate students and undergraduate researchers.
- Primary conversion: collaboration email followed by a meeting request.
- Position: an industry-problem-solving research partner that starts with organizational decision problems, designs and validates AI- and data-based solutions, and prepares for a Quantum-ready transition.
- Public headline: `복잡한 산업 문제를, 검증 가능한 해법으로.`
- Do not invent project outcomes, testimonials, partner endorsements, or performance metrics.
- Present AI, generative AI, and Quantum-AI as capabilities within one problem-led method, not as three unrelated claims.
- Quantum-ready must be framed as a future-preparation area and must not imply unsupported current outcomes.
- Do not add dependencies, a contact form, or an automated meeting-booking system.
- Complete `docs/superpowers/plans/2026-08-14-about-page.md` Tasks 1–4 before this plan's Task 5.

---

## File Structure

- Create `src/data/site-copy.ts`: typed, stable brand positioning, audience paths, CTA labels, and page introductions.
- Create `tests/brand-messaging.test.mjs`: source-level regression tests for the approved headline, audience priority, evidence boundaries, and conversion paths.
- Modify `package.json`: ensure all Node tests run through `npm test` if the About implementation has not already added the script.
- Modify `src/app/page.tsx`: problem-led hero, primary and secondary actions, and collaboration conversion section.
- Modify `src/data/research-axes.ts`: rewrite capability descriptions around organizational problems and verifiable outcomes.
- Modify `src/data/research-process.ts`: tighten the problem, design-and-validation, and future-readiness method copy.
- Modify `src/components/research-axes.tsx`: revise section introduction from technology exploration to problem-led capabilities.
- Modify `src/components/process-steps.tsx`: revise section introduction to explain the collaboration method.
- Modify `src/components/related-articles.tsx`: frame articles as supporting evidence rather than generic related content.
- Modify `src/app/about/page.tsx`: apply the approved collaboration-first narrative after the About route exists.
- Modify `src/app/professor/page.tsx`, `src/app/activities/page.tsx`, `src/app/publications/page.tsx`, and `src/app/researchers/page.tsx`: add relevance-oriented page introductions without changing factual records.
- Modify `src/app/layout.tsx`, `src/components/site-header.tsx`, and `src/components/site-footer.tsx`: align metadata, CTA language, and contact identity.

### Task 1: Central Brand Copy Contract

**Files:**
- Create: `src/data/site-copy.ts`
- Create: `tests/brand-messaging.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: approved `.agents/brand-context.md` positioning.
- Produces: `siteCopy` exported as a readonly object with `brand`, `home`, `audiences`, and `contact` keys.

- [ ] **Step 1: Write the failing copy-contract test**

Create `tests/brand-messaging.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const copyPath = new URL("../src/data/site-copy.ts", import.meta.url);

test("site copy preserves the approved positioning and audience priority", async () => {
  const copy = await readFile(copyPath, "utf8");
  assert.match(copy, /복잡한 산업 문제를, 검증 가능한 해법으로\./);
  assert.match(copy, /현장의 문제에서 출발해/);
  assert.match(copy, /협업 논의하기/);
  assert.match(copy, /연구 참여 알아보기/);
  assert.match(copy, /yoonity25@gmail\.com/);
  assert.ok(copy.indexOf("협업 논의하기") < copy.indexOf("연구 참여 알아보기"));
});
```

- [ ] **Step 2: Ensure the repository has a repeatable test command and verify failure**

If `package.json` does not already contain it, add:

```json
"test": "node --test tests/*.test.mjs"
```

Run: `npm test -- --test-name-pattern="approved positioning"`

Expected: FAIL because `src/data/site-copy.ts` does not exist.

- [ ] **Step 3: Create the typed copy module**

Create `src/data/site-copy.ts` with this exact public copy:

```ts
export const siteCopy = {
  brand: {
    category: "동국대학교 경영정보학과 · 산업 문제 해결형 AI 연구실",
    headline: "복잡한 산업 문제를, 검증 가능한 해법으로.",
    description:
      "현장의 문제에서 출발해 AI와 데이터로 해결책을 설계하고 검증합니다. 그리고 다음 기술 전환까지 함께 준비합니다.",
  },
  home: {
    primaryCta: "협업 논의하기",
    secondaryCta: "연구 참여 알아보기",
    collaborationLabel: "Industry–Academia Collaboration",
    collaborationTitle: "함께 풀어야 할 문제가 있다면, 연구의 시작이 됩니다.",
    collaborationDescription:
      "공동연구, 산학과제, AI 파일럿과 실증, 데이터 분석과 자문까지. 문제와 현재 상황을 알려주시면 가능한 연구 방향을 함께 검토합니다.",
    emailCta: "협업 문의 이메일 보내기",
    meetingCta: "미팅 요청하기",
  },
  audiences: {
    collaboration: "기업·기관 협업",
    researchers: "대학원·학부연구생 지원",
  },
  contact: {
    collaborationEmail: "yoonity25@gmail.com",
    meetingSubject: "Yoonity Lab 산학협력 미팅 요청",
  },
} as const;
```

- [ ] **Step 4: Run focused and full tests**

Run: `npm test -- --test-name-pattern="approved positioning" && npm test`

Expected: all matching and full tests PASS.

- [ ] **Step 5: Commit the copy contract**

```bash
git add package.json src/data/site-copy.ts tests/brand-messaging.test.mjs
git commit -m "feat: define Yoonity site messaging"
```

### Task 2: Rewrite Home Around the Industry Problem

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `tests/brand-messaging.test.mjs`

**Interfaces:**
- Consumes: `siteCopy.brand`, `siteCopy.home`, and `siteCopy.contact` from Task 1.
- Produces: a problem-led Home hero with primary collaboration and secondary recruitment paths plus a collaboration conversion section.

- [ ] **Step 1: Add failing Home hierarchy assertions**

Extend `tests/brand-messaging.test.mjs`:

```js
const homePath = new URL("../src/app/page.tsx", import.meta.url);

test("home leads with collaboration and keeps recruitment secondary", async () => {
  const home = await readFile(homePath, "utf8");
  assert.match(home, /siteCopy\.brand\.headline/);
  assert.match(home, /siteCopy\.home\.primaryCta/);
  assert.match(home, /siteCopy\.home\.secondaryCta/);
  assert.match(home, /siteCopy\.home\.collaborationTitle/);
  assert.match(home, /encodeURIComponent\(siteCopy\.contact\.meetingSubject\)/);
  assert.ok(home.indexOf("primaryCta") < home.indexOf("secondaryCta"));
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --test-name-pattern="home leads"`

Expected: FAIL because Home does not import or render `siteCopy`.

- [ ] **Step 3: Replace the Home hero copy and actions**

In `src/app/page.tsx`, import `Link` and `siteCopy`. Replace the current label, headline, and English strapline with `siteCopy.brand.category`, `siteCopy.brand.headline`, and `siteCopy.brand.description`.

Below the description, render actions in this order:

```tsx
<a href="#collaboration">{siteCopy.home.primaryCta}</a>
<Link href="/about#join">{siteCopy.home.secondaryCta}</Link>
```

Style the primary action with the existing solid `bg-ink text-paper` convention and the secondary action with a `border-hairline` outline. Both must have visible focus styles and wrap cleanly on mobile.

- [ ] **Step 4: Add the collaboration conversion section**

After `<ProcessSteps />` and before `<RelatedArticles />`, add `<section id="collaboration">` using the existing `max-w-6xl`, `px-6`, `py-24 md:py-32`, `border-hairline`, and `bg-paper-raised` conventions. Render the label, title, and description from `siteCopy.home`.

Create these two email links:

```tsx
const collaborationHref = `mailto:${siteCopy.contact.collaborationEmail}`;
const meetingHref = `mailto:${siteCopy.contact.collaborationEmail}?subject=${encodeURIComponent(siteCopy.contact.meetingSubject)}`;
```

The first link renders `siteCopy.home.emailCta`; the second renders `siteCopy.home.meetingCta`. Add one supporting link to `/about#collaboration` labeled `협업 방식 자세히 보기`.

- [ ] **Step 5: Run Home tests and static validation**

Run: `npm test -- --test-name-pattern="home leads" && npm run lint && npx tsc --noEmit`

Expected: the focused test passes; ESLint and TypeScript exit 0.

- [ ] **Step 6: Commit the Home rewrite**

```bash
git add src/app/page.tsx tests/brand-messaging.test.mjs
git commit -m "feat: make collaboration the home priority"
```

### Task 3: Reframe Capabilities and Research Process

**Files:**
- Modify: `src/data/research-axes.ts`
- Modify: `src/data/research-process.ts`
- Modify: `src/components/research-axes.tsx`
- Modify: `src/components/process-steps.tsx`
- Modify: `tests/brand-messaging.test.mjs`

**Interfaces:**
- Consumes: existing `ResearchAxis` and `ProcessStep` types.
- Produces: the same data shapes and component APIs with problem-led copy.

- [ ] **Step 1: Add failing capability and process assertions**

Extend the test to read all four files and assert the section-level phrases `문제에 맞는 기술을 선택합니다`, `세 가지 역량, 하나의 문제 해결 방식`, `문제를 정의하고, 설계하고, 검증합니다`, and the Quantum boundary phrase `미래 적용 가능성과 조직의 준비 조건`.

```js
assert.match(axesComponent, /세 가지 역량, 하나의 문제 해결 방식/);
assert.match(axesComponent, /문제에 맞는 기술을 선택합니다/);
assert.match(processComponent, /문제를 정의하고, 설계하고, 검증합니다/);
assert.match(axesData, /미래 적용 가능성과 조직의 준비 조건/);
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --test-name-pattern="capabilities"`

Expected: FAIL because the current sections lead with technology exploration.

- [ ] **Step 3: Rewrite the research-capability introduction and descriptions**

In `src/components/research-axes.tsx`, use:

- Label: `세 가지 역량, 하나의 문제 해결 방식`
- Heading: `문제에 맞는 기술을 선택합니다`
- Description: `Yoonity는 기술을 먼저 정하지 않습니다. 조직이 내려야 할 결정과 검증해야 할 가설을 정의한 뒤, AI·생성형 AI·Quantum-AI 중 적합한 접근을 설계합니다.`

In `src/data/research-axes.ts`, replace only the three descriptions:

- AI: `수요 예측, 추천, 분류와 같은 의사결정 문제를 머신러닝과 데이터 분석으로 모델링하고, 실제 성과와 조직 수용 조건을 검증합니다.`
- Generative AI: `생성형 AI가 필요한 서비스와 업무 맥락을 정의하고, 사용자 경험과 운영 효과를 함께 검증해 적용 가능한 형태로 발전시킵니다.`
- Quantum-AI: `복잡한 최적화 문제를 중심으로 양자컴퓨팅의 미래 적용 가능성과 조직의 준비 조건을 연구하고, 단계적인 Quantum-ready 전환 방향을 설계합니다.`

- [ ] **Step 4: Rewrite the process introduction and correct source copy defects**

In `src/components/process-steps.tsx`, use:

- Label: `Yoonity Research Process`
- Heading: `문제를 정의하고, 설계하고, 검증합니다`
- Description: `기업과 기관의 현장 맥락을 연구 가능한 질문으로 바꾸고, 해결책을 설계한 뒤 실제 데이터와 사용자 환경에서 가치를 확인합니다.`

Keep the three existing process steps and item structure. In `src/data/research-process.ts`, tighten repeated sentences without changing meaning, and correct the visible typos `비즈니스 연향` to `비즈니스 영향` and `학합형 파일럿` to `학습형 파일럿`.

- [ ] **Step 5: Run all tests and static checks**

Run: `npm test && npm run lint && npx tsc --noEmit`

Expected: all tests pass; ESLint and TypeScript exit 0.

- [ ] **Step 6: Commit the capability and process rewrite**

```bash
git add src/data/research-axes.ts src/data/research-process.ts src/components/research-axes.tsx src/components/process-steps.tsx tests/brand-messaging.test.mjs
git commit -m "feat: reframe research around industry problems"
```

### Task 4: Turn Existing Facts Into Credibility Evidence

**Files:**
- Modify: `src/components/related-articles.tsx`
- Modify: `src/app/professor/page.tsx`
- Modify: `src/app/activities/page.tsx`
- Modify: `src/app/publications/page.tsx`
- Modify: `src/app/researchers/page.tsx`
- Modify: `tests/brand-messaging.test.mjs`

**Interfaces:**
- Consumes: existing data getters and list components without changing their return types.
- Produces: concise page introductions that explain why each factual list matters to the two audiences.

- [ ] **Step 1: Add failing evidence-page assertions**

Extend the test to assert these exact introductions in their corresponding files:

```js
assert.match(articles, /연구와 현장을 연결한 기록/);
assert.match(professor, /산업 경험과 학술 연구를 연결합니다/);
assert.match(activities, /현장의 문제를 과제와 성과로/);
assert.match(publications, /검증한 질문과 축적한 지식/);
assert.match(researchers, /실제 문제를 함께 연구하는 사람들/);
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --test-name-pattern="credibility evidence"`

Expected: FAIL because the existing headings are generic list labels.

- [ ] **Step 3: Rewrite the evidence section and page introductions**

Use these exact headings and supporting sentences:

- Related articles heading: `연구와 현장을 연결한 기록`
- Related articles support: `Yoonity의 연구, 프로젝트와 구성원이 산업과 교육 현장에서 만든 변화를 소개합니다.`
- Professor heading: `산업 경험과 학술 연구를 연결합니다`
- Professor support: `서비스 기획과 데이터 사이언스 실무 경험을 바탕으로, 현장의 문제를 검증 가능한 연구와 해결책으로 발전시킵니다.`
- Activities heading: `현장의 문제를 과제와 성과로`
- Activities support: `기업·기관과 함께 수행한 연구 과제와 구성원들이 만든 수상 성과를 확인하세요.`
- Publications heading: `검증한 질문과 축적한 지식`
- Publications support: `AI, 디지털 서비스와 조직의 의사결정을 연구한 논문·도서·특허를 모았습니다.`
- Researchers heading: `실제 문제를 함께 연구하는 사람들`
- Researchers support: `서로 다른 관심과 경험을 연결해 산업과 사회의 문제를 연구 성과로 발전시킵니다.`

Do not edit names, dates, affiliations, project titles, publication citations, patent records, or award claims.

- [ ] **Step 4: Run all tests and static checks**

Run: `npm test && npm run lint && npx tsc --noEmit`

Expected: all tests pass; ESLint and TypeScript exit 0.

- [ ] **Step 5: Commit evidence framing**

```bash
git add src/components/related-articles.tsx src/app/professor/page.tsx src/app/activities/page.tsx src/app/publications/page.tsx src/app/researchers/page.tsx tests/brand-messaging.test.mjs
git commit -m "feat: frame lab records as positioning proof"
```

### Task 5: Align About, Navigation, Metadata, and Contact

**Prerequisite:** Complete `docs/superpowers/plans/2026-08-14-about-page.md` Tasks 1–4 so `src/app/about/page.tsx` exists and the header already routes to `/about`.

**Files:**
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `tests/brand-messaging.test.mjs`

**Interfaces:**
- Consumes: `siteCopy` from Task 1 and `getAboutPageData()` from the About plan.
- Produces: consistent public metadata, collaboration-first About copy, aligned navigation language, and one public collaboration email identity.

- [ ] **Step 1: Add failing cross-site consistency assertions**

Extend the test to assert:

```js
assert.match(layout, /산업 문제 해결형 AI 연구실/);
assert.match(about, /siteCopy\.brand\.headline/);
assert.match(about, /siteCopy\.home\.meetingCta/);
assert.match(header, /산학협력/);
assert.match(footer, /siteCopy\.contact\.collaborationEmail/);
assert.doesNotMatch(footer, /koreatechbigdatalab@gmail\.com/);
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --test-name-pattern="cross-site consistency"`

Expected: FAIL because About and shared chrome do not yet consume the common copy.

- [ ] **Step 3: Align metadata and navigation labels**

In `src/app/layout.tsx`, set:

```ts
title: "Yoonity Lab — 산업 문제 해결형 AI 연구실",
description:
  "Yoonity Lab은 산업의 복잡한 의사결정 문제를 AI와 데이터로 설계·검증하고, 다음 기술 전환을 준비하는 동국대학교 경영정보학과 연구실입니다.",
```

In `src/components/site-header.tsx`, preserve the existing navigation and replace only the desktop and mobile CTA labels `연구실 살펴보기` with `산학협력`. Both continue to link to `/about#collaboration` and the mobile link continues to close the menu.

- [ ] **Step 4: Apply the collaboration-first message to About**

Import `siteCopy`. Use `siteCopy.brand.headline` and `siteCopy.brand.description` in the About hero. Give the Collaboration section `id="collaboration"` and render both email and subject-prefilled meeting links using the same href construction as Home. Give Join Yoonity `id="join"`, keep it after the primary lab introduction, and label its CTA `연구 참여 알아보기`.

Do not change spreadsheet records, resource URLs, news content, channel status, or fallback behavior.

- [ ] **Step 5: Align the footer contact identity**

Import `siteCopy` into `src/components/site-footer.tsx`. Replace the old `koreatechbigdatalab@gmail.com` display and href with `siteCopy.contact.collaborationEmail`. Add the label `산학협력 및 연구 문의` immediately before the email without adding a second address.

- [ ] **Step 6: Run full automated verification**

Run: `npm test && npm run lint && npx tsc --noEmit && npm run build`

Expected: all tests pass, lint and TypeScript exit 0, and the production build includes `/` and `/about`.

- [ ] **Step 7: Commit shared messaging alignment**

```bash
git add src/app/about/page.tsx src/app/layout.tsx src/components/site-header.tsx src/components/site-footer.tsx tests/brand-messaging.test.mjs
git commit -m "feat: align site around collaboration messaging"
```

### Task 6: Browser Review and Copy Quality Gate

**Files:**
- Review: all files changed by Tasks 1–5
- Modify if required by verified defects: only the files listed in Tasks 1–5

**Interfaces:**
- Consumes: the complete messaging implementation.
- Produces: a verified desktop and mobile experience with truthful, readable, and correctly prioritized copy.

- [ ] **Step 1: Run the complete verification suite from a clean command**

Run: `npm test && npm run lint && npx tsc --noEmit && npm run build`

Expected: every command exits 0.

- [ ] **Step 2: Verify Home and About at desktop and mobile widths**

Run `npm run dev`, inspect `/` and `/about` at approximately 1440 px and 390 px widths, and confirm:

- the Home first screen states the problem-led position without horizontal overflow;
- `협업 논의하기` appears before `연구 참여 알아보기`;
- collaboration email and meeting-request links open a draft to `yoonity25@gmail.com`;
- `/about#join` and `/about#collaboration` land on the intended sections;
- the three research capabilities read as methods within one process;
- factual project, publication, patent, award, date, and affiliation records remain unchanged;
- focus indicators are visible and heading order remains semantic.

- [ ] **Step 3: Perform the five-second comprehension check**

Without scrolling past the Home hero, answer from rendered copy only:

1. What does Yoonity do? Expected: solves and validates complex industry decision problems.
2. Who is it primarily for? Expected: companies and institutions seeking a research collaboration partner.
3. What is the next action? Expected: discuss a collaboration, send an email, or request a meeting.

If any answer is not available from the rendered copy, correct only the smallest relevant headline, description, or CTA and rerun Step 1.

- [ ] **Step 4: Review the final diff against the approved design**

Run: `git diff ffa9247..HEAD --check && git diff ffa9247..HEAD --stat && git status --short`

Expected: no whitespace errors, no unplanned dependencies or factual-record edits, and a clean working tree.

- [ ] **Step 5: Commit any browser-verified corrections**

If Step 2 or 3 required changes:

```bash
git add src/data/site-copy.ts src/app/page.tsx src/app/about/page.tsx src/data/research-axes.ts src/data/research-process.ts src/components/research-axes.tsx src/components/process-steps.tsx src/components/related-articles.tsx src/app/professor/page.tsx src/app/activities/page.tsx src/app/publications/page.tsx src/app/researchers/page.tsx src/app/layout.tsx src/components/site-header.tsx src/components/site-footer.tsx tests/brand-messaging.test.mjs
git commit -m "fix: refine verified brand copy"
```

If no changes were required, do not create an empty commit.

## Post-Launch Validation

After the revised copy is deployed, conduct short comprehension interviews with three to five collaboration managers and three to five prospective researchers. Ask what Yoonity does, whether the work appears relevant and credible, and what action they would take. Track collaboration inquiries, meeting conversions, joint-project proposals, and research applicant inquiries; do not publish conversion claims until enough real observations exist.
