# Yoonity About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a spreadsheet-backed `/about` page for laboratory introduction, graduate recruitment, resources, collaboration, future channels, and expandable news.

**Architecture:** Add focused About domain types, local fallback fixtures, and one aggregate sheet getter that normalizes each tab independently. Render the route mostly on the server and isolate only the News expand/collapse state in a small client component. Reuse the existing global layout, `ScrollReveal`, footer, Google Sheets client, and semantic color tokens.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4, Google Sheets API through the existing JWT client, Node built-in test runner, ESLint.

## Global Constraints

- Route: `/about`.
- Section order: Hero → Join Yoonity → Resources → Collaboration → Channels → News → Footer.
- Resources contain only professor résumé and Yoonity brochure; the recruitment notice appears only in Join Yoonity.
- Collaboration email defaults to `yoonity25@gmail.com`.
- Blog and GitHub must launch as visible, non-interactive `준비 중` cards.
- News shows the latest three items initially and expands/collapses in place.
- Core copy and layout stay in code; settings, resources, channels, and news come from Sheets with independent local fallback.
- Preserve the existing global background, header, footer, spacing, typography, and scroll-reveal patterns.
- Do not add dependencies or build a contact form.

---

## File Structure

- Create `src/data/mock-about.ts`: canonical local fallback settings, resource, channel, and news records.
- Create `src/components/about-news.tsx`: isolated client-side News list and accessible expand/collapse control.
- Create `src/app/about/page.tsx`: metadata, section composition, resource/channel cards, and email CTA.
- Create `tests/about-page.test.mjs`: static integration assertions following the repository's existing Node test convention.
- Modify `src/lib/types.ts`: About domain interfaces.
- Modify `src/lib/sheets.ts`: row normalizers and `getAboutPageData()` aggregate getter.
- Modify `src/components/site-header.tsx`: desktop and mobile CTA destinations.
- Modify `package.json`: add a repeatable `test` script for all Node tests.

### Task 1: About Data Contract and Independent Sheet Fallbacks

**Files:**
- Create: `src/data/mock-about.ts`
- Modify: `src/lib/types.ts`
- Modify: `src/lib/sheets.ts`
- Create: `tests/about-page.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: existing `fetchSheetRows(tab: string): Promise<Record<string, string>[]>`.
- Produces: `AboutResource`, `AboutChannel`, `AboutNewsItem`, `AboutPageData`, and `getAboutPageData(): Promise<AboutPageData>`.

- [ ] **Step 1: Add a failing source-level data-contract test**

Create `tests/about-page.test.mjs` using `node:test` and `node:assert/strict`. Read `src/lib/types.ts`, `src/lib/sheets.ts`, and `src/data/mock-about.ts`; assert that the four About interfaces, all four sheet tab names, the fallback email, and invalid-row filters are present.

```js
test("about data has typed sheet sources and local fallbacks", async () => {
  const [types, sheets, mock] = await Promise.all([
    readFile(typesPath, "utf8"),
    readFile(sheetsPath, "utf8"),
    readFile(mockPath, "utf8"),
  ]);
  for (const name of ["AboutResource", "AboutChannel", "AboutNewsItem", "AboutPageData"]) {
    assert.match(types, new RegExp(`export type ${name}`));
  }
  for (const tab of ["about_settings", "about_resources", "about_channels", "about_news"]) {
    assert.match(sheets, new RegExp(`fetchSheetRows\\("${tab}"\\)`));
  }
  assert.match(mock, /yoonity25@gmail\.com/);
});
```

- [ ] **Step 2: Add the test script and verify the test fails**

Add `"test": "node --test tests/*.test.mjs"` to `package.json`.

Run: `npm test`

Expected: FAIL because `src/data/mock-about.ts` and the About interfaces do not exist.

- [ ] **Step 3: Define the About types**

Append exact contracts to `src/lib/types.ts`:

```ts
export type AboutResource = {
  id: string;
  title: string;
  description: string;
  href: string;
  order: number;
};

export type AboutChannel = {
  id: string;
  title: string;
  href?: string;
  status: "coming-soon" | "active";
  order: number;
};

export type AboutNewsItem = {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  href: string;
  order: number;
};

