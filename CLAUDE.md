# omaha-wedding-guide

Short-lived static site: a mobile-first guide for out-of-town guests at Anna
& Charlie's wedding in Omaha (October 3, 2026). Not a product — throwaway
after the wedding weekend, so keep it lightweight.

## Stack

Plain HTML/CSS/JS. No framework, no build step, no backend. "Save to list"
uses `localStorage` only — there is no server-side user data.

Node is a dev-time dependency only (test runner + Playwright). The deployed
site is four static files. Don't introduce a bundler, a framework, or a
backend without an explicit decision — "it would be cleaner in React" is not
one at this size.

## Testing and shipping

Two suites, both fast, both required before anything reaches guests:

- `npm test` — content integrity over `data.js` and `style.css`
  (~30ms, no browser). Catches duplicate ids, categories that don't exist,
  missing fields, and colors that can't flip to dark mode.
- `npm run test:e2e` — Playwright smoke specs: tabs render, filters narrow,
  saving persists across reload, every maps link is well-formed, no
  horizontal scroll at phone width.
- `npm run check:ready` — advisory list of TODOs still visible to guests.
  Never blocks; run it before sending the link to anyone.

Push to `main` runs both suites in CI and only deploys to GitHub Pages if
they pass. A red test means the live site keeps serving the last good
version — that's the point, don't work around it.

## Done criteria

A content or UI change is done when: `npm run test:all` passes, the change
was actually looked at in a browser at phone width, and `npm run check:ready`
doesn't show a new TODO you introduced.

## Structure

- `index.html` — markup / view containers (home, guide, saved, contact)
- `style.css` — mobile-first styles, light/dark via `prefers-color-scheme`
- `app.js` — view switching, filtering, localStorage save/unsave
- `data.js` — all editable content (wedding details, contact, places list)

Content edits belong in `data.js` only. Don't hardcode wedding/venue/place
info into `index.html` or `app.js`.

## Hard rules — secrets & PII

Never commit real account numbers, passwords, or credentials into any file
here. Every commit is scanned by a gitleaks pre-commit hook
(`.githooks/pre-commit`, config in `.gitleaks.toml`). If it blocks a commit,
fix the content — don't bypass with `--no-verify`.
