const SAVED_KEY = "omaha-guide-saved-v1";
const CODE_KEY = "omaha-guide-code-v1";

// Neon Function fronting the trip_lists table. Public by design — the trip code
// is the only credential, and the stored data is a list of place ids, nothing
// about the guest. See functions/triplist/index.mjs.
const SYNC_API = "https://br-icy-surf-b5kfsyd2-triplist.compute.c-7.us-east-2.aws.neon.tech";

function getCode() {
  try {
    return localStorage.getItem(CODE_KEY) || "";
  } catch {
    return "";
  }
}

function setCode(code) {
  try {
    localStorage.setItem(CODE_KEY, code);
  } catch {
    // Storage unavailable — sync just won't persist past this session.
  }
}

// Apple platforms open the Maps app straight from a maps.apple.com link;
// everywhere else maps.google.com hands off to the Google Maps app when it's
// installed and falls back to the browser when it isn't.
function mapsHref(query) {
  const q = encodeURIComponent(query || "");
  const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  return isApple ? `https://maps.apple.com/?q=${q}` : `https://maps.google.com/?q=${q}`;
}

function getSaved() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function setSaved(set) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify([...set]));
  } catch {
    // localStorage unavailable (private mode, storage full) — save silently no-ops
  }
}

function toggleSaved(id) {
  const saved = getSaved();
  saved.has(id) ? saved.delete(id) : saved.add(id);
  setSaved(saved);
}

function placeCard(place, isSaved) {
  const href = mapsHref(place.query);
  const li = document.createElement("li");
  li.className = "place-card";
  li.innerHTML = `
    <div class="place-main">
      <div class="place-head">
        <a class="place-name" href="${href}" target="_blank" rel="noopener">${place.name}</a>
        ${place.tag ? `<span class="place-tag">${place.tag}</span>` : ""}
      </div>
      <p class="place-blurb">${place.blurb}</p>
      <a class="place-link" href="${href}" target="_blank" rel="noopener">Open in Maps →</a>
    </div>
    <button class="save-btn ${isSaved ? "is-saved" : ""}" data-id="${place.id}" aria-pressed="${isSaved}" aria-label="Save ${place.name}">
      ${isSaved ? "♥" : "♡"}
    </button>
  `;
  return li;
}

function placeList(places, saved) {
  const ul = document.createElement("ul");
  ul.className = "place-list";
  places.forEach((p) => ul.appendChild(placeCard(p, saved.has(p.id))));
  return ul;
}

function renderGuide(filter) {
  const container = document.getElementById("place-list");
  const saved = getSaved();
  container.innerHTML = "";

  CATEGORIES
    .filter((cat) => filter === "all" || cat.id === filter)
    .forEach((cat) => {
      const places = PLACES.filter((p) => p.category === cat.id);
      if (!places.length) return;
      const section = document.createElement("section");
      section.className = "group";
      const heading = document.createElement("h2");
      heading.className = "group-heading";
      heading.textContent = cat.heading;
      section.append(heading, placeList(places, saved));
      container.appendChild(section);
    });
}

function renderSaved() {
  const container = document.getElementById("saved-list");
  const empty = document.getElementById("saved-empty");
  const saved = getSaved();
  const order = new Map(CATEGORIES.map((c, i) => [c.id, i]));
  const items = PLACES
    .filter((p) => saved.has(p.id))
    .sort((a, b) => order.get(a.category) - order.get(b.category));

  container.innerHTML = "";
  if (items.length) container.appendChild(placeList(items, saved));
  empty.hidden = items.length > 0;
}

function setSyncStatus(message, isError = false) {
  const el = document.getElementById("sync-status");
  el.textContent = message;
  el.classList.toggle("is-error", isError);
}

function renderSyncState() {
  const code = getCode();
  document.getElementById("sync-idle").hidden = Boolean(code);
  document.getElementById("sync-active").hidden = !code;
  if (code) document.getElementById("sync-code").textContent = code;
}

async function syncRequest(path, options) {
  const res = await fetch(`${SYNC_API}${path}`, options);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `request failed (${res.status})`);
  return body;
}

async function createTripCode() {
  setSyncStatus("Creating your code…");
  try {
    const body = await syncRequest("/list", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ placeIds: [...getSaved()] })
    });
    setCode(body.code);
    renderSyncState();
    setSyncStatus("Code created. Your list will keep itself up to date.");
  } catch (err) {
    setSyncStatus(`Couldn't create a code: ${err.message}`, true);
  }
}

