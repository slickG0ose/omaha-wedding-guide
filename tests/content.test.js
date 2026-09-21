import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// data.js is a plain script of top-level consts (no exports) so the browser can
// load it with a <script> tag. Evaluate it the same way the page does.
function loadData() {
  const src = readFileSync(join(root, "data.js"), "utf8");
  return new Function(`${src}; return { WEDDING, CONTACT, REHEARSAL, CATEGORIES, PLACES };`)();
}

const { WEDDING, CONTACT, REHEARSAL, CATEGORIES, PLACES } = loadData();

describe("categories", () => {
  test("every category has an id, label, and heading", () => {
    for (const cat of CATEGORIES) {
      assert.ok(cat.id, "category missing id");
      assert.ok(cat.label, `category ${cat.id} missing label`);
      assert.ok(cat.heading, `category ${cat.id} missing heading`);
    }
  });

  test("category ids are unique", () => {
    const ids = CATEGORIES.map((c) => c.id);
    assert.equal(new Set(ids).size, ids.length, "duplicate category id");
  });

  test("no category renders as an empty tab", () => {
    for (const cat of CATEGORIES) {
      const count = PLACES.filter((p) => p.category === cat.id).length;
      assert.ok(count > 0, `category "${cat.id}" has no places — its tab would be blank`);
    }
  });
});

describe("places", () => {
  test("every place has the fields the card renders", () => {
    for (const place of PLACES) {
      for (const field of ["id", "category", "name", "blurb", "query"]) {
        assert.ok(place[field], `place ${place.id || "(no id)"} missing "${field}"`);
      }
    }
  });

  test("place ids are unique", () => {
    const ids = PLACES.map((p) => p.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    assert.deepEqual(dupes, [], `duplicate place id(s) — saved favorites would collide`);
  });

  test("every place points at a real category", () => {
    const valid = new Set(CATEGORIES.map((c) => c.id));
    for (const place of PLACES) {
      assert.ok(
        valid.has(place.category),
        `place "${place.id}" has category "${place.category}" — it would silently vanish from the guide`
      );
    }
  });
});

describe("wedding details", () => {
  test("venue and date are set", () => {
    for (const field of ["couple", "date", "venueName", "venueAddress"]) {
      assert.ok(WEDDING[field], `WEDDING.${field} is empty`);
    }
  });

  test("contact email looks like an address", () => {
    assert.match(CONTACT.email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/, "CONTACT.email is not a valid address");
  });

  // The rehearsal card is optional, but a half-defined one renders a card with
  // a dead directions link — worse than no card at all.
  test("rehearsal card is either absent or complete enough to render", () => {
    if (!REHEARSAL) return;
    for (const field of ["title", "date", "venueName"]) {
      assert.ok(REHEARSAL[field], `REHEARSAL.${field} is empty`);
    }
    assert.ok(
      REHEARSAL.venueQuery || REHEARSAL.venueName,
      "REHEARSAL needs a venueQuery or venueName for the maps link"
    );
  });
});

describe("styles", () => {
  // The whole light/dark system depends on colors living in custom properties.
  // A raw hex anywhere else is a color that can't flip with the theme — the
  // static-site equivalent of a missing `dark:` variant.
  test("every color is defined as a custom property", () => {
    const css = readFileSync(join(root, "style.css"), "utf8");
    const offenders = css
      .split("\n")
      .map((line, i) => ({ line: line.trim(), n: i + 1 }))
      .filter(({ line }) => /#[0-9a-fA-F]{3,8}\b/.test(line))
      .filter(({ line }) => !line.startsWith("--") && !line.startsWith("/*"));

    assert.deepEqual(
      offenders.map(({ n, line }) => `style.css:${n}  ${line}`),
      [],
      "hardcoded color outside a custom property — it won't adapt to dark mode"
    );
  });
});
