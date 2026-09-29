// Renders share.png (the link-preview card iMessage/Slack/etc. show) and
// apple-touch-icon.png (home-screen icon) from inline HTML, using the
// Playwright install the test suite already has. Dev-time only; re-run it if
// the couple's name, date, or palette changes:
//
//   node scripts/make-share-images.mjs

import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { WEDDING } = new Function(`${readFileSync(join(root, "data.js"), "utf8")}; return { WEDDING };`)();

// Same palette as style.css's light theme.
const C = { bg: "#f7f2ea", ink: "#221c17", muted: "#6f6458", accent: "#a8452f", border: "#e8dfd2" };
// Single-quoted family names — these land inside style="..." attributes.
const serif = `'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif`;
const sans = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;

const card = `<!doctype html><html><body style="margin:0">
<div style="width:1200px;height:630px;box-sizing:border-box;background:${C.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border:18px solid ${C.bg};outline:2px solid ${C.border};outline-offset:-40px;">
  <div style="font:600 26px ${sans};letter-spacing:.2em;text-transform:uppercase;color:${C.accent}">Welcome to Omaha</div>
  <div style="font:400 132px/1.05 ${serif};color:${C.ink};margin:22px 0 26px">${WEDDING.couple.replace("&", "&amp;")}</div>
  <div style="display:flex;align-items:center;gap:22px;font:400 34px ${sans};color:${C.muted}">
    <span style="width:60px;height:2px;background:${C.border}"></span>${WEDDING.date}<span style="width:60px;height:2px;background:${C.border}"></span>
  </div>
  <div style="margin-top:34px;font:600 28px ${sans};color:${C.ink}">Wedding details · Where to eat · What to do</div>
</div></body></html>`;

const icon = `<!doctype html><html><body style="margin:0">
<div style="width:180px;height:180px;background:${C.accent};display:flex;align-items:center;justify-content:center;font:400 78px ${serif};color:#fff;letter-spacing:-.02em">A&amp;C</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(card);
await page.screenshot({ path: join(root, "share.png") });
await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(icon);
await page.screenshot({ path: join(root, "apple-touch-icon.png") });
await browser.close();
console.log("wrote share.png and apple-touch-icon.png");
