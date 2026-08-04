# Cosmic Black Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the entire Yoonity site use the selected Cosmic Black palette (`#05070B`) regardless of operating-system color preference while preserving the existing cosmic animation and accent colors.

**Architecture:** Keep every component on the existing semantic color tokens and change only the global token definitions and body texture in `globals.css`. Verify the result at the CSS, production-build, and browser levels, then publish through the existing GitHub-to-Vercel pipeline.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, CSS custom properties, Three.js, Vercel

## Global Constraints

- `--paper` must be `#05070B` in every browser color preference.
- `--paper-raised` must be `#0D1118`.
- `--ink` must be `#F5F4F0`.
- `--ink-muted` must be `#A3A3AC`.
- `--hairline` must be `#20242C`.
- Accent colors must remain purple `#9186FF`, coral `#FF8A70`, and teal `#2FD9C8`.
- Preserve the existing Three.js stars, sculpture, radial light, and reduced-motion behavior.
- Remove the body dot-grid texture.
- Do not stage or modify unrelated untracked files.

---

### Task 1: Apply the permanent Cosmic Black token system

**Files:**
- Modify: `src/app/globals.css:3-56`

**Interfaces:**
- Consumes: Existing CSS custom properties referenced through Tailwind utilities such as `bg-paper`, `bg-paper-raised`, `text-ink`, `text-ink-muted`, and `border-hairline`.
- Produces: A single always-dark token set inherited by every existing component.

- [ ] **Step 1: Record the failing acceptance state**

Run the development server with the browser forced to a light color preference, inspect `document.body`, and record that its computed background is not `rgb(5, 7, 11)`.

```bash
npm run dev
```

Browser assertion:

```js
getComputedStyle(document.body).backgroundColor === "rgb(5, 7, 11)"
```

Expected before implementation: `false` when the browser uses the light preference.

- [ ] **Step 2: Replace the split light/dark token definitions with one palette**

Change the start of `src/app/globals.css` to exactly:

```css
:root {
  --paper: #05070b;
  --paper-raised: #0d1118;
  --ink: #f5f4f0;
  --ink-muted: #a3a3ac;
  --hairline: #20242c;

  --axis-ai: #9186ff;
  --axis-genai: #ff8a70;
  --axis-quantum: #2fd9c8;
}
```

Delete the entire `@media (prefers-color-scheme: dark)` token block.

- [ ] **Step 3: Remove the body dot-grid texture**

Keep the body background and text declarations, but delete these two declarations:

```css
background-image: radial-gradient(var(--hairline) 1px, transparent 1px);
background-size: 24px 24px;
```

- [ ] **Step 4: Run static verification**

```bash
npm run lint
npm run build
```

Expected: lint exits with no errors (the existing `related-articles.tsx` `<img>` warning may remain), and the Next.js production build exits successfully.

- [ ] **Step 5: Commit the palette implementation**

```bash
git add src/app/globals.css
git commit -m "feat: apply cosmic black site palette"
```

### Task 2: Verify representative pages and color-preference independence

**Files:**
- Test only: no production file changes expected

**Interfaces:**
- Consumes: The permanent token set from Task 1 and the existing page/component structure.
- Produces: Browser evidence that the design works across routes and viewport sizes.

- [ ] **Step 1: Verify the computed palette in light preference**

Open `/` with `colorScheme: "light"` and assert:

```js
getComputedStyle(document.documentElement).getPropertyValue("--paper").trim() === "#05070b"
getComputedStyle(document.body).backgroundColor === "rgb(5, 7, 11)"
getComputedStyle(document.body).color === "rgb(245, 244, 240)"
```

- [ ] **Step 2: Verify the computed palette in dark preference**

Repeat the same assertions with `colorScheme: "dark"`. Expected: all three assertions remain true and match the light-preference result.

- [ ] **Step 3: Check representative desktop routes**

At a 1440×900 viewport, inspect `/`, `/activities`, `/publications`, `/researchers`, and `/professor`. Confirm that the sticky header, dropdowns, buttons, raised cards, dividers, photographs, links, footer, and cosmic canvas remain readable without light-colored page gaps.

- [ ] **Step 4: Check a mobile route**

At a 375×812 viewport, inspect `/` and `/researchers`. Confirm no horizontal overflow, the mobile menu uses Cosmic Black surfaces, and cards/text remain readable.

- [ ] **Step 5: Confirm the implementation diff stays scoped**

```bash
git status -sb
git show --stat --oneline HEAD
```

Expected: the implementation commit changes only `src/app/globals.css`; unrelated untracked files remain untouched.

### Task 3: Publish and verify production

**Files:**
- No additional source changes expected

**Interfaces:**
- Consumes: The design commit and verified implementation commit on local `main`.
- Produces: GitHub `main` and the Vercel production alias serving the Cosmic Black design.

- [ ] **Step 1: Push the design, plan, and implementation commits**

```bash
git push origin main
```

Expected: GitHub `main` advances through the design, implementation-plan, and implementation commits.

- [ ] **Step 2: Wait for Vercel production readiness**

Use Vercel CLI to identify the deployment triggered by the pushed commit and wait until its status is `Ready`.

```bash
npx --yes vercel@latest ls yoonity-lab-site
npx --yes vercel@latest inspect https://yoonity-lab-site-git-main-lee1026icarus-projects.vercel.app --wait --timeout 3m
```

- [ ] **Step 3: Verify production responses and palette**

Confirm `/`, `/activities`, and `/researchers` return HTTP 200 through `https://yoonity-lab-site.vercel.app`. In a browser, assert the production body's computed background is `rgb(5, 7, 11)` and text is `rgb(245, 244, 240)`.

- [ ] **Step 4: Confirm repository alignment**

```bash
git rev-parse HEAD
git rev-parse origin/main
git status -sb
```

Expected: `HEAD` and `origin/main` match; only pre-existing unrelated untracked files remain.
