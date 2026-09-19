# omaha-wedding-guide

Short-lived static site: a mobile-first guide for out-of-town guests at Anna
& Charlie's wedding in Omaha (October 3, 2026). Not a product — throwaway
after the wedding weekend, so keep it lightweight.

## Stack

Plain HTML/CSS/JS. No framework, no build step, no backend. "Save to list"
uses `localStorage` only — there is no server-side user data.

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
