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
- `PLACES` — array of recommendation cards. Each needs `id` (unique),
  `category` (`eat` | `drink` | `do` | `stay`), `name`, `blurb`, `mapsUrl`.
  Add/remove/reorder freely.

No build step. Editing `data.js` and refreshing the page is the whole loop.

## Running locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Deploying

Plain static files (`index.html`, `style.css`, `app.js`, `data.js`) — deploy
to GitHub Pages, Netlify, or Vercel with zero config. No environment
variables, no build command.
