import { test, expect } from "@playwright/test";

// The sync endpoint is stubbed on purpose. These specs are about the client's
// behaviour — what a guest sees on success, on a bad code, and when the network
// is down — and CI shouldn't depend on a live service or write rows to the real
// database on every run. The function's own contract is covered by its
// rejection cases, exercised against the deployed endpoint.
const API = /.*\.neon\.tech\/list.*/;

async function stub(page, handler) {
  await page.route(API, handler);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

// The restore field lives behind a disclosure so the card stays quiet for the
// common case. A guest restoring a list opens it first; so does every spec here.
async function openRestore(page) {
  await page.locator('.tab[data-view="saved"]').first().click();
  await page.locator(".sync-restore summary").click();
  await expect(page.locator("#sync-input")).toBeVisible();
}

async function saveFirstPlace(page) {
  await page.locator('.tab[data-view="guide"]').first().click();
  await page.locator(".save-btn").first().click();
}

test("creating a code shows it and remembers it", async ({ page }) => {
  await stub(page, (route) =>
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ code: "ABCD2345", placeIds: ["old-market"] })
    })
  );

  await saveFirstPlace(page);
  await page.locator('.tab[data-view="saved"]').first().click();
  await page.locator("#sync-create").click();

  await expect(page.locator("#sync-code")).toHaveText("ABCD2345");
  await expect(page.locator("#sync-idle")).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem("omaha-guide-code-v1"))).toBe("ABCD2345");
});

test("restoring a code loads that list onto a fresh device", async ({ page }) => {
  await stub(page, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ code: "ABCD2345", placeIds: ["old-market", "benson"] })
    })
  );

  await openRestore(page);
  await expect(page.locator("#saved-list .place-card")).toHaveCount(0);

  await page.locator("#sync-input").fill("abcd2345");
  await page.locator("#sync-restore-form button").click();

  await expect(page.locator("#saved-list .place-card")).toHaveCount(2);
  await expect(page.locator("#sync-status")).toContainText("Loaded 2 saved spots");
});

test("a malformed code is rejected without hitting the network", async ({ page }) => {
  let requests = 0;
  await stub(page, (route) => {
    requests += 1;
    return route.fulfill({ status: 200, body: "{}" });
  });

  await openRestore(page);
  await page.locator("#sync-input").fill("nope");
  await page.locator("#sync-restore-form button").click();

  await expect(page.locator("#sync-status")).toContainText("8 letters and numbers");
  expect(requests).toBe(0);
});

test("an unknown code says so plainly", async ({ page }) => {
  await stub(page, (route) =>
    route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({ error: "not found" })
    })
  );

  await openRestore(page);
  await page.locator("#sync-input").fill("ZZZZZZZZ");
  await page.locator("#sync-restore-form button").click();

  await expect(page.locator("#sync-status")).toContainText("No list found for that code");
});

test("saving still works when sync is unreachable", async ({ page }) => {
  await page.evaluate(() => localStorage.setItem("omaha-guide-code-v1", "ABCD2345"));
  await page.reload();
  await stub(page, (route) => route.abort("failed"));

  await saveFirstPlace(page);

  // The heart is the source of truth locally; a dead network must not undo it.
  await expect(page.locator(".save-btn.is-saved").first()).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("omaha-guide-saved-v1")))).toHaveLength(1);

  await page.locator('.tab[data-view="saved"]').first().click();
  await expect(page.locator("#saved-list .place-card")).toHaveCount(1);
});
