# Project notes for Claude

Read at the start of every session. Keep it current: update the **History** and **Open items** sections when meaningful work lands.

## What this is

A rebrandable, vanilla (no build step, no framework) landing-page template for service businesses. The owner, Eric, uses it as a starting point for client sites in different industries. Goals in his words: "all of the standards, SEO hooks and CTA best practices", "flexible, modern, fun, and POLISHED. Has to look good."

`README.md` is the human-facing guide (rebrand checklist, what's built in). Don't duplicate it here.

## Layout

```
index.html, thank-you.html, privacy.html, 404.html   base template ("Brightline", placeholder brand)
assets/css/theme.css   design tokens (OKLCH, derived from --hue/--chroma/--accent-hue) + presets + dark mode
assets/css/main.css    all shared layout/components
assets/js/main.js      progressive enhancement: nav, theme toggle, reveals, counters, pricing toggle,
                       form validation/submit, sticky mobile CTA, data-track → window.dataLayer
assets/img/            favicon.svg + generated PNGs (og-image, icons)
tools/                 og-image.html template + build-images.js (Playwright) to regenerate PNGs
examples/pizza/        "Fire & Dough": rustic pizzeria built on the template
  rustic.css           a "skin" layered after theme.css + main.css (palette, fonts, textures, overrides)
robots.txt, sitemap.xml, site.webmanifest, _headers (Netlify/Cloudflare security + caching)
```

## Conventions and decisions

- **Shared files stay industry-neutral.** Client-specific looks go in a per-site skin stylesheet loaded *after* `main.css` (see `examples/pizza/rustic.css`), not as edits to shared CSS.
- **Dark-mode tokens are defined twice** (an OS-preference media query, plus `:root[data-theme="dark"]` for the toggle). A skin that overrides tokens must repeat both blocks with the same selectors, or dark mode falls back to the template's colors.
- **Header, footer and icon sprite are duplicated in every HTML file** (no templating). Change them in all pages.
- **Forms:** `action="#"` is demo mode (validate, then redirect to `data-success`). A real endpoint gets POSTed via fetch. Each validated input needs an `id` with a matching `#<id>-error` element, or its error message won't show.
- **SEO per page:** unique title and description, canonical URL, OG/Twitter tags, and JSON-LD (`LocalBusiness`, or `Restaurant` for pizza, plus `FAQPage` mirroring the on-page FAQ). Thank-you and 404 pages are `noindex`.
- **Root `<html>` has `data-demo`,** which shows a floating palette switcher for client demos. Remove it before launch.
- **Placeholders to find and replace:** `Brightline`, `example.com`, `(555) 123-4567` / `+15551234567`, `hello@example.com`, `Your City`, `123 Main Street`.
- Don't put model names in commits or code. Commit as Eric (`emillington@gmail.com`).

## How to verify changes

There's no test suite. Check visually with Playwright, which is pre-installed in cloud sessions:
- Serve the repo root with a tiny Node HTTP server and screenshot at 1440px and 390px wide, light and dark (`colorScheme: 'dark'`).
- Before full-page screenshots, add `.is-visible` to every `[data-reveal]` element, or sections render invisible.
- Exercise the flows: mobile menu open/close, theme toggle, submitting an empty form (errors appear), submitting a valid form (redirects to thank-you), the pricing toggle, and `JSON.parse` on each `ld+json` block.
- Regenerate images with `node tools/build-images.js`; prefix `NODE_PATH=$(npm root -g)` if `playwright` isn't installed locally.

## History

- **2026-10-30:** Built the base template; added a pizza example (color/font knob swap only); then restyled it with `rustic.css` (Alfa Slab One / Lora / Caveat, parchment/brick/olive palette, paper/brick/wood/gingham textures, chalkboard specials, printed menu with price leaders, order receipt, stamp, taped review notes). All pushed to `main`.
- **2026-10-31:** Discussed building sites from JPG/PNG mockups. The plan, if Eric uploads one: build it as another `examples/<name>/` with its own skin, compare screenshots against the mockup, and ask for original photos, logo and font names.

## Open items / ideas not yet done

- Order buttons on the pizza page point to `#menu`; a real client needs an ordering link (Toast, Square, Slice, …).
- Form `action` is still `#` everywhere (no real backend connected).
- Offered but not done: a GitHub Pages deploy workflow, so the site is viewable at `ericmillington.github.io/SampleWebsite/`.
- Hero and "about" images are SVG illustrations; real photos would replace them per client.
- The OG image in `assets/img/` is Brightline-branded; the pizza example reuses it.
