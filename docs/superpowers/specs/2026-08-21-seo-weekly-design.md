# SEO Weekly Improvements Design

## Context

The work starts from `origin/main` commit `bc11079ccc2d7b406ebb89cebe8bdb49dc2e6c3b`, which already provides `metadataBase`, route-specific canonical URLs, `robots.txt`, `sitemap.xml`, crawlable category anchors, complete server-rendered activity/publication/researcher lists, category headings, and SEO regression tests. This design preserves those behaviors and does not rebuild them.

The branch also includes a prerequisite compatibility fix for the existing SEO tests. The test command uses `tsx` through Node's `--import` flag so the direct TypeScript imports continue to exercise real functions on both Node 20 and newer Node releases.

## Goals

1. Make the professor, researcher, publication, and activity metadata reflect their actual search intent without duplicating the root title template.
2. Add reusable, safe Schema.org JSON-LD for the home, About, and professor pages.
3. Include every About news item in the initial server HTML while preserving an accessible progressive-enhancement disclosure experience.
4. Add crawlable internal links in the footer and relevant page copy without restructuring the visual system.
5. Add Open Graph and Twitter metadata with a real, accessible sharing image.
6. Verify metadata and page output against a production build, distinguishing missing Google Sheets configuration from code failures.

## Metadata Architecture

`src/lib/seo.ts` remains the static source of page metadata. A small metadata factory will build each `PAGE_METADATA` entry from a route, title, and description, adding the existing canonical plus route-consistent Open Graph and Twitter fields. No metadata generation will call Google Sheets.

The root layout keeps `metadataBase`, the `%s | Yoonity Lab` template, and the current home description. Subpage `title` values contain no `| Yoonity Lab` suffix. Open Graph and Twitter titles include the brand exactly once because social fields do not inherit the document title template in the same way as the HTML title.

The requested subpage intent is expressed only with information already present in `site-copy`, mock data, route copy, or the Google Sheets mapping:

- Professor: 윤상혁 교수, 동국대학교 경영정보학과, AI, 생성형 AI, 양자컴퓨팅, and major research areas.
- Researchers: 대학원생, 학부연구생, research fields, and alumni.
- Publications: international and domestic papers, books, patents, and research outputs.
- Activities: industry collaboration, research projects, awards, and academic/external activities.

Canonical paths and every page's `revalidate = 60` remain unchanged.

## Sharing Metadata and Image

`src/app/opengraph-image.tsx` will generate a 1200×630 PNG with `next/og` using the site's existing visual language and Yoonity Lab copy. The default Node.js runtime is retained. Root metadata will explicitly define Open Graph `type`, `locale`, `siteName`, `title`, `description`, `url`, and `images`, plus Twitter `card`, `title`, `description`, and `images`.

Each `PAGE_METADATA` entry will override social title, description, and URL so About and other subpages share their own copy rather than the home card copy. No Twitter account, creator, or unverified social profile will be added.

All social and canonical URLs resolve from `siteUrl`. The implementation must not hardcode the `.env.example` placeholder or an unverified production domain.

## Structured Data Architecture

`src/lib/structured-data.ts` will contain pure factories and serialization helpers. `src/components/json-ld.tsx` will be the single rendering component. The serializer removes `undefined`, blank strings, empty arrays, and empty objects, then escapes every `<` as `\u003c` before the value is inserted into an `application/ld+json` script.

Stable identifiers are based on `siteUrl`:

- Lab organization: `/#organization`
- Professor person: `/professor#person`
- Page entities: each canonical page URL plus its page fragment where needed

The home page emits a `ResearchOrganization` using the verified Yoonity Lab name, site URL, existing logo path, `site-copy` description and collaboration email, and Dongguk University as the parent organization. `sameAs` is omitted because the current organization channels are marked coming soon.

The About page emits `AboutPage` and points `mainEntity` to the stable lab organization ID.

The professor page emits `ProfilePage` with a connected `Person`. The person uses the loaded professor object, which already falls back to `mock-professor` when Sheets data is unavailable. Optional image, email, links, and expertise are included only when populated. Affiliation and job title use the verified Dongguk University Department of Management Information Systems professor information already present in repository data. Professor links become `sameAs`; no new profiles are invented.

## About News Progressive Enhancement

`AboutNews` renders `items.map(...)` for all items during server rendering. The server result and the JavaScript-disabled page show the complete list. After hydration, an effect enables the compact interaction and collapses items after the first three. The complete item DOM remains mounted; only visibility changes.

For more than three items, the button exposes `aria-expanded` and `aria-controls`, and its controlled list has a stable ID. For zero to three items, no disclosure button is rendered. External anchors keep `target="_blank"` and `rel="noopener noreferrer"`.

## Internal Linking

The footer gains a compact navigation group with crawlable Next.js `Link` elements for About, professor, researchers, publications, and activities. Existing typography, spacing, contact information, and responsive structure are retained.

Each research-axis card gains a destination-specific link. The links use `/publications` or `/activities` and describe the destination rather than using generic “자세히 보기” copy. The mapping stays route-level because the repository does not prove more detailed category relationships.

The About page adds contextual links from research copy to `/publications`, industry collaboration copy to `/activities`, and recruitment copy to `/researchers`. The professor expertise area adds a natural `/publications` link. All navigation uses real `href` values and leaves header/mobile anchor behavior untouched.

## Production Domain Verification

The local checkout is linked to the Vercel project `yoonity-lab-site-static`. Read-only Vercel project and deployment inspection will be used to identify the production alias if credentials permit. If it cannot be confirmed, the code continues to resolve the representative URL in this order:

1. `NEXT_PUBLIC_SITE_URL`
2. `VERCEL_PROJECT_PRODUCTION_URL`
3. `http://localhost:3000`

The Draft PR deployment checklist will then require setting `NEXT_PUBLIC_SITE_URL` to the verified production origin. DNS, redirects, Search Console verification, and sitemap submission remain manual follow-up work.

## Testing Strategy

Implementation follows red-green-refactor cycles:

1. Extend metadata tests for intent terms, canonical preservation, non-duplicated brands, page-specific social fields, and consistent absolute URLs.
2. Add pure structured-data tests for stable IDs, optional-value pruning, and `<` escaping.
3. Update the About news regression to require full `items.map` rendering, progressive enhancement, and disclosure accessibility.
4. Add internal-link tests for the footer, axes, About page, and professor page.
5. Add source and rendered-output checks for Open Graph, Twitter, and the OG image route.

Final verification runs the full tests on the current Node version and Node 20, ESLint, TypeScript checking, and a production build. A production server will then be queried for `/`, `/about`, `/professor`, `/researchers`, `/publications`, `/activities`, `/robots.txt`, `/sitemap.xml`, and the sharing image. HTML checks cover canonical tags, titles, Open Graph/Twitter tags, JSON-LD validity, internal links, and complete About news content.

Missing Google Sheets environment variables are expected to select repository fallbacks and are not treated as implementation failures.

## Explicit Exclusions

This change does not add detail routes for news, projects, or publications; breadcrumbs; article schemas; bulk image conversion; external backlink work; Search Console ownership or submission; DNS or custom-domain changes; a design-system rewrite; or a rewrite of the existing canonical, robots, and sitemap architecture.