export type AboutPageData = {
  collaborationEmail: string;
  recruitmentHref: string;
  resources: AboutResource[];
  channels: AboutChannel[];
  news: AboutNewsItem[];
};
```

- [ ] **Step 4: Add complete local fallback data**

Create `src/data/mock-about.ts` exporting `mockAboutPageData: AboutPageData`. Use these exact source URLs:

- Recruitment: `https://www.notion.so/Yoonity-27f8edb3cd7280a19b16d907d41e4bfb?source=copy_link`
- Professor résumé: `https://drive.google.com/file/d/1CJuTbGrJyv4uFiZLdQNa2JArYXwwP3j0/view?usp=sharing`
- Brochure: `https://drive.google.com/file/d/1jELjzPdlx3bWwSyI5rTg_8YvO_uN7J-9/view?usp=sharing`
- News: `https://www.yoonity.kr/%EB%89%B4%EC%8A%A4-%EA%B8%B0%EC%82%AC/1` through `/6`

Store news dates as `YYYY-MM-DD`, preserve the six source titles and excerpts recorded in the design source page, use `order` 1–6, and set both channels to `coming-soon` without `href`.

- [ ] **Step 5: Implement independent normalizers and aggregate loading**

In `src/lib/sheets.ts`, import the About types and fallback. Add helpers:

```ts
const isVisible = (value: string) => value.toUpperCase() !== "FALSE";
const toOrder = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
```

Implement `getAboutPageData()` with one `Promise.all` for the four tabs. Build each collection independently; filter resources without `id`, `title`, or `href`; filter news without `id`, `date`, `title`, or `href`; omit rows with `visible=FALSE`; downgrade channels to `coming-soon` unless `status === "active" && href`; sort resources/channels by `order`; sort news by date descending, then order ascending, then id. Use the corresponding local fallback only when that normalized dataset is empty. Read `collaboration_email` and `recruitment_href` settings by key and fall back independently.

- [ ] **Step 6: Run data-contract tests and static checks**

Run: `npm test && npm run lint`

Expected: all tests PASS and ESLint exits 0.

- [ ] **Step 7: Commit the data layer**

```bash
git add package.json src/lib/types.ts src/lib/sheets.ts src/data/mock-about.ts tests/about-page.test.mjs
git commit -m "feat: add about page data sources"
```

### Task 2: Accessible Expandable News Component

**Files:**
- Create: `src/components/about-news.tsx`
- Modify: `tests/about-page.test.mjs`

**Interfaces:**
- Consumes: `AboutNewsItem[]` from `src/lib/types.ts`.
- Produces: `AboutNews({ items }: { items: AboutNewsItem[] }): React.JSX.Element`.

- [ ] **Step 1: Add failing News interaction contract assertions**

Extend `tests/about-page.test.mjs` to read `src/components/about-news.tsx` and assert `"use client"`, initial `slice(0, 3)`, `aria-expanded`, both Korean control labels, and safe external-link attributes.

```js
assert.match(news, /^"use client"/);
assert.match(news, /slice\(0, 3\)/);
assert.match(news, /aria-expanded=\{expanded\}/);
assert.match(news, /전체 기사 보기/);
assert.match(news, /기사 접기/);
assert.match(news, /noopener noreferrer/);
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- --test-name-pattern="news"`

Expected: FAIL because `about-news.tsx` does not exist.

- [ ] **Step 3: Implement the minimal client component**

Create `src/components/about-news.tsx`. Hold `expanded` in `useState(false)`, derive `visibleItems = expanded ? items : items.slice(0, 3)`, render semantic `<article>` rows with `<time dateTime={item.date}>`, and show the toggle only when `items.length > 3`. The button must set `aria-expanded={expanded}` and display `전체 기사 보기 ↓` or `기사 접기 ↑`. External article anchors use `target="_blank" rel="noopener noreferrer"`.

- [ ] **Step 4: Run focused and full tests**

Run: `npm test -- --test-name-pattern="news" && npm test`

Expected: all matching and full tests PASS.

- [ ] **Step 5: Commit the News component**

```bash
git add src/components/about-news.tsx tests/about-page.test.mjs
git commit -m "feat: add expandable about news"
```

### Task 3: Compose the `/about` Page

**Files:**
- Create: `src/app/about/page.tsx`
- Modify: `tests/about-page.test.mjs`

**Interfaces:**
- Consumes: `getAboutPageData()` and `AboutNews`.
- Produces: Next.js route `/about` and route metadata.

- [ ] **Step 1: Add a failing page-structure test**

Read `src/app/about/page.tsx` and assert the six user-facing section markers occur in order, `getAboutPageData` and `AboutNews` are used, collaboration uses `mailto:`, resources use safe new-tab attributes, and `SiteFooter` is present.

