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

const HEART = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3s-7.5-4.6-9.2-9.4C1.6 7.4 3.8 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.4 0 5.6 3.4 4.4 6.9-1.7 4.8-9.2 9.4-9.2 9.4z"/></svg>`;

// A field still holding a TODO placeholder (or left empty) isn't ready for
// guests. The page hides it instead of printing "TODO: ..." to the world;
// `npm run check:ready` is where Nick sees what's left.
function isUnset(value) {
  return !value || String(value).includes("TODO");
}

const AREA_LABEL = new Map((typeof AREAS === "undefined" ? [] : AREAS).map((x) => [x.id, x.label]));

function groupLabel(place) {
  const cat = CATEGORIES.find((c) => c.id === place.category);
  return cat?.groups.find((g) => g.id === place.group)?.label || "";
}

// The card's small context line: in the neighborhood view every card in a
// section shares an area, so it says what kind of place it is instead.
function placeCard(place, isSaved, mode = "type") {
  const href = mapsHref(place.query);
  const context = mode === "area" ? groupLabel(place) : AREA_LABEL.get(place.area);
  const li = document.createElement("li");
  li.className = `place-card${place.pick ? " is-pick" : ""}`;
  li.innerHTML = `
    <div class="place-main">
      ${place.pick ? `<p class="pick-badge">${CONTACT.name}'s pick</p>` : ""}
      <a class="place-name" href="${href}" target="_blank" rel="noopener">${place.name}</a>
      ${context ? `<p class="place-area">${context}</p>` : ""}
      <p class="place-blurb">${place.blurb}</p>
      ${place.tip ? `<p class="place-tip">${place.tip}</p>` : ""}
      <div class="place-meta">
        <a class="place-link" href="${href}" target="_blank" rel="noopener">Directions</a>
        ${place.tag ? `<span class="place-tag">${place.tag}</span>` : ""}
      </div>
    </div>
    <button class="save-btn ${isSaved ? "is-saved" : ""}" data-id="${place.id}" aria-pressed="${isSaved}" aria-label="${isSaved ? "Remove" : "Save"} ${place.name}">
      ${HEART}
    </button>
  `;
  return li;
}

function placeList(places, saved, mode) {
  const ul = document.createElement("ul");
  ul.className = "place-list";
  places.forEach((p) => ul.appendChild(placeCard(p, saved.has(p.id), mode)));
  return ul;
}

// Nick's picks lead their group; everything else keeps data.js order.
function byPickFirst(a, b) {
  return Number(Boolean(b.pick)) - Number(Boolean(a.pick));
}

function renderGuide(filter, mode = "type") {
  if (mode === "area") return renderGuideByArea(filter);
  const container = document.getElementById("place-list");
  const saved = getSaved();
  container.innerHTML = "";

  CATEGORIES
    .filter((cat) => filter === "all" || cat.id === filter)
    .forEach((cat) => {
      const inCategory = PLACES.filter((p) => p.category === cat.id);
      if (!inCategory.length) return;

      const section = document.createElement("section");
      section.className = "group";
      section.innerHTML = `
        <h2 class="group-heading">${cat.heading}</h2>
        ${cat.intro ? `<p class="group-intro">${cat.intro}</p>` : ""}
      `;

      // Empty groups are skipped, so an unfilled slot never shows up as a
      // heading with nothing under it.
      (cat.groups || [{ id: null, label: "" }]).forEach((group) => {
        const places = inCategory
          .filter((p) => group.id === null || p.group === group.id)
          .sort(byPickFirst);
        if (!places.length) return;
        if (group.label) {
          const sub = document.createElement("h3");
          sub.className = "subgroup-heading";
          sub.textContent = group.label;
          section.appendChild(sub);
        }
        section.appendChild(placeList(places, saved));
      });

      container.appendChild(section);
    });
}

// Same places, sliced by neighborhood instead of by type — for "we're staying
// downtown, what's walkable?". The section chips still narrow it, so
// Food & Drink + By neighborhood answers "where do we eat near Benson?".
function renderGuideByArea(filter) {
  const container = document.getElementById("place-list");
  const saved = getSaved();
  const catOrder = new Map(CATEGORIES.map((c, i) => [c.id, i]));
  container.innerHTML = "";

  AREAS.forEach((area) => {
    const places = PLACES
      .filter((p) => p.area === area.id && (filter === "all" || p.category === filter))
      .sort((a, b) => byPickFirst(a, b) || catOrder.get(a.category) - catOrder.get(b.category));
    if (!places.length) return;

    const section = document.createElement("section");
    section.className = "group";
    section.innerHTML = `
      <h2 class="group-heading">${area.label}</h2>
      ${area.intro ? `<p class="group-intro">${area.intro}</p>` : ""}
      <h3 class="subgroup-heading">${places.length} spot${places.length === 1 ? "" : "s"}</h3>
    `;
    section.appendChild(placeList(places, saved, "area"));
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
  updateSavedCount(saved.size);
}

function updateSavedCount(n) {
  document.querySelectorAll(".saved-count").forEach((el) => {
    el.textContent = n ? String(n) : "";
    el.hidden = !n;
  });
}

function renderHomeSections() {
  const nav = document.getElementById("home-sections");
  nav.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    const count = PLACES.filter((p) => p.category === cat.id).length;
    if (!count) return;
    const a = document.createElement("a");
    a.className = "section-tile";
    a.href = `#guide/${cat.id}`;
    a.innerHTML = `
      <span class="section-tile-label">${cat.label}</span>
      <span class="section-tile-intro">${cat.intro || ""}</span>
      <span class="section-tile-count">${count} spots →</span>
    `;
    nav.appendChild(a);
  });
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

