const SAVED_KEY = "omaha-guide-saved-v1";

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
  return saved;
}

function placeCard(place, isSaved) {
  const li = document.createElement("li");
  li.className = "place-card";
  li.innerHTML = `
    <div class="place-main">
      <p class="place-name">${place.name}</p>
      <p class="place-blurb">${place.blurb}</p>
      <a class="place-link" href="${place.mapsUrl}" target="_blank" rel="noopener">View on map →</a>
    </div>
    <button class="save-btn ${isSaved ? "is-saved" : ""}" data-id="${place.id}" aria-label="Save ${place.name}">
      ${isSaved ? "♥" : "♡"}
    </button>
  `;
  return li;
}

function renderGuide(filter) {
  const list = document.getElementById("place-list");
  const saved = getSaved();
  list.innerHTML = "";
  PLACES
    .filter((p) => filter === "all" || p.category === filter)
    .forEach((p) => list.appendChild(placeCard(p, saved.has(p.id))));
}

function renderSaved() {
  const list = document.getElementById("saved-list");
  const empty = document.getElementById("saved-empty");
  const saved = getSaved();
  const items = PLACES.filter((p) => saved.has(p.id));
  list.innerHTML = "";
  items.forEach((p) => list.appendChild(placeCard(p, true)));
  empty.hidden = items.length > 0;
}

function currentGuideFilter() {
  return document.querySelector(".chip.is-active")?.dataset.filter || "all";
}

function refreshVisibleLists() {
  const guideVisible = !document.getElementById("view-guide").hidden;
  const savedVisible = !document.getElementById("view-saved").hidden;
  if (guideVisible) renderGuide(currentGuideFilter());
  if (savedVisible) renderSaved();
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

function fillText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  if (value) {
    el.textContent = value;
  } else {
    el.closest("div")?.remove() || el.remove();
  }
}

function init() {
  document.getElementById("hero-date").textContent = WEDDING.date;
  document.getElementById("venue-name").textContent = WEDDING.venueName;
  document.getElementById("venue-address").textContent = WEDDING.venueAddress;
  document.getElementById("venue-maps-link").href = WEDDING.venueMapsUrl;
  fillText("ceremony-time", WEDDING.ceremonyTime);
  fillText("reception-time", WEDDING.receptionTime);

  const dressRow = document.getElementById("dress-row");
  if (WEDDING.dressCode) {
    document.getElementById("dress-code").textContent = WEDDING.dressCode;
  } else {
    dressRow.remove();
  }

  const hotelRow = document.getElementById("hotel-row");
  if (WEDDING.hotelBlock) {
    document.getElementById("hotel-block").textContent = WEDDING.hotelBlock;
  } else {
    hotelRow.remove();
  }

  document.getElementById("wedding-notes").textContent = WEDDING.notes || "";

  document.getElementById("contact-blurb").textContent = CONTACT.blurb;
  const emailLink = document.getElementById("contact-email");
  emailLink.href = `mailto:${CONTACT.email}`;
  emailLink.textContent = `Email ${CONTACT.name}`;

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => showView(tab.dataset.view));
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      renderGuide(chip.dataset.filter);
    });
  });

  document.getElementById("view-guide").addEventListener("click", (e) => {
    const btn = e.target.closest(".save-btn");
    if (!btn) return;
    toggleSaved(btn.dataset.id);
    refreshVisibleLists();
  });

  document.getElementById("view-saved").addEventListener("click", (e) => {
    const btn = e.target.closest(".save-btn");
    if (!btn) return;
    toggleSaved(btn.dataset.id);
    refreshVisibleLists();
  });

  renderGuide("all");
}

document.addEventListener("DOMContentLoaded", init);
