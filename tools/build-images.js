// Regenerates social/OG image and PNG icons from HTML/SVG sources.
// Requires Playwright:  npm i -D playwright && npx playwright install chromium
// Run from the repo root:  node tools/build-images.js
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const root = path.resolve(__dirname, "..");
const out = (f) => path.join(root, "assets/img", f);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto("file://" + path.join(root, "tools/og-image.html"), { waitUntil: "networkidle" });
  await page.screenshot({ path: out("og-image.png") });

  const svg = fs.readFileSync(out("favicon.svg"), "utf8");
  // Square (full-bleed) versions for platforms that apply their own mask (iOS, Android maskable)
  const square = svg.replace('rx="12"', 'rx="0"');
  for (const [file, size, src] of [["apple-touch-icon.png", 180, square], ["icon-192.png", 192, square], ["icon-512.png", 512, square], ["favicon-32.png", 32, svg]]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{width:${size}px;height:${size}px;display:block}</style>${src}`);
    await page.screenshot({ path: out(file), omitBackground: true });
  }
  await browser.close();
  console.log("Images written to assets/img/");
})();