function currentGuideMode() {
  return document.querySelector(".mode-btn.is-active")?.dataset.mode || "type";
}

function setActiveMode(mode) {
  document.querySelectorAll(".mode-btn").forEach((b) => {
    const on = b.dataset.mode === mode;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", String(on));
  });
}

function refreshVisibleLists() {
  if (!document.getElementById("view-guide").hidden) renderGuide(currentGuideFilter(), currentGuideMode());
  if (!document.getElementById("view-saved").hidden) renderSaved();
  else updateSavedCount(getSaved().size);
}

function setActiveChip(filter) {
  document.querySelectorAll(".chip").forEach((c) => {
    const on = c.dataset.filter === filter;
    c.classList.toggle("is-active", on);
    c.setAttribute("aria-pressed", String(on));
  });
  // Keep the active chip in view when the row is wider than a phone screen.
  const active = document.querySelector(".chip.is-active");
  const row = document.getElementById("filters");
  if (active && row.scrollWidth > row.clientWidth) {
    row.scrollLeft = active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2;
  }
}

const VIEWS = ["home", "guide", "saved", "contact"];

function showView(name, filter, mode) {
  if (!VIEWS.includes(name)) name = "home";
  document.querySelectorAll(".view").forEach((v) => {
    v.hidden = v.id !== `view-${name}`;
  });
  document.querySelectorAll(".tab").forEach((t) => {
    const on = t.dataset.view === name;
    t.classList.toggle("is-active", on);
    if (on) t.setAttribute("aria-current", "page");
    else t.removeAttribute("aria-current");
  });
  document.body.dataset.view = name;
  if (name === "guide") {
    if (filter) setActiveChip(filter);
    if (mode) setActiveMode(mode);
    renderGuide(currentGuideFilter(), currentGuideMode());
  }
  if (name === "saved") renderSaved();
  window.scrollTo(0, 0);
}

