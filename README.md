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
- `CATEGORIES` — the three Guide sections (Food & Drink, Things to Do,
  Entertainment) and the groups inside each (Coffee & Breakfast, Dinner,
  Bars & Breweries, Live Music & Shows, ...). Rename, add, or reorder freely.
- `AREAS` — the neighborhoods for the Guide's "By neighborhood" view
  (Downtown & Old Market, Midtown & Blackstone, Benson, Council Bluffs, ...).
- `PLACES` — the recommendation cards. Each needs `id` (unique), `category`
  and `group` (matching ids in `CATEGORIES`), `area` (matching an `AREAS`
  id), `name`, `blurb`, and `query`.
  Optional:
  - `pick: true` — marks it as **your** recommendation: "Nick's pick" badge,
    sorted to the top of its group.
  - `tip` — one line in your own voice (what to order, when to go).
  - `tag` — small pill (`Steak`, `Free`, `Hike`).

  There's a copy-paste template at the top of the Food & Drink block.

Empty groups are hidden from guests, so a slot you haven't filled yet just
doesn't show. Any `WEDDING` field still marked `TODO` is hidden too (times
show "Time coming soon"), so the link is safe to share while details are
still landing.

`query` is just what you'd type into a maps search box — a place name or a
street address. The site builds the link at tap time: Apple Maps on
iPhone/iPad/Mac, Google Maps everywhere else, so it opens the native app
instead of a web page.

No build step. Editing `data.js` and refreshing the page is the whole loop.

## Link preview image

`share.png` is what iMessage, Slack, etc. show when the link is pasted.
If the names, date, or colors change, regenerate it (and the home-screen
icon) with:

```bash
node scripts/make-share-images.mjs
```

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
lists unfinished wedding details, empty groups, and how many picks you've
marked per section — it's a report, not a gate.

Links can point at a section directly: `…/anna-and-charlie/#guide/eat`,
`#guide/do`, `#guide/fun`, `#saved`, `#contact`. Add `/by-area` for the
neighborhood view: `#guide/all/by-area`, `#guide/eat/by-area`.

These run automatically on every push to `main`, and the site only redeploys
if they pass.

## Trip codes (cross-device favorites)

Guests save spots to their own device. If they want the same list on another
phone or laptop, they tap **Create a trip code** and type that 8-character code
on the other device.

There are no accounts. The code maps to a list of place IDs and nothing else —
no name, no email, nothing identifying. Anyone with a code can read that list,
so it's a convenience, not a password.

The backend is a single Neon Function in `functions/triplist/`. To redeploy it
after a change:

```bash
npx neon@latest functions deploy triplist --src functions/triplist/index.mjs --project-id royal-bonus-86892585
```

After the wedding, deleting the Neon project removes every guest list at once.

## Deploying

Plain static files (`index.html`, `style.css`, `app.js`, `data.js`) — deploy
to GitHub Pages, Netlify, or Vercel with zero config. No environment
variables, no build command.
