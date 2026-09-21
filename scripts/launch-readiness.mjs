// Reports anything still marked TODO in the guest-facing content.
// Deliberately advisory, not a hard failure: TODOs are expected while the guide
// is being filled in. Run it before you send the link to anyone.
//
//   npm run check:ready          report only
//   npm run check:ready -- --strict   exit 1 if anything is unfinished

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "data.js"), "utf8");
const { WEDDING, CONTACT, REHEARSAL, PLACES } = new Function(
  `${src}; return { WEDDING, CONTACT, REHEARSAL, PLACES };`
)();

const isTodo = (v) => typeof v === "string" && v.includes("TODO");
const findings = [];

for (const [key, value] of Object.entries(WEDDING)) {
  if (isTodo(value)) findings.push(`WEDDING.${key} — ${value}`);
}
for (const [key, value] of Object.entries(CONTACT)) {
  if (isTodo(value)) findings.push(`CONTACT.${key} — ${value}`);
}
if (REHEARSAL) {
  for (const [key, value] of Object.entries(REHEARSAL)) {
    if (isTodo(value)) findings.push(`REHEARSAL.${key} — ${value}`);
  }
  // Empty time is a deliberate "Time TBD" on the page, but still unfinished.
  if (!REHEARSAL.time) findings.push('REHEARSAL.time — empty, so the card shows "Time TBD"');
}
for (const place of PLACES) {
  const fields = ["name", "blurb", "query"].filter((f) => isTodo(place[f]));
  if (fields.length) findings.push(`PLACES["${place.id}"] — unfinished: ${fields.join(", ")}`);
}

const counts = PLACES.reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {});

console.log(`\n${PLACES.length} places: ${Object.entries(counts).map(([c, n]) => `${c} ${n}`).join(", ")}`);

if (!findings.length) {
  console.log("No TODOs left — the guide is ready to share.\n");
  process.exit(0);
}

console.log(`\n${findings.length} unfinished item${findings.length === 1 ? "" : "s"} still visible to guests:\n`);
findings.forEach((f) => console.log(`  - ${f}`));
console.log("");

process.exit(process.argv.includes("--strict") ? 1 : 0);
