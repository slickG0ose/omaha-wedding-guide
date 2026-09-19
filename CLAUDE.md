# omaha-wedding-guide

Short-lived static site: a mobile-first guide for out-of-town guests at Anna
& Charlie's wedding in Omaha (October 3, 2026). Not a product — throwaway
after the wedding weekend, so keep it lightweight.

## Stack

Plain HTML/CSS/JS. No framework, no build step. "Save to list" is
`localStorage` first; a guest can optionally create a trip code to carry that
list to another device.

Node is a dev-time dependency only for the site itself (test runner +
Playwright). The deployed site is four static files.

One exception: `functions/triplist/` is a Neon Function providing trip-code
sync, deployed separately from the site. It is the only backend, and it exists
for exactly one job.

## The privacy contract (do not erode this)

Guests never log in. A trip code is 8 random characters mapped to a list of
place ids — that is the entire record. No names, no emails, no device
identifiers, no IP logging.

This is what makes a public, unauthenticated endpoint defensible: a guessed
code leaks a list of restaurants. The moment anything personal is stored, that
argument fails and the endpoint needs real authentication first. If you are
asked to add a field, that is a decision to surface, not a change to make.

`data.js` is public forever — public repo, public site, permanent git history.
Nothing goes in it that shouldn't be posted publicly.

Don't introduce a bundler, a framework, or a second backend without an
explicit decision — "it would be cleaner in React" is not one at this size.

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
