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
  return new Function(`${src}; return { WEDDING, CONTACT, REHEARSAL, CATEGORIES, AREAS, PLACES };`)();
}

const { WEDDING, CONTACT, REHEARSAL, CATEGORIES, AREAS, PLACES } = loadData();

describe("categories", () => {
  test("every category has an id, label, heading, and at least one group", () => {
    for (const cat of CATEGORIES) {
      assert.ok(cat.id, "category missing id");
      assert.ok(cat.label, `category ${cat.id} missing label`);
      assert.ok(cat.heading, `category ${cat.id} missing heading`);
      assert.ok(cat.groups?.length, `category ${cat.id} has no groups`);
      for (const g of cat.groups) assert.ok(g.id && g.label, `category ${cat.id} has a group missing id/label`);
    }
  });

  test("group ids are unique within their category", () => {
    for (const cat of CATEGORIES) {
      const ids = cat.groups.map((g) => g.id);
      assert.equal(new Set(ids).size, ids.length, `duplicate group id in ${cat.id}`);
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
      for (const field of ["id", "category", "group", "name", "blurb", "query"]) {
        assert.ok(place[field], `place ${place.id || "(no id)"} missing "${field}"`);
      }
    }
  });

  // The neighborhood view only draws places whose area is in AREAS — a typo
  // drops the place from that view with no error.
  test("every place has a real area", () => {
    const valid = new Set(AREAS.map((a) => a.id));
    for (const place of PLACES) {
      assert.ok(valid.has(place.area), `place "${place.id}" has area "${place.area}", which isn't in AREAS`);
    }
  });

  test("place ids are lowercase-hyphenated", () => {
    // Ids are storage keys for saved lists and trip codes — an apostrophe or
    // capital letter is an easy typo that makes a save silently fail to match.
    for (const place of PLACES) {
      assert.match(place.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, `place id "${place.id}" must be lowercase-hyphenated`);
    }
  });

  test("place ids are unique", () => {
    const ids = PLACES.map((p) => p.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    assert.deepEqual(dupes, [], `duplicate place id(s) — saved favorites would collide`);
  });

  // A group that doesn't exist in its category means the card never renders —
  // the same silent-vanish failure as a bad category.
  test("every place points at a real group in its category", () => {
    for (const place of PLACES) {
      const cat = CATEGORIES.find((c) => c.id === place.category);
      if (!cat) continue; // reported by the category test below
      assert.ok(
        cat.groups.some((g) => g.id === place.group),
        `place "${place.id}" has group "${place.group}", which isn't in category "${cat.id}"`
      );
    }
  });

  test("no TODO placeholders in place cards", () => {
    // WEDDING TODOs are hidden from guests by the page; place cards aren't, so a
    // TODO there would print verbatim.
    for (const place of PLACES) {
      for (const field of ["name", "blurb", "tip", "tag", "query"]) {
        assert.ok(!String(place[field] ?? "").includes("TODO"), `place "${place.id}" has a TODO in "${field}"`);
      }
    }
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
