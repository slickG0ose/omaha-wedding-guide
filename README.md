# Omaha Wedding Guide

Quick mobile-first reference site for out-of-town guests coming to Anna &
Charlie's wedding in Omaha (Saturday, October 3, 2026). Wedding logistics up
top, then a browsable guide to eat/drink/do/stay spots around town, with a
private "save to my list" feature (localStorage — no accounts, no backend).

## Editing content

Everything content-related lives in [`data.js`](data.js):

- `WEDDING` — venue, times, hotel block, dress code, notes. Replace every
  `TODO`.
- `CONTACT` — your name/email for the Contact tab.
- `CATEGORIES` — the tabs and section order on the Guide screen. Currently
  Classics, Food, Outdoors, Music & Arts.
- `PLACES` — array of recommendation cards. Each needs `id` (unique),
  `category` (matching a `CATEGORIES` id), `name`, `blurb`, and `query`.
  Optional `tag` renders a small pill (e.g. `Active`, `Laid-back`, `Coffee`).
  Add/remove/reorder freely.

`query` is just what you'd type into a maps search box — a place name or a
street address. The site builds the link at tap time: Apple Maps on
iPhone/iPad/Mac, Google Maps everywhere else, so it opens the native app
instead of a web page.

No build step. Editing `data.js` and refreshing the page is the whole loop.

## Running locally

```bash
npm run dev
```

Then open http://localhost:4173.

## Before you send the link to anyone

```bash
npm run test:all && npm run check:ready
```

`test:all` runs the content checks and the browser smoke tests. `check:ready`
lists anything still marked TODO that a guest would see — it's a report, not a
gate.

These run automatically on every push to `main`, and the site only redeploys
if they pass.

## Deploying

Plain static files (`index.html`, `style.css`, `app.js`, `data.js`) — deploy
to GitHub Pages, Netlify, or Vercel with zero config. No environment
variables, no build command.
