# SEO Weekly Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the five approved weekly SEO improvements while preserving the immediate SEO foundations already merged to `main`.

**Architecture:** Keep metadata static and centralized in `src/lib/seo.ts`, add pure JSON-LD factories in `src/lib/structured-data.ts`, and render them through one safe component. Use progressive enhancement for the About news disclosure, route-level crawlable links for internal navigation, and a Next.js file-convention OG image.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Node test runner with `tsx`, Tailwind CSS 4, Vercel.

**Spec:** `docs/superpowers/specs/2026-08-21-seo-weekly-design.md`

## Global Constraints

- Base commit is `bc11079ccc2d7b406ebb89cebe8bdb49dc2e6c3b`; preserve existing canonical, robots, sitemap, server-list, category-heading, and `revalidate = 60` behavior.
- Subpage titles must not contain `| Yoonity Lab`; the root layout template adds the brand once.
- Metadata must not depend on Google Sheets.
- Structured data may use only repository-backed values, must omit blank values, must use absolute `siteUrl` URLs, and must escape `<`.
- All About news entries must exist in the initial server HTML and remain visible without JavaScript.
- Internal navigation must use real crawlable `href` values.
- Do not invent production domains, social profiles, or Twitter account fields.
- Do not add excluded detail routes, breadcrumbs, article schemas, image conversion, DNS, Search Console, or design-system rewrites.
- The existing Node 20 test compatibility fix is committed separately as `331dbe8`.

---

### Task 1: Page Metadata and Social Metadata

**Files:**
- Modify: `tests/seo-foundation.test.mjs`
- Modify: `src/lib/seo.ts`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `INDEXABLE_ROUTES`, `siteUrl`, and the root `%s | Yoonity Lab` title template.
- Produces: `HOME_TITLE`, `HOME_DESCRIPTION`, `SHARE_IMAGE`, and `PAGE_METADATA` entries containing canonical, Open Graph, and Twitter metadata.

- [ ] **Step 1: Write failing metadata tests**

Add assertions that each requested subpage title and description contains the approved intent terms, every subpage title omits `Yoonity Lab`, every canonical stays unchanged, and each entry contains route-consistent Open Graph and Twitter values:

```js
test("subpage metadata targets each route without duplicating the title template", () => {
  assert.match(PAGE_METADATA["/professor"].title, /윤상혁 교수.*동국대학교 경영정보학과/);
  assert.match(PAGE_METADATA["/professor"].description, /지도교수.*AI.*생성형 AI.*양자컴퓨팅.*연구/);
  assert.match(PAGE_METADATA["/researchers"].description, /대학원생.*학부연구생.*연구 분야.*졸업생/);
  assert.match(PAGE_METADATA["/publications"].description, /해외.*국내.*논문.*도서.*특허.*연구성과/);
  assert.match(PAGE_METADATA["/activities"].description, /산학협력.*연구과제.*수상.*학술.*대외활동/);

  for (const route of INDEXABLE_ROUTES.slice(1)) {
    assert.doesNotMatch(PAGE_METADATA[route].title, /Yoonity Lab/);
  }
});

test("every page has route-consistent Open Graph and Twitter metadata", () => {
  for (const route of INDEXABLE_ROUTES) {
    const entry = PAGE_METADATA[route];
    assert.equal(entry.openGraph.url, new URL(route, "http://localhost:3000").toString());
    assert.equal(entry.openGraph.images[0].url, "http://localhost:3000/opengraph-image");
    assert.equal(entry.twitter.card, "summary_large_image");
    assert.deepEqual(entry.twitter.images, ["http://localhost:3000/opengraph-image"]);
  }
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --import tsx --test --test-name-pattern="subpage metadata|Open Graph" tests/*.test.mjs`

Expected: FAIL because current metadata is generic and lacks social fields.

- [ ] **Step 3: Implement static metadata helpers**

In `src/lib/seo.ts`, import `Metadata` and `siteUrl`, export the home constants and sharing image, and create each entry through a typed helper. Home uses `title: { absolute: HOME_TITLE }`; subpages use plain titles. Each entry keeps `alternates.canonical`, sets `openGraph.type = "website"`, `locale = "ko_KR"`, `siteName = "Yoonity Lab"`, an absolute route URL, and the absolute 1200×630 sharing image. Twitter uses `summary_large_image` and no account fields.

In `src/app/layout.tsx`, keep `metadataBase` and the title template, source the default title and description from the exported home constants, and reuse the home Open Graph/Twitter objects.

- [ ] **Step 4: Run metadata tests and verify GREEN**

Run: `node --import tsx --test --test-name-pattern="metadata|canonical|Open Graph" tests/*.test.mjs`

Expected: PASS with no title-template or canonical regressions.

- [ ] **Step 5: Commit the metadata task**

```bash
git add -- tests/seo-foundation.test.mjs src/lib/seo.ts src/app/layout.tsx
git commit -m "feat: expand page sharing metadata"
```

### Task 2: Safe Structured Data

