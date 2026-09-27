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
const { WEDDING, CONTACT, REHEARSAL, CATEGORIES, PLACES } = new Function(
  `${src}; return { WEDDING, CONTACT, REHEARSAL, CATEGORIES, PLACES };`
)();

const isTodo = (v) => typeof v === "string" && v.includes("TODO");
const findings = [];

for (const [key, value] of Object.entries(WEDDING)) {
  if (isTodo(value)) findings.push(`WEDDING.${key} — ${value}`);
}
if (!WEDDING.playlistUrl) findings.push("WEDDING.playlistUrl — empty, so the playlist button is hidden");
for (const [key, value] of Object.entries(CONTACT)) {
  if (isTodo(value)) findings.push(`CONTACT.${key} — ${value}`);
}
if (REHEARSAL) {
  for (const [key, value] of Object.entries(REHEARSAL)) {
    if (isTodo(value)) findings.push(`REHEARSAL.${key} — ${value}`);
  }
  // Empty time is a deliberate "Time TBD" on the page, but still unfinished.
  if (!REHEARSAL.time) findings.push('REHEARSAL.time — empty, so the card shows "Time coming soon"');
}
for (const place of PLACES) {
  const fields = ["name", "blurb", "query"].filter((f) => isTodo(place[f]));
  if (fields.length) findings.push(`PLACES["${place.id}"] — unfinished: ${fields.join(", ")}`);
}

// Guests never see a TODO — the page hides unset fields and shows "Time coming
// soon" — so everything below is about what's missing, not what's broken.
console.log(`\n${PLACES.length} places, ${PLACES.filter((p) => p.pick).length} marked as your picks\n`);
const emptyGroups = [];
for (const cat of CATEGORIES) {
  const inCat = PLACES.filter((p) => p.category === cat.id);
  const picks = inCat.filter((p) => p.pick).length;
  console.log(`  ${cat.label.padEnd(16)} ${String(inCat.length).padStart(2)} places, ${picks} picks`);
  for (const g of cat.groups) {
    if (!inCat.some((p) => p.group === g.id)) emptyGroups.push(`${cat.label} › ${g.label} (group: "${g.id}")`);
  }
}
if (emptyGroups.length) {
  console.log(`\nEmpty groups — hidden from guests until you add a place:`);
  emptyGroups.forEach((g) => console.log(`  - ${g}`));
}

if (!findings.length) {
  console.log("No TODOs left — the guide is ready to share.\n");
  process.exit(0);
}

console.log(`\n${findings.length} unfinished detail${findings.length === 1 ? "" : "s"} (hidden from guests until filled in):\n`);
findings.forEach((f) => console.log(`  - ${f}`));
console.log("");

process.exit(process.argv.includes("--strict") ? 1 : 0);
