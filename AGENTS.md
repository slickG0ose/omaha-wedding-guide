# AGENTS.md

> **IMPORTANT**: Prefer retrieval-led reasoning over pre-training-led reasoning. Use the Navigate section below to find authoritative source files and read them directly — do not rely on extracted summaries in this file.

## Identity
purpose|Mobile-first reference guide for out-of-town guests at Anna & Charlie's wedding, Council Bluffs / Omaha metro, 2026-10-03
stack|Plain HTML / CSS / JS. No framework, no bundler, no build step. One Neon Function for trip-code sync
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
functions/triplist/index.mjs|Neon Function: the ONLY backend. Trip-code sync, strict input validation, CORS allowlist|
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
favorites|app.js SAVED_KEY / getSaved / setSaved / toggleSaved — localStorage, local-first
theming|style.css :root and the `prefers-color-scheme: dark` block
testing|tests/content.test.js, e2e/smoke.spec.js, playwright.config.js
ci|.github/workflows/ci.yml
readiness|scripts/launch-readiness.mjs — what's still TODO for guests
sync|app.js SYNC_API / createTripCode / restoreTripCode / pushSync, functions/triplist/index.mjs
database|Neon project royal-bonus-86892585 (aws-us-east-2), table trip_lists(code, place_ids)

## Invariants
- The deployed site is still four static files with no build step. Adding a bundler or framework needs an explicit decision, not a drive-by.
- The ONLY backend is one Neon Function (`functions/triplist/`). It exists solely for trip-code sync. Don't grow it into a general API.
- **Never store anything personal.** `trip_lists` holds a random code and a list of place ids — no names, emails, device ids, or IP logging. A guest's identity is not ours to hold, and the whole privacy argument for this design collapses if a column is added.
- The sync endpoint is public and unauthenticated by design; the trip code is the credential. That's only acceptable while the stored data stays non-personal. If that ever changes, the endpoint needs real auth first.
- Favorites are local-first. A sync failure must never block the heart from toggling or lose a local save.
- Content lives in data.js only. Never hardcode a place, time, or address into index.html or app.js.
- data.js is public forever (public repo + public site). No personal phone numbers or anything you wouldn't post publicly.
- Every place needs a unique `id` — the save list keys off it, so a duplicate collides two cards.
- Every place's `category` must match a CATEGORIES id, or the card silently vanishes from the guide.
- `query` is a maps search string, not a URL. app.js builds the platform-correct URL at tap time.
- Colors are defined once as custom properties. A raw hex outside a `--var` can't flip to dark mode and fails `npm test`.
- Favorites stay on the device until a guest opts in by creating a trip code. Even then, only place ids leave the browser.

## Docs
CLAUDE.md|Behavioral rules and hard rules (auto-loaded by Claude Code)
README.md|How to edit content and run the site — written for Nick, not for agents