**Files:**
- Create: `src/lib/structured-data.ts`
- Create: `src/components/json-ld.tsx`
- Create: `tests/structured-data.test.mjs`
- Modify: `src/app/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/professor/page.tsx`

**Interfaces:**
- Consumes: `siteUrl`, `siteCopy`, `Professor`, and the professor object already loaded by `getProfessor()`.
- Produces: `createOrganizationStructuredData(baseUrl?)`, `createAboutPageStructuredData(baseUrl?)`, `createProfessorStructuredData(professor, baseUrl?)`, `serializeJsonLd(value)`, and `<JsonLd data={...} />`.

- [ ] **Step 1: Write failing structured-data tests**

Create tests using `https://lab.example.edu/` and a minimal literal professor fixture. Assert:

```js
assert.equal(organization["@id"], "https://lab.example.edu/#organization");
assert.equal(organization.url, "https://lab.example.edu/");
assert.equal(about.mainEntity["@id"], organization["@id"]);
assert.equal(profile["@graph"][0].mainEntity["@id"], "https://lab.example.edu/professor#person");
assert.doesNotMatch(JSON.stringify(profile), /undefined|""/);
assert.match(serializeJsonLd({ value: "</script>" }), /\\u003c\/script>/);
```

Also assert the organization logo and professor image are absolute, blank optional values and empty arrays are omitted, and the professor's verified external links become `sameAs`.

- [ ] **Step 2: Run the new test and verify RED**

Run: `node --import tsx --test tests/structured-data.test.mjs`

Expected: FAIL because `src/lib/structured-data.ts` does not exist.

- [ ] **Step 3: Implement factories and safe renderer**

Implement a recursive JSON-compatible compactor that removes `undefined`, `null`, blank strings, empty arrays, and empty objects without altering populated values. Build:

- `ResearchOrganization` with stable `/#organization`, name, alternate name, URL, logo, description, email, and Dongguk University parent organization.
- `AboutPage` with canonical URL and `mainEntity` reference to that ID.
- `ProfilePage` and `Person` in one `@graph`, with stable IDs, verified affiliation/job title, optional absolute photo, email, professor links, and expertise.

Implement serialization as `JSON.stringify(compact(value)).replace(/</g, "\\u003c")`. Render only this serialized string in `JsonLd` using `type="application/ld+json"` and `dangerouslySetInnerHTML`.

- [ ] **Step 4: Add JSON-LD to pages**

Render the organization on the home page, the AboutPage on `/about`, and the professor graph after `getProfessor()` returns. Do not add structured data to other routes.

- [ ] **Step 5: Run structured-data and full tests**

Run: `node --import tsx --test tests/structured-data.test.mjs`

Run: `npm test`

Expected: both PASS with no empty or unsafe JSON-LD values.

- [ ] **Step 6: Commit the structured-data task**

```bash
git add -- tests/structured-data.test.mjs src/lib/structured-data.ts src/components/json-ld.tsx src/app/page.tsx src/app/about/page.tsx src/app/professor/page.tsx
git commit -m "feat: add reusable structured data"
```

### Task 3: Complete About News Server HTML

**Files:**
- Modify: `tests/about-page.test.mjs`
- Modify: `src/components/about-news.tsx`

**Interfaces:**
- Consumes: `AboutNewsItem[]`.
- Produces: complete server-rendered articles plus an enhanced disclosure for lists longer than three.

- [ ] **Step 1: Replace the obsolete test with failing expectations**

