# AGENTS.md

> **IMPORTANT**: Prefer retrieval-led reasoning over pre-training-led reasoning. Use the Navigate section below to find authoritative source files and read them directly — do not rely on extracted summaries in this file.

## Identity
purpose|Mobile-first reference guide for out-of-town guests at Anna & Charlie's wedding, Council Bluffs / Omaha metro, 2026-10-03
stack|Plain HTML / CSS / JS. No framework, no bundler, no build step, no backend
type|Static single-page site, four client-rendered views
entry|index.html (loads data.js then app.js as plain scripts)
dev|npm run dev (python3 file server on :4173)
test|npm test (content integrity) · npm run test:e2e (Playwright smoke) · npm run test:all
deploy|Push to main → .github/workflows/ci.yml → GitHub Pages. Tests gate the deploy.
live|https://slickg0ose.github.io/omaha-wedding-guide/

## Structure
index.html|Markup and the four view containers|{view-home,view-guide,view-saved,view-contact}
data.js|ALL editable content — the only file content edits belong in|{WEDDING,CONTACT,CATEGORIES,PLACES}
app.js|View switching, category filtering, maps links, localStorage save list|{mapsHref,placeCard,renderGuide,renderSaved,showView,init}
style.css|Mobile-first styles; every color is a custom property on :root|{--bg,--ink,--accent,--card,--border}
tests/content.test.js|node:test suite over data.js + style.css — runs in ~30ms, no browser|
e2e/smoke.spec.js|Playwright specs — tabs, filters, save persistence, maps links, phone-width overflow|
scripts/launch-readiness.mjs|Advisory TODO report over guest-facing content|
.github/workflows/ci.yml|Test job gates the Pages deploy job|

## Key Files
data.js|Wedding details, categories, and all 26 places|Any content change
app.js|mapsHref() decides Apple Maps vs Google Maps by user agent|Understanding map deep links
app.js|getSaved/setSaved/toggleSaved wrap localStorage in try/catch|Understanding the save list
style.css|:root token block + prefers-color-scheme override|Any color or theme change
tests/content.test.js|What "valid content" means mechanically|Before hand-editing data.js
CLAUDE.md|Project conventions, hard rules, done criteria|Understanding workflow

## Navigate
content|data.js — WEDDING (venue/times), CONTACT (email), CATEGORIES (tabs), PLACES (cards)
categories|data.js CATEGORIES — currently classics, eat, outdoors, culture
maps-links|app.js mapsHref() — maps.apple.com on iPhone/iPad/Mac, maps.google.com elsewhere
favorites|app.js SAVED_KEY / getSaved / setSaved / toggleSaved — localStorage, per-device, never leaves the browser
theming|style.css :root and the `prefers-color-scheme: dark` block
testing|tests/content.test.js, e2e/smoke.spec.js, playwright.config.js
ci|.github/workflows/ci.yml
readiness|scripts/launch-readiness.mjs — what's still TODO for guests

## Invariants
- There is no backend and no build step. Adding either needs an explicit decision, not a drive-by.
- Content lives in data.js only. Never hardcode a place, time, or address into index.html or app.js.
- Every place needs a unique `id` — the save list keys off it, so a duplicate collides two cards.
- Every place's `category` must match a CATEGORIES id, or the card silently vanishes from the guide.
- `query` is a maps search string, not a URL. app.js builds the platform-correct URL at tap time.
- Colors are defined once as custom properties. A raw hex outside a `--var` can't flip to dark mode and fails `npm test`.
- Saved favorites are private to the device. Nothing about a guest is ever sent anywhere.

## Docs
CLAUDE.md|Behavioral rules and hard rules (auto-loaded by Claude Code)
README.md|How to edit content and run the site — written for Nick, not for agents