// The hash is the source of truth for the current view, so the back button
// works and "#guide/eat" or "#guide/all/by-area" is a link Nick can text.
function routeFromHash() {
  const [view, filter, by] = location.hash.replace(/^#/, "").split("/");
  const validFilter = filter && CATEGORIES.some((c) => c.id === filter) ? filter : null;
  const isGuide = view === "guide";
  showView(
    view || "home",
    isGuide ? validFilter || "all" : null,
    isGuide ? (by === "by-area" ? "area" : "type") : null
  );
}

function guideHash(filter = "all", mode = "type") {
  if (mode === "area") return `#guide/${filter}/by-area`;
  return filter === "all" ? "#guide" : `#guide/${filter}`;
}

function navigate(view, filter, mode) {
  const hash = view === "home" ? "" : view === "guide" ? guideHash(filter, mode) : `#${view}`;
  if (location.hash === hash || (!hash && !location.hash)) {
    routeFromHash();
  } else if (hash) {
    location.hash = hash;
  } else {
    history.pushState(null, "", location.pathname + location.search);
    routeFromHash();
  }
}

function renderFilters() {
  const filters = document.getElementById("filters");
  filters.innerHTML = "";
  [{ id: "all", label: "All" }, ...CATEGORIES].forEach((cat, i) => {
    const chip = document.createElement("button");
    chip.className = `chip${i === 0 ? " is-active" : ""}`;
    chip.dataset.filter = cat.id;
    chip.setAttribute("aria-pressed", String(i === 0));
    chip.textContent = cat.label;
    filters.appendChild(chip);
  });
}

// Shows a detail row only once it has a real value; otherwise removes it or
// falls back to `pending` text so guests never see a half-written field.
function setDetail(rowId, ddId, value, pending) {
  if (!isUnset(value)) {
    document.getElementById(ddId).textContent = value;
  } else if (pending) {
    const dd = document.getElementById(ddId);
    dd.textContent = pending;
    dd.classList.add("is-pending");
  } else {
    document.getElementById(rowId).remove();
  }
}

function initWeddingCard() {
  document.getElementById("hero-title").textContent = WEDDING.couple;
  document.getElementById("hero-date").textContent = WEDDING.date;
  document.getElementById("venue-name").textContent = WEDDING.venueName;
  document.getElementById("venue-address").textContent = WEDDING.venueAddress;
  document.getElementById("venue-maps-link").href = mapsHref(WEDDING.venueQuery || WEDDING.venueAddress);

  setDetail("ceremony-row", "ceremony-time", WEDDING.ceremonyTime, "Time coming soon");
  setDetail("reception-row", "reception-time", WEDDING.receptionTime, "Time coming soon");
  setDetail("dress-row", "dress-code", WEDDING.dressCode);
  setDetail("hotel-row", "hotel-block", WEDDING.hotelBlock);

  // Only an https link renders — a typo'd or placeholder value just hides the
  // button rather than sending guests somewhere broken.
  const playlist = document.getElementById("playlist-link");
  if (/^https:\/\/\S+$/.test(WEDDING.playlistUrl || "")) {
    playlist.href = WEDDING.playlistUrl;
    playlist.hidden = false;
  }

  const notes = document.getElementById("wedding-notes");
  if (isUnset(WEDDING.notes)) notes.remove();
  else notes.textContent = WEDDING.notes;
}

function initRehearsalCard() {
  const card = document.getElementById("rehearsal-card");
  // REHEARSAL is optional — a guide without one just doesn't render the card.
  if (typeof REHEARSAL === "undefined" || !REHEARSAL) return;

  document.getElementById("rehearsal-date").textContent = REHEARSAL.date || "";
  document.getElementById("rehearsal-title").textContent = REHEARSAL.title;
  document.getElementById("rehearsal-venue").textContent = [REHEARSAL.venueName, REHEARSAL.venueArea]
    .filter(Boolean)
    .join(" · ");
  document.getElementById("rehearsal-maps-link").href = mapsHref(
    REHEARSAL.venueQuery || REHEARSAL.venueName
  );
  setDetail("rehearsal-time-row", "rehearsal-time", REHEARSAL.time, "Time coming soon");

  const notes = document.getElementById("rehearsal-notes");
  if (isUnset(REHEARSAL.notes)) notes.remove();
  else notes.textContent = REHEARSAL.notes;

  card.hidden = false;
}

function init() {
  initWeddingCard();
  initRehearsalCard();

  document.getElementById("contact-heading").textContent = `Ask ${CONTACT.name}`;
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
  renderHomeSections();

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => navigate(tab.dataset.view));
  });

  document.getElementById("filters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    navigate("guide", chip.dataset.filter, currentGuideMode());
  });

  document.getElementById("guide-mode").addEventListener("click", (e) => {
    const btn = e.target.closest(".mode-btn");
    if (!btn) return;
    navigate("guide", currentGuideFilter(), btn.dataset.mode);
  });

  window.addEventListener("hashchange", routeFromHash);
  window.addEventListener("popstate", routeFromHash);

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
  updateSavedCount(getSaved().size);
  routeFromHash();
}

document.addEventListener("DOMContentLoaded", init);