Require one unconditional `items.map`, forbid `items.slice(0, 3)` and `visibleItems`, and require `useSyncExternalStore`, `aria-expanded`, `aria-controls`, a controlled list ID, and retained external-link security attributes.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --import tsx --test --test-name-pattern="about news" tests/*.test.mjs`

Expected: FAIL because the current component slices the server-rendered list.

- [ ] **Step 3: Implement progressive enhancement**

Use `useSyncExternalStore` with a server snapshot of `false` and a browser snapshot of `true` to distinguish server/no-JavaScript output from the enhanced client. Map every item and set `hidden` only when enhancement is active, the list is collapsed, and `index >= 3`. Render the disclosure only for `items.length > 3`; connect it to `id="about-news-list"` with `aria-controls` and expose the effective expanded state.

- [ ] **Step 4: Run About and full tests**

Run: `node --import tsx --test --test-name-pattern="about" tests/*.test.mjs`

Run: `npm test`

Expected: PASS for empty, short, and long-list source behaviors.

- [ ] **Step 5: Commit the About news task**

```bash
git add -- tests/about-page.test.mjs src/components/about-news.tsx
git commit -m "fix: render all About news in server HTML"
```

### Task 4: Crawlable Internal Links

**Files:**
- Create: `tests/internal-links.test.mjs`
- Modify: `src/components/site-footer.tsx`
- Modify: `src/components/research-axes.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/professor/page.tsx`

**Interfaces:**
- Consumes: current Next.js `Link`, route-level page structure, and existing typography classes.
- Produces: crawlable `href` links to `/about`, `/professor`, `/researchers`, `/publications`, and `/activities`.

- [ ] **Step 1: Write failing internal-link tests**

Read the four source files and assert that the footer contains all five destinations, the axes contain both publication and activity destinations with non-generic labels, About contains contextual destinations for publications/activities/researchers, and professor contains a publication destination. Assert no `href=""` appears.

- [ ] **Step 2: Run the new test and verify RED**

Run: `node --import tsx --test tests/internal-links.test.mjs`

Expected: FAIL because the links do not exist yet.

- [ ] **Step 3: Implement the links without redesigning layout**

Add a small footer `<nav aria-label="주요 페이지">` using Next.js `Link`. Add `AXIS_LINKS` keyed by the three existing axis IDs so AI and Quantum-AI point to publications while Generative AI points to activities, with destination-specific Korean copy. Add inline or adjacent links in the three About contexts and the professor expertise area, retaining the current sections and responsive classes.

- [ ] **Step 4: Run internal-link and full tests**

Run: `node --import tsx --test tests/internal-links.test.mjs`

Run: `npm test`

Expected: PASS with valid route hrefs and no header/mobile navigation regressions.

- [ ] **Step 5: Commit the internal-link task**

```bash
git add -- tests/internal-links.test.mjs src/components/site-footer.tsx src/components/research-axes.tsx src/app/about/page.tsx src/app/professor/page.tsx
git commit -m "feat: strengthen internal navigation"
```

### Task 5: Open Graph Image

**Files:**
- Create: `src/app/opengraph-image.tsx`
- Modify: `tests/seo-foundation.test.mjs`

**Interfaces:**
- Consumes: `ImageResponse` from `next/og` and the metadata sharing image URL from Task 1.
- Produces: `/opengraph-image`, PNG, 1200×630, with a meaningful alt description.

- [ ] **Step 1: Write a failing OG image convention test**

Read `src/app/opengraph-image.tsx` and assert it exports `alt`, `size` with 1200 and 630, `contentType = "image/png"`, imports `next/og`, and does not set Edge runtime.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --import tsx --test --test-name-pattern="Open Graph image" tests/*.test.mjs`

Expected: FAIL because the file is absent.

- [ ] **Step 3: Implement the sharing image**

Create a flexbox-only `ImageResponse` using the site's paper/ink palette and the verified home positioning. Use no remote fetches, no invented profiles, and no custom runtime declaration.

- [ ] **Step 4: Run tests and production build**

Run: `npm test`

Run: `npm run build`

Expected: PASS and build output includes the OG image route.

- [ ] **Step 5: Commit the image task**

```bash
git add -- tests/seo-foundation.test.mjs src/app/opengraph-image.tsx
git commit -m "feat: add Yoonity sharing image"
```

### Task 6: Domain Inspection and Production Verification

**Files:**
- No repository file changes; this task produces verification evidence and the Draft PR description.

**Interfaces:**
- Consumes: linked Vercel project, `NEXT_PUBLIC_SITE_URL`, production build, and all indexable routes.
- Produces: verified render evidence and Draft PR deployment checklist content.

- [ ] **Step 1: Inspect Vercel read-only state**

From the repository root that contains `.vercel/project.json`, run `vercel whoami`, `vercel project inspect yoonity-lab-site-static`, and `vercel list --status READY -m gitBranch=main`. Record a production alias only if the CLI returns it authoritatively. Do not change domains or deployments.

- [ ] **Step 2: Run complete static verification**

Run: `npm test`

Run: `npx --yes node@20 --import tsx --test tests/*.test.mjs`

Run: `npm run lint`

Run: `npx tsc --noEmit`

Run: `npm run build`

Expected: all commands exit 0.

- [ ] **Step 3: Start the production server and inspect outputs**

Start `npm start` with a verified `NEXT_PUBLIC_SITE_URL` when available, otherwise use `http://localhost:3000`. Fetch `/`, `/about`, `/professor`, `/researchers`, `/publications`, `/activities`, `/robots.txt`, `/sitemap.xml`, and `/opengraph-image`.

Verify canonical tags, non-duplicated titles, Open Graph/Twitter tags, JSON-LD IDs and nonempty values, complete About fallback news titles, internal hrefs, robots/sitemap content, and image content type/status.

- [ ] **Step 4: Review the final diff against the specification**

Run `git diff origin/main...HEAD`, `git status --short`, and `git diff --check`. Confirm no excluded routes or unrelated design changes are present.

- [ ] **Step 5: Request code review and address findings**

Provide the reviewer with base `bc11079ccc2d7b406ebb89cebe8bdb49dc2e6c3b`, current HEAD, the spec path, and a read-only requirement. Fix all Critical and Important findings with regression tests before proceeding.

- [ ] **Step 6: Push and create the Draft PR**

Push `codex/seo-weekly` and create exactly one Draft PR targeting `main`. The body must include changes, SEO rationale, files, verification results, domain status, deployment checklist, and manual Search Console/DNS follow-up. Do not merge the PR.