async function restoreTripCode(rawCode) {
  const code = rawCode.trim().toUpperCase();
  if (!/^[A-Z0-9]{8}$/.test(code)) {
    setSyncStatus("That doesn't look like a trip code — they're 8 letters and numbers.", true);
    return;
  }

  setSyncStatus("Looking up your list…");
  try {
    const body = await syncRequest(`/list?code=${encodeURIComponent(code)}`);
    setSaved(new Set(body.placeIds));
    setCode(code);
    renderSyncState();
    renderSaved();
    setSyncStatus(`Loaded ${body.placeIds.length} saved spot${body.placeIds.length === 1 ? "" : "s"}.`);
  } catch (err) {
    const message = err.message === "not found" ? "No list found for that code." : err.message;
    setSyncStatus(message, true);
  }
}

// Fire-and-forget: a failed push must never block the heart from toggling, so
// the local list stays the source of truth and this catches up when it can.
function pushSync() {
  const code = getCode();
  if (!code) return;

  syncRequest("/list", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code, placeIds: [...getSaved()] })
  }).catch(() => setSyncStatus("Saved on this device — couldn't reach sync just now.", true));
}

function currentGuideFilter() {
  return document.querySelector(".chip.is-active")?.dataset.filter || "all";
}

function refreshVisibleLists() {
  if (!document.getElementById("view-guide").hidden) renderGuide(currentGuideFilter());
  if (!document.getElementById("view-saved").hidden) renderSaved();
}

function showView(name) {
  document.querySelectorAll(".view").forEach((v) => {
    v.hidden = v.id !== `view-${name}`;
  });
  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.toggle("is-active", t.dataset.view === name);
  });
  if (name === "guide") renderGuide(currentGuideFilter());
  if (name === "saved") renderSaved();
}

function renderFilters() {
  const filters = document.getElementById("filters");
  filters.innerHTML = "";
  [{ id: "all", label: "All" }, ...CATEGORIES].forEach((cat, i) => {
    const chip = document.createElement("button");
    chip.className = `chip${i === 0 ? " is-active" : ""}`;
    chip.dataset.filter = cat.id;
    chip.textContent = cat.label;
    filters.appendChild(chip);
  });
}

function initWeddingCard() {
  document.getElementById("hero-date").textContent = WEDDING.date;
  document.getElementById("venue-name").textContent = WEDDING.venueName;
  document.getElementById("venue-address").textContent = WEDDING.venueAddress;
  document.getElementById("venue-maps-link").href = mapsHref(WEDDING.venueQuery || WEDDING.venueAddress);
  document.getElementById("ceremony-time").textContent = WEDDING.ceremonyTime;
  document.getElementById("reception-time").textContent = WEDDING.receptionTime;

  if (WEDDING.dressCode) {
    document.getElementById("dress-code").textContent = WEDDING.dressCode;
  } else {
    document.getElementById("dress-row").remove();
  }

  if (WEDDING.hotelBlock) {
    document.getElementById("hotel-block").textContent = WEDDING.hotelBlock;
  } else {
    document.getElementById("hotel-row").remove();
  }

  document.getElementById("wedding-notes").textContent = WEDDING.notes || "";
}

function init() {
  initWeddingCard();

  document.getElementById("contact-blurb").textContent = CONTACT.blurb;
  const emailLink = document.getElementById("contact-email");
  emailLink.href = `mailto:${CONTACT.email}`;
  emailLink.textContent = `Email ${CONTACT.name}`;

  // Only rendered when a number is actually set — see the note in data.js about
  // what belongs in a public repo.
  const phoneLink = document.getElementById("contact-phone");
  if (CONTACT.phone) {
    phoneLink.href = `sms:${CONTACT.phone.replace(/[^\d+]/g, "")}`;
    phoneLink.textContent = `Text ${CONTACT.name}`;
    phoneLink.hidden = false;
  }

  renderFilters();

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => showView(tab.dataset.view));
  });

  document.getElementById("filters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    renderGuide(chip.dataset.filter);
  });

  document.getElementById("views").addEventListener("click", (e) => {
    const btn = e.target.closest(".save-btn");
    if (!btn) return;
    toggleSaved(btn.dataset.id);
    refreshVisibleLists();
    pushSync();
  });

  document.getElementById("sync-create").addEventListener("click", createTripCode);

  document.getElementById("sync-restore-form").addEventListener("submit", (e) => {
    e.preventDefault();
    restoreTripCode(document.getElementById("sync-input").value);
  });

  renderSyncState();
  renderGuide("all");
}

document.addEventListener("DOMContentLoaded", init);
