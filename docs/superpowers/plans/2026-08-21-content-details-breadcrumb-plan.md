# Content Details, Breadcrumbs, and Browser Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add repository-backed news, project, and publication detail routes, accessible breadcrumbs with JSON-LD, and Playwright coverage for the hydrated About news disclosure.

**Architecture:** A shared `content-details` server loader resolves existing Sheet/fallback records by safe IDs, while three App Router dynamic segments render type-specific metadata and schema through shared detail and breadcrumb components. Sitemap generation consumes the same valid detail URLs, so indexable routes cannot drift from the pages. Playwright runs a local Next dev server with fallback data and validates user-visible hydration behavior.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Node test runner with `tsx`, `@playwright/test`, Schema.org JSON-LD, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-21-content-details-breadcrumb-design.md`

## Global Constraints

- Use only local fallback data or mapped Google Sheets values; never invent article bodies, authors, publishers, images, or dates.
- Use existing safe record IDs as slugs; omit empty or unsafe IDs from detail params and sitemap.
- Preserve `revalidate = 60`, canonical origin resolution, existing static routes, and external-link `target`/`rel` attributes.
- Unknown detail IDs call `notFound()` and do not render an empty detail page.
- Optional malformed URLs and blank values are omitted from HTML/schema.
- Keep custom-domain DNS, redirects, and Search Console work out of scope.
- Every production behavior is added test-first and observed failing before implementation.

---

### Task 1: Add failing unit contracts for detail data, metadata, schema, breadcrumbs, and sitemap

**Files:**
- Create: `tests/content-details.test.mjs`
- Create: `tests/breadcrumbs.test.mjs`
- Modify: `tests/seo-foundation.test.mjs`

**Interfaces:**
- Tests will consume `getNewsDetail`, `getProjectDetail`, `getPublicationDetail`, `getDetailParams`, `createDetailMetadata`, `createNewsStructuredData`, `createProjectStructuredData`, `createPublicationStructuredData`, `createBreadcrumbStructuredData`, and `createDetailSitemapEntries`.

- [ ] **Step 1: Write failing detail loader and schema assertions**

  Assert literal fallback behavior for `genai-edu-award-2024`, `project-1`, `intl-0`, and a missing ID. Assert that news uses its existing date/excerpt/source, projects use only title/org/period, publications preserve the full citation, and schemas omit unavailable author/body fields.

- [ ] **Step 2: Write failing breadcrumb and metadata assertions**

  Assert breadcrumb labels/absolute URLs and `position` values for `홈 > 연구과제 > 올바로 시스템 관련 상하위법 챗봇 개발`. Assert detail metadata canonical, title, description, OG URL, and Twitter image use the configured base URL.

- [ ] **Step 3: Write failing sitemap and route-contract assertions**

  Assert detail sitemap entries include `/news/genai-edu-award-2024`, `/projects/project-1`, and `/publications/intl-0`, while the existing six static routes remain present. Extend source/metadata assertions so detail route links are internal and existing canonicals remain unchanged.

- [ ] **Step 4: Run the focused tests and verify expected RED failures**

  Run `node --import tsx --test tests/content-details.test.mjs tests/breadcrumbs.test.mjs tests/seo-foundation.test.mjs`.

  Expected: failures because the new loaders, metadata factory, schema factories, breadcrumb factory, and sitemap helper do not yet exist.

### Task 2: Implement safe content detail loaders and metadata helpers

**Files:**
- Create: `src/lib/content-details.ts`
- Modify: `src/lib/types.ts`
- Modify: `src/lib/seo.ts`

**Interfaces:**
- Produce `NewsDetail`, `ProjectDetail`, `PublicationDetail` result types and `getNewsDetail(slug)`, `getProjectDetail(slug)`, `getPublicationDetail(slug)`, `getDetailParams(kind)`, and `createDetailSitemapEntries(baseUrl)`.
- Produce `createDetailMetadata({ route, title, description, type })` returning Next Metadata with canonical, OG, and Twitter values.

- [ ] **Step 1: Implement safe ID filtering and merged news lookup**

  Define a safe slug predicate for existing IDs (`^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$`). Merge `getAboutPageData().news` and `getArticles()` by ID, preferring About date/title/excerpt/href while retaining article accent/thumbnail when present. Return `undefined` for unsafe or missing IDs.

- [ ] **Step 2: Implement project and publication lookups**

  Filter activities to `category === "project"`; return existing publication records without parsing citation strings. Expose parameter arrays from the same filtered records used by lookup.

- [ ] **Step 3: Implement detail metadata and sitemap helpers**

  Generate descriptions from existing excerpt/meta/org/period fields with a deterministic fallback that names the content type. Use route paths as canonical values and append valid detail entries to the existing static sitemap list.

- [ ] **Step 4: Run focused tests and make them GREEN**

  Run the Task 1 command and then `npm test`. Fix implementation defects without weakening literal assertions.

- [ ] **Step 5: Commit the loader and metadata slice**

  ```bash
  git add tests/content-details.test.mjs tests/breadcrumbs.test.mjs tests/seo-foundation.test.mjs src/lib/content-details.ts src/lib/types.ts src/lib/seo.ts
  git commit -m "feat: add content detail data contracts"
  ```

### Task 3: Implement reusable Breadcrumbs and detail structured data

**Files:**
- Create: `src/components/breadcrumbs.tsx`
- Modify: `src/lib/structured-data.ts`
- Modify: `tests/breadcrumbs.test.mjs`

**Interfaces:**
- `Breadcrumbs({ items }: { items: { label: string; href: string }[] })` renders accessible UI and one JSON-LD script.
- Structured factories return compact JSON-LD through the existing serializer and use `siteUrl`-based absolute IDs/URLs.

- [ ] **Step 1: Extend failing tests for rendered breadcrumb semantics**

  Render `Breadcrumbs` with React server rendering and assert `nav[aria-label="현재 위치"]`, ordered links, final `aria-current="page"`, and one `BreadcrumbList` JSON-LD object.

- [ ] **Step 2: Implement the Breadcrumbs component and factory**

  Render all prior items as crawlable links, the final item as the current label, and use absolute URLs in `itemListElement`. Keep JSON-LD `<` escaping through `JsonLd`.

- [ ] **Step 3: Implement NewsArticle, ResearchProject, ScholarlyArticle, Book, and patent CreativeWork factories**

  Include only fields present in each record. Use safe external URLs for source references and stable internal `@id` values. Never output blank values or invented author/publisher fields.

- [ ] **Step 4: Run breadcrumb and structured-data tests GREEN**

  Run `node --import tsx --test tests/breadcrumbs.test.mjs tests/content-details.test.mjs tests/structured-data.test.mjs`.

### Task 4: Add dynamic detail route pages and link lists to them

**Files:**
- Create: `src/app/news/[slug]/page.tsx`
- Create: `src/app/projects/[slug]/page.tsx`
- Create: `src/app/publications/[slug]/page.tsx`
- Create: `src/components/content-detail.tsx`
- Modify: `src/components/about-news.tsx`
- Modify: `src/components/related-articles.tsx`
- Modify: `src/components/activities-list.tsx`
- Modify: `src/components/publications-list.tsx`

**Interfaces:**
- Each dynamic page exports `revalidate = 60`, `generateStaticParams`, `generateMetadata`, and a default async page using `notFound()` for missing records.
- `ContentDetail` consumes a title, eyebrow, metadata rows, summary, source URL, parent breadcrumb items, and JSON-LD data.

- [ ] **Step 1: Add route tests before route implementation**

  Extend source and render contracts to require internal `/news/`, `/projects/`, and `/publications/` links, `notFound()` handling, `revalidate = 60`, and route-specific JSON-LD types.

- [ ] **Step 2: Run route tests RED**

  Run `npm test`; expected failures identify missing route files and missing internal links.

- [ ] **Step 3: Implement the shared detail presentation**

  Add a minimal existing-design-compatible server component with eyebrow, `h1`, metadata list, repository-backed summary, optional external source link using `target="_blank" rel="noopener noreferrer"`, Breadcrumbs, and a parent-list link.

- [ ] **Step 4: Implement each dynamic page**

  Use async `params: Promise<{ slug: string }>` per Next 16, call the matching loader, call `notFound()` when absent, generate current params, metadata, breadcrumb items, and type-specific structured data.

- [ ] **Step 5: Update list links**

  Change news, project, publication titles to internal `Link` destinations while preserving external source links wherever they already exist. Keep no empty or JavaScript-only hrefs.

- [ ] **Step 6: Run route tests GREEN and commit**

  ```bash
  npm test
  git add src/app/news src/app/projects 'src/app/publications/[slug]' src/components/content-detail.tsx src/components/about-news.tsx src/components/related-articles.tsx src/components/activities-list.tsx src/components/publications-list.tsx tests
  git commit -m "feat: add crawlable content detail routes"
  ```

### Task 5: Add breadcrumbs to existing pages and update sitemap

**Files:**
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/professor/page.tsx`
- Modify: `src/app/researchers/page.tsx`
- Modify: `src/app/publications/page.tsx`
- Modify: `src/app/activities/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `tests/internal-links.test.mjs`

**Interfaces:**
- Existing pages remain server components with their current metadata and revalidation; each adds a consistent breadcrumb trail.
- Sitemap returns static plus valid dynamic detail entries from `createDetailSitemapEntries(siteUrl)`.

- [ ] **Step 1: Add failing page and sitemap assertions**

  Assert every non-home indexable page has `Breadcrumbs`, and sitemap source uses the detail helper without removing existing `createSitemapEntries` output.

- [ ] **Step 2: Run tests RED**

  Run `npm test`; expected failures identify each page without breadcrumbs and the unchanged sitemap.

- [ ] **Step 3: Add breadcrumb items to the five existing pages**

  Use literal labels matching visible navigation: 연구실 소개, 지도교수, 연구진·졸업생, 논문·도서·특허, 연구과제·수상·대외활동.

- [ ] **Step 4: Make sitemap async and append dynamic entries**

  Keep static entries exactly as before and append detail entries from the shared loader. Preserve the canonical site URL and existing route frequencies/priorities.

- [ ] **Step 5: Run all Node tests GREEN**

  Run `npm test` and commit the page/sitemap slice.

### Task 6: Introduce Playwright hydration and route verification

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `playwright.config.ts`
- Create: `tests/e2e/about-news.spec.ts`
- Create: `.github/workflows/playwright.yml`

**Interfaces:**
- `npm run test:e2e` starts the Next dev server on a dedicated local port and runs Chromium tests.
- CI installs Chromium and runs the same script with fallback data.

- [ ] **Step 1: Add Playwright test and config before dependency implementation**

  Add a spec that targets `/about`, uses visible/hidden assertions for six fallback news articles, clicks the disclosure twice, follows `/news/genai-edu-award-2024`, checks Breadcrumbs and JSON-LD, and asserts an unknown slug returns 404.

- [ ] **Step 2: Run the browser test RED**

  Install `@playwright/test@^1.62.1` and Chromium, then run `npm run test:e2e`. The test must fail at the missing route/link or missing browser script before production changes are complete.

- [ ] **Step 3: Implement config, script, and workflow**

  Configure `webServer` with `npm run dev -- --hostname 127.0.0.1 --port 3101`, `baseURL`, Chromium-only projects, and CI retries. Add a workflow for Node 20, `npm ci`, `npx playwright install --with-deps chromium`, and `npm run test:e2e`.

- [ ] **Step 4: Run the browser test GREEN**

  Run `npm run test:e2e`, then rerun after a clean server start to ensure no reuse-dependent behavior.

- [ ] **Step 5: Commit the browser environment**

  ```bash
  git add package.json package-lock.json playwright.config.ts tests/e2e/about-news.spec.ts .github/workflows/playwright.yml
  git commit -m "test: add browser coverage for news disclosure"
  ```

### Task 7: Full verification, review, and PR update

**Files:**
- Modify: `/tmp/seo-weekly-pr.md` (PR body only)

- [ ] **Step 1: Run all local verification**

  Run `npm test`, `npx --yes --package=node@20 -c 'npm test'`, `npm run test:e2e`, `npm run lint`, `npx tsc --noEmit`, `git diff --check`, and `NEXT_PUBLIC_SITE_URL=https://yoonity-lab-site-static.vercel.app npm run build`.

- [ ] **Step 2: Render representative detail and existing routes**

  Start `next start`, fetch `/`, `/about`, `/news/genai-edu-award-2024`, `/projects/project-1`, `/publications/intl-0`, `/professor`, `/researchers`, `/activities`, `/robots.txt`, and `/sitemap.xml`, and assert canonical, social metadata, BreadcrumbList, detail schema, 404 behavior, and dynamic sitemap URLs.

- [ ] **Step 3: Update PR body with the new scope and exact results**

  Document browser coverage, detail routes, schema choices, Breadcrumbs, test counts, and that domain/DNS work remains intentionally deferred.

- [ ] **Step 4: Commit any final documentation-only adjustment and push**

  Push `codex/seo-weekly` without force-pushing or touching `main`.

- [ ] **Step 5: Verify Draft PR #2**

  Confirm PR #2 remains open and draft, base is `main`, head is `codex/seo-weekly`, and required checks are green.