```js
const labels = ["연구실 소개", "Join Yoonity", "Resources", "Collaboration", "Channels", "News"];
let cursor = -1;
for (const label of labels) {
  const next = page.indexOf(label);
  assert.ok(next > cursor, `${label} must follow the previous section`);
  cursor = next;
}
assert.match(page, /getAboutPageData\(\)/);
assert.match(page, /mailto:/);
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- --test-name-pattern="page structure"`

Expected: FAIL because `src/app/about/page.tsx` does not exist.

- [ ] **Step 3: Implement metadata and the async route**

Create `src/app/about/page.tsx` with Korean metadata. Load `const data = await getAboutPageData()`. Render one `<main className="mx-auto w-full max-w-4xl flex-1 px-6 py-32">` with the exact agreed section order and a `SiteFooter` after main.

- [ ] **Step 4: Implement the six sections with existing visual conventions**

Use `ScrollReveal` around sections, semantic headings, `border-hairline`, `bg-paper-raised`, and responsive `grid-cols-1 md:grid-cols-2`. Join Yoonity links only to `data.recruitmentHref`. Resources map only `data.resources`. Collaboration links to ``mailto:${data.collaborationEmail}``. Coming-soon channels render `<div aria-disabled="true">`; active channels render safe external `<a>` elements. Pass `data.news` to `<AboutNews items={data.news} />`.

- [ ] **Step 5: Run tests, lint, and type checking**

Run: `npm test && npm run lint && npx tsc --noEmit`

Expected: all commands exit 0.

- [ ] **Step 6: Commit the page**

```bash
git add src/app/about/page.tsx tests/about-page.test.mjs
git commit -m "feat: add Yoonity about page"
```

### Task 4: Wire Navigation and Verify the Complete Story

**Files:**
- Modify: `src/components/site-header.tsx`
- Modify: `tests/about-page.test.mjs`

**Interfaces:**
- Consumes: `/about` route from Task 3.
- Produces: desktop and mobile navigation paths to `/about`.

- [ ] **Step 1: Add a failing navigation assertion**

Read `src/components/site-header.tsx`; assert exactly two `href="/about"` occurrences and no `href="/#research"` occurrences.

```js
assert.equal((header.match(/href="\/about"/g) ?? []).length, 2);
assert.doesNotMatch(header, /href="\/#research"/);
```

- [ ] **Step 2: Run the navigation test and verify it fails**

Run: `npm test -- --test-name-pattern="navigation"`

Expected: FAIL because both buttons still target `/#research`.

- [ ] **Step 3: Update both header destinations**

Change the desktop and mobile `연구실 살펴보기` links to `href="/about"`. Preserve the mobile `onClick={() => setMenuOpen(false)}` behavior.

- [ ] **Step 4: Run the full automated verification suite**

Run: `npm test && npm run lint && npx tsc --noEmit && npm run build`

Expected: all tests pass, lint and TypeScript exit 0, and Next.js builds `/about` successfully.

- [ ] **Step 5: Perform browser verification**

Run the development server and inspect `/about` at desktop and mobile widths. Confirm section order, background continuity, two-column-to-one-column card collapse, email link, resource links, non-interactive coming-soon cards, News initial count, expand/collapse labels and state, keyboard focus, long-title wrapping, and both header links.

- [ ] **Step 6: Commit navigation and verification coverage**

```bash
git add src/components/site-header.tsx tests/about-page.test.mjs
git commit -m "feat: link header to about page"
```

### Task 5: Final Review and Handoff

**Files:**
- Review: all files changed by Tasks 1–4

**Interfaces:**
- Consumes: completed `/about` feature.
- Produces: verified handoff with no uncommitted feature changes.

- [ ] **Step 1: Review the diff against the design**

Run: `git diff HEAD~4 --check && git diff HEAD~4 --stat && git status --short`

Expected: no whitespace errors; only planned About, navigation, data, test, and package files changed; working tree clean.

- [ ] **Step 2: Re-run completion checks**

Run: `npm test && npm run lint && npx tsc --noEmit && npm run build`

Expected: every command exits 0.

- [ ] **Step 3: Report the completed behavior**

Provide the `/about` route, spreadsheet tab schemas, fallback behavior, test/build results, and any required Google Sheet setup. Do not claim live Sheet data until those tabs exist and have been populated.
