# SampleWebsite: a vanilla landing-page template you can rebrand

A polished, conversion-focused website starter in plain **HTML, CSS and JavaScript**, with no build step and no framework. You can re-skin it for a new industry in minutes.

```
index.html          ← the landing page (all sections)
thank-you.html      ← post-form conversion page (put your ad/analytics pixel here)
privacy.html        ← privacy policy + terms (placeholder text)
404.html            ← friendly not-found page
assets/css/theme.css← ★ brand knobs: colors, fonts, radii, presets
assets/css/main.css ← layout & components (rarely needs edits)
assets/js/main.js   ← progressive enhancements, form handling, analytics hooks
assets/img/         ← favicon, app icons, social share image
tools/              ← og-image.html template + build-images.js
robots.txt · sitemap.xml · site.webmanifest · _headers
```

Preview it with any static server, for example:

```bash
npx serve .
```

You can also just open `index.html` in a browser.

---

## Rebrand for a new client (about 15 minutes)

1. **Pick a palette.** Set `data-preset` on `<html>` in every page:

   | preset | good fit for |
   |---|---|
   | `violet` | agencies, tech, creative, coaching |
   | `ocean` | marine, health, cleaning, pools, finance |
   | `ember` | trades, roofing, restaurants, fitness |
   | `forest` | landscaping, wellness, real estate, eco |
   | `rose` | beauty, salons, weddings, boutique retail |
   | `mono` | law, architecture, luxury, consulting |

   For a fully custom brand, change `--hue`, `--chroma` and `--accent-hue` at the top of `theme.css`. Every color, including dark mode, is derived from those numbers with OKLCH.

   Leave `data-demo` on `<html>` while you're showing a client. It adds a floating palette switcher. **Remove it before launch.**

2. **Find and replace** these across the project:
   - `Brightline` → business name
   - `example.com` / `www.example.com` → real domain
   - `(555) 123-4567` and `+15551234567` → phone number (display and `tel:` formats)
   - `hello@example.com` → email
   - `Your City`, `123 Main Street…`, `ST 00000` → location

3. **Search `EDIT:`** in `index.html`. That flags the title and description, H1, structured data, announcement bar and form endpoint.

4. **Rewrite the copy** for the industry: services, stats, reviews, pricing and FAQ. Every section is a self-contained `<section>`, so delete any you don't need. Pricing is the usual one to drop.

5. **Swap the visuals.** The hero and "Why us" panels use brand-tinted SVG art, so the template looks finished with no photos. Replace them with real images (comments mark the spots). Use WebP/AVIF with `width`/`height`, `loading="lazy"` below the fold, and `fetchpriority="high"` on the hero image.

6. **Logo.** Replace the inline SVG in the header and footer, and `assets/img/favicon.svg`.

7. **Regenerate the social image and icons.** Edit `tools/og-image.html`, then run:

   ```bash
   npm i -D playwright && npx playwright install chromium
   ```

   ```bash
   node tools/build-images.js
   ```

8. **Connect the form.** Set `action` on the `<form>` to Formspree, Basin, Netlify Forms, a CRM webhook or similar. While it's `#`, the form validates and then goes straight to `thank-you.html` so you can demo the full funnel.

9. **Add analytics.** Paste GA4, GTM or Plausible into `<head>`. Every element with `data-track="…"` already pushes a click event to `window.dataLayer`. The form pushes `form_start` and `generate_lead`.

10. **Update** `sitemap.xml`, `robots.txt` and `site.webmanifest`. The header and footer are repeated in each HTML file, so copy any changes to all four pages.

---

## Example: rustic pizzeria (`examples/pizza/`)

This example shows how far you can push the template without editing the shared files. The page loads three stylesheets in order:

```
../../assets/css/theme.css   shared tokens          (unchanged)
../../assets/css/main.css    shared components      (unchanged)
rustic.css                   the "skin" for this client
```

`rustic.css` changes:

- **Tokens:** a parchment, brick-red, olive and espresso palette with its own dark mode, square-ish corners, and hard "letterpress" shadows instead of soft blur.
- **Fonts:** Alfa Slab One for headlines, Lora for body text, and Caveat for hand-written notes.
- **Textures:** paper grain, brick, wood grain, gingham and torn-paper edges, all made from tiny inline SVGs or CSS gradients with no image files.
- **Restyled components:** the same markup gets a new look. Pricing cards become a chalkboard specials board, testimonials become taped-up notes, stats sit on a wooden board, and the catering panel is a brick wall.
- **New components:** a printed menu with dotted price leaders, an order receipt with a torn edge, a rubber stamp, and a chalk sign.

The shared JavaScript still runs the mobile menu, reveal animations, counters, form validation and click tracking. To make a skin for another client, copy `rustic.css`, change the tokens at the top, and keep only the component overrides you want.

---

## What's built in

**SEO**
- Unique title and meta description, canonical URL, robots meta, a single H1, and semantic landmarks
- Open Graph and Twitter cards with a 1200×630 share image
- JSON-LD `@graph`: `LocalBusiness` (address, hours, rating), `WebSite`, and `FAQPage`, which mirrors the on-page FAQ
- `sitemap.xml`, `robots.txt`, web manifest, SVG, PNG and Apple touch icons, and `theme-color`
- Consistent NAP (name, address, phone) in the footer `<address>` for local SEO
- `noindex` on the thank-you and 404 pages

**Conversion and CTA practices**
- One primary action ("Get my free quote") repeated in the header, hero, services, about, process, pricing, contact and final band, with click-to-call as the consistent secondary action
- Risk reducers under the CTAs (no obligation, fast reply, licensed) plus a guarantee line under pricing
- Social proof above the fold (rating and avatars), a logo marquee, stats counters and attributed reviews
- A dismissible offer bar for urgency
- A short form (three required fields) that says how long it takes, gives inline validation, includes a privacy reassurance, uses a honeypot instead of a CAPTCHA, and ends on a "what happens next" thank-you page
- A sticky call and quote bar on mobile that appears after the hero and hides at the form
- Pricing that highlights the middle tier and offers a monthly/yearly toggle

**Accessibility and performance**
- Skip link, visible focus rings, ARIA on the menu, toggles and form errors, and `prefers-reduced-motion` support
- Light and dark modes that follow the OS, with a manual toggle and no flash on load
- Zero dependencies: about 15 KB of CSS and JS gzipped, fonts loaded with `display=swap`, and an inline SVG icon sprite
- Works without JavaScript (all content is visible, and FAQ uses native `<details>`)
- `_headers` sets security and caching headers on Netlify and Cloudflare Pages

## Deploy

Any static host works: Netlify, Cloudflare Pages, Vercel, GitHub Pages or S3. Point your host's 404 page to `404.html`.
