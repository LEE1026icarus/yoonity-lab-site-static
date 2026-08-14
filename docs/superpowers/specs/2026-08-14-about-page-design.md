# Yoonity About Page Design

## Goal

Create a new `/about` page linked from the desktop and mobile `연구실 살펴보기` header buttons. The page introduces Yoonity, directs prospective graduate students to the recruitment notice, provides collaboration contact, reserves visible space for future Blog and GitHub channels, and presents news as supporting evidence rather than the primary content.

The page reuses the existing global header, footer, fixed cosmic gradient background, typography, spacing, and scroll-reveal conventions.

## Information Architecture

The page uses this fixed section order:

1. **Hero**
   - Label: `연구실 소개`
   - One-line mission or description
2. **Join Yoonity**
   - Graduate-student recruitment introduction
   - Primary `모집 공고 보기` action
3. **Resources**
   - Professor résumé
   - Yoonity brochure
   - The recruitment notice is intentionally excluded to avoid duplicating the primary Join Yoonity action
4. **Collaboration**
   - Covers industry–academia cooperation, joint research, and projects
   - `협업 문의하기` opens an email to `yoonity25@gmail.com`
5. **Channels**
   - Blog and GitHub cards are visible from launch
   - Until URLs are configured, both appear as non-interactive `준비 중` cards
6. **News**
   - Shows the latest three visible articles by default
   - `전체 기사 보기` expands the remaining articles in place and can collapse them again
   - News remains last because it supports credibility after the primary recruitment and collaboration paths

The footer follows News.

## Content Sources

The initial resources and six news items come from the existing Yoonity `연구실 소개 및 모집 / 뉴스 기사` page. External destination URLs are preserved.

Core hero and section copy stays in code because it changes infrequently and benefits from normal paragraph formatting. Operational content that is likely to change is read from Google Sheets using the repository's existing fetch-and-fallback pattern.

### Sheet Tabs

#### `about_settings`

| Column | Purpose |
| --- | --- |
| `key` | Setting identifier |
| `value` | Setting value |

Initial setting: `collaboration_email = yoonity25@gmail.com`.

#### `about_resources`

| Column | Purpose |
| --- | --- |
| `id` | Stable identifier |
| `title` | Card title |
| `description` | Short supporting text |
| `href` | External destination |
| `order` | Display order |
| `visible` | `TRUE` to display |

Initial entries are the professor résumé and Yoonity brochure.

#### `about_channels`

| Column | Purpose |
| --- | --- |
| `id` | Stable identifier such as `blog` or `github` |
| `title` | Display label |
| `href` | External destination; may be empty while coming soon |
| `status` | `coming-soon` or `active` |
| `order` | Display order |

An `active` channel without a valid URL is treated as `coming-soon`.

#### `about_news`

| Column | Purpose |
| --- | --- |
| `id` | Stable identifier |
| `date` | Article date in `YYYY-MM-DD` format |
| `title` | Article title |
| `excerpt` | Existing article summary |
| `href` | Existing article detail URL |
| `order` | Editorial display order |
| `visible` | `TRUE` to display |

News is sorted by date descending. When two entries have the same date, numeric `order` ascending breaks the tie, followed by `id` ascending for deterministic output.

## Data Boundaries and Fallbacks

Add focused About types and getters alongside the existing sheet integration. Page and presentation components consume normalized data and do not parse raw sheet rows.

Each About dataset falls back independently to local defaults when its sheet tab is unavailable or has no usable rows. A failure in one tab must not discard valid data from another tab.

- Missing required fields cause only that invalid item to be omitted.
- A missing or invalid collaboration email falls back to `yoonity25@gmail.com`.
- Empty resource URLs hide the affected resource.
- Empty channel URLs preserve visible `준비 중` cards.
- Three or fewer news items hide the expand/collapse control.
- Empty news data falls back to the six source articles stored locally.

## Components and Interaction

The `/about` route is an async server page that retrieves normalized About data. Mostly static sections remain server-rendered. The News list uses a small isolated client component for expand/collapse state.

- Both header buttons navigate to `/about` and close the mobile menu as they do today.
- Resource and news links open external destinations in a new tab with `rel="noopener noreferrer"`.
- The collaboration action uses a `mailto:` link to the configured address.
- Coming-soon channel cards are rendered without anchors and do not imply clickability.
- Active channels use external-link affordances.
- News starts with three items. The control uses an actual button with `aria-expanded` and clear expanded/collapsed labels.
- Cards collapse to one column on small screens. Long titles and URLs must wrap without horizontal overflow.
- Existing `ScrollReveal` behavior is reused; no new animation system is introduced.

## Visual Direction

Follow existing subpage conventions: a centered content column, generous vertical spacing, large high-weight headings, muted supporting text, hairline dividers, and raised dark cards over the global cosmic background.

Visual emphasis descends in this order:

1. Hero and Join Yoonity
2. Collaboration
3. Resources
4. Channels
5. News

Channels stays compact while both cards are coming soon, allowing News to read as the final substantive content before the footer.

## Metadata and Navigation

The route exports Korean metadata describing the laboratory introduction, graduate-student recruitment, collaboration, resources, and news. Both desktop and mobile `연구실 살펴보기` links change from the nonexistent `/#research` anchor to `/about`.

## Accessibility

- Preserve semantic heading order beginning with a single page `h1`.
- All interactive controls must be keyboard reachable and visibly focused.
- Coming-soon cards must not be focusable.
- Link labels must describe their destination without relying only on icons.
- The News toggle must announce its expanded state.
- Existing color tokens must retain readable contrast against the site background.

## Verification

- Verify the six sections render in the agreed order.
- Verify desktop and mobile header buttons navigate to `/about`.
- Test each sheet-row normalizer and independent local fallback.
- Test invalid resource rows, missing email, active channels without URLs, hidden items, and three-or-fewer news items.
- Test News initial limit, expansion, collapse, and `aria-expanded` state.
- Verify resource/news links open safely and the collaboration link targets `yoonity25@gmail.com`.
- Check desktop and mobile layouts, keyboard navigation, focus states, and long-title wrapping.
- Run lint, type checking, relevant tests, and a production build.

## Out of Scope

- Creating or publishing the Blog and GitHub destinations
- A server-side contact form, spam prevention, or email delivery service
- Automatic scraping or synchronization from the existing Yoonity website
- Redesigning the global header, footer, background, or unrelated pages
