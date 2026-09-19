const SAVED_KEY = "omaha-guide-saved-v1";

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
  });

  renderGuide("all");
}

document.addEventListener("DOMContentLoaded", init);
