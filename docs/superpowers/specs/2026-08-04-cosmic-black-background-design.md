# Cosmic Black Background Design

## Decision

Use the selected **Cosmic Black** palette with `#05070B` as the permanent site background. The site will use one intentional dark appearance rather than switching between light and dark palettes according to the operating-system preference.

## Visual Direction

- Base background (`--paper`): `#05070B`
- Raised surfaces (`--paper-raised`): `#0D1118`
- Primary text (`--ink`): `#F5F4F0`
- Secondary text (`--ink-muted`): `#A3A3AC`
- Dividers (`--hairline`): `#20242C`
- Accent colors: purple `#9186FF`, coral `#FF8A70`, and teal `#2FD9C8`
- Atmosphere: retain the existing Three.js stars, geometric sculpture, and subtle purple/teal radial light
- Body texture: remove the current light-theme dot grid so the cosmic scene reads cleanly against the black base

## Component Behavior

All components continue to use the existing semantic tokens (`paper`, `paper-raised`, `ink`, `ink-muted`, and `hairline`). No component-specific color rewrite is required. Cards, menus, header blur, buttons, tabs, and footer inherit the new permanent dark tokens.

The header logo treatment must remain legible on the dark surface. Existing white/transparent imagery and content photography are preserved.

## Accessibility

- Primary text must retain at least WCAG AA contrast against `#05070B`.
- Muted text and hairlines must remain visible without appearing bright.
- Focus, hover, and active states continue using the existing accent colors.
- Reduced-motion behavior for the background scene remains unchanged.

## Scope

This change is limited to the site color tokens and body background treatment. It does not redesign layouts, typography, animation timing, content, or the Three.js scene.

## Verification

- Run the production build and lint checks.
- Verify the homepage and representative content pages at desktop and mobile widths.
- Confirm cards, header menus, buttons, photos, links, and footer remain readable.
- Confirm the site stays Cosmic Black regardless of the browser's light/dark preference.
