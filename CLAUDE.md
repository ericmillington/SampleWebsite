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
templates/editorial/   Template 2, "Halfmoon Coffee": standalone editorial/photo-led design
  editorial.css        own tokens + layout (does NOT load assets/css); knobs: --accent-hue, --warm
  editorial.js         product rail, bag counter, subscription picker (plus shared ../../assets/js/main.js)
  img/                 placeholder JPGs; PHOTOS.md = shot list (file names, sizes, subjects)
templates/sketch/      Eric's own hand-drawn site mockup turned into a working page
  source.jpg           the original drawing (2048×2121); header/intro/work/footer.jpg are slices of it
  index.html           real links/inputs/submit button absolutely positioned (in % of each slice) over the drawn boxes
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
- **Editorial template design rules (Eric asked for this):** it must not "look like an AI site". So no centered eyebrow + heading + lede stacks, no rows of three equal cards, no gradient blobs, no checkmark lists everywhere. Break the column grid (bleeds, overlaps, offsets, oversized type), and lean on real photography for personality, not SVG illustrations.
- **Editorial form hooks:** `main.js` expects `#contact` and `form[data-validate]`. In the editorial template, `#contact` sits on the wholesale grid.
- **Sketch template rule (Eric asked for this):** it must look exactly like his drawing. Don't make design decisions or redraw anything. Interactive elements are invisible overlays on the drawn boxes. If the drawing changes, re-slice it and re-measure the hotspot rectangles (Python/PIL on source.jpg).
- Don't put model names in commits or code. Commit as Eric (`emillington@gmail.com`).

## How to verify changes

There's no test suite. Check visually with Playwright, which is pre-installed in cloud sessions:
- Serve the repo root with a tiny Node HTTP server and screenshot at 1440px and 390px wide, light and dark (`colorScheme: 'dark'`).
- Before full-page screenshots, add `.is-visible` to every `[data-reveal]` element, or sections render invisible.
- Exercise the flows: mobile menu open/close, theme toggle, submitting an empty form (errors appear), submitting a valid form (redirects to thank-you), the pricing toggle, and `JSON.parse` on each `ld+json` block.
- Regenerate images with `node tools/build-images.js`; prefix `NODE_PATH=$(npm root -g)` if `playwright` isn't installed locally.

## History

- **2026-10-30:** Built the base template; added a pizza example (color/font knob swap only); then restyled it with `rustic.css` (Alfa Slab One / Lora / Caveat, parchment/brick/olive palette, paper/brick/wood/gingham textures, chalkboard specials, printed menu with price leaders, order receipt, stamp, taped review notes). All pushed to `main`.
- **2026-10-31:** Built `templates/sketch/` from Eric's hand-drawn mockup: sliced the image into 4 sections, and overlaid real inputs, links and a Go! button on the drawn boxes. The demo submit shows "Thanks! Talk soon." The whole drawing scales down proportionally on phones (tiny there; a stacked mobile version was offered, not built).
- **2026-10-31:** Built Template 2 (`templates/editorial/`, Halfmoon Coffee) with placeholder photos, because photo hosts are blocked. Tested at desktop, mobile and dark; rail, bag counter, subscription picker, form → thank-you and JSON-LD all pass.
- **2026-10-31:** Discussed building sites from JPG/PNG mockups. The plan, if Eric uploads one: build it as another `examples/<name>/` with its own skin, compare screenshots against the mockup, and ask for original photos, logo and font names.

## Open items / ideas not yet done

- **Editorial template needs real photos.** The cloud environment's network policy blocks images.unsplash.com, unsplash.com and pexels.com. Eric chose to allow Unsplash in the environment settings; it hadn't taken effect by the end of the 2026-10-31 session. Next step: retry `curl https://images.unsplash.com/...`; if it works, pick photos matching `templates/editorial/img/PHOTOS.md`, download them at those sizes over the placeholders, and add credits to PHOTOS.md. Don't fake photos or hotlink unverified IDs.

- Order buttons on the pizza page point to `#menu`; a real client needs an ordering link (Toast, Square, Slice, …).
- Form `action` is still `#` everywhere (no real backend connected).
- Offered but not done: a GitHub Pages deploy workflow, so the site is viewable at `ericmillington.github.io/SampleWebsite/`.
- Hero and "about" images are SVG illustrations; real photos would replace them per client.
- The OG image in `assets/img/` is Brightline-branded; the pizza example reuses it.
