# Content Details, Breadcrumbs, and Browser Verification Design

## Goal

Add crawlable detail pages for repository-backed news, research projects, and publications; add accessible breadcrumbs with matching `BreadcrumbList` JSON-LD; and introduce a browser test that verifies the About news disclosure after hydration.

## Scope and constraints

- Continue on `codex/seo-weekly` and update Draft PR #2.
- Use only values already present in local fallback data or mapped Google Sheets rows.
- Use existing record `id` values as slugs. Records with empty or unsafe IDs are not published as detail routes.
- Do not invent article bodies, authors, publishers, social profiles, images, dates, or project descriptions.
- Keep the existing list pages, 60-second revalidation, canonical origin resolution, and external-link security attributes.
- Do not implement custom-domain DNS, redirects, or Search Console work.

## Routes and data flow

Create a server-side content detail loader that resolves the existing data sources by slug:

- `/news/[slug]`: union the `about_news` and `articles` records by ID, preferring About news fields and retaining available article accent/thumbnail data.
- `/projects/[slug]`: records from `getActivities()` whose category is `project`.
- `/publications/[slug]`: records from `getPublications()` across papers, books, and patents.

Each route uses `generateStaticParams` for current fallback/Sheet records and remains dynamically renderable for later valid IDs. Unknown IDs call `notFound()`. A shared detail layout renders the title, available metadata, a short repository-backed summary, optional external source link, and navigation back to the parent list.

Lists link titles to internal details. External source links remain separate and keep `target="_blank"` and `rel="noopener noreferrer"`.

## Metadata and structured data

Add dynamic metadata helpers that use the detail URL as canonical, derive the title/description from existing fields, and reuse the configured site origin and share image.

Add reusable structured-data factories:

- News: `NewsArticle` with headline, description, datePublished, internal URL, and optional external source URL.
- Projects: `ResearchProject` with name, description assembled only from title/organization/period/tag, internal URL, and optional source URL.
- Papers: `ScholarlyArticle` with name, internal URL, and optional source URL.
- Books: `Book` with name, description from the existing metadata string, and optional source URL.
- Patents: `CreativeWork` with name, description from the existing metadata string, genre `특허`, and optional source URL because Schema.org has no dedicated Patent type.

Optional properties are omitted when missing or malformed. All JSON-LD is serialized through the existing `<`-escaping compactor. Existing organization identity remains `/#organization`.

## Breadcrumbs

Create a reusable server component that renders an accessible `nav[aria-label="현재 위치"]` with ordered links and `aria-current="page"` on the final label. Add breadcrumbs to About, Professor, Researchers, Publications, Activities, and all three detail route families. The component also emits one `BreadcrumbList` JSON-LD document whose item URLs use the configured absolute site origin.

## Browser test environment

Add `@playwright/test`, a `playwright.config.ts`, an `npm run test:e2e` script, and a Chromium GitHub Actions workflow. The test server uses the existing Next dev command and fallback data. The About test verifies:

1. Six fallback news articles exist in the DOM after hydration.
2. Articles four through six are hidden initially.
3. The disclosure button starts with `aria-expanded="false"`.
4. Clicking the button exposes all six and changes `aria-expanded` to `true`.
5. Clicking again hides articles four through six and restores `aria-expanded="false"`.

The same browser suite verifies a news detail link, breadcrumb navigation, and a 404 response for an unknown news slug.

## Error handling and indexing

- Empty datasets render the existing list empty states and produce no detail params.
- Malformed external URLs are omitted from detail cards and JSON-LD.
- Detail pages use `notFound()` for missing records.
- Sitemap generation retains all existing static routes and appends valid detail URLs from the same loader.
- The implementation does not claim that structured data guarantees ranking improvements.

## Verification

- Existing Node tests, Node 20 tests, TypeScript, ESLint, and production build remain green.
- Add unit tests for slug resolution, metadata, structured data, breadcrumbs, and detail sitemap entries.
- Run Playwright against the local server.
- Render and inspect representative `/news/...`, `/projects/...`, and `/publications/...` pages plus existing SEO endpoints.
