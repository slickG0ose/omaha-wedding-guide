import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("home shows the wedding details", async ({ page }) => {
  await expect(page.locator("#venue-name")).not.toBeEmpty();
  await expect(page.locator("#hero-date")).toContainText("October 3");
  await expect(page.locator("#venue-maps-link")).toHaveAttribute("href", /maps\.(google|apple)\.com/);
});

test("the playlist button only shows for a real https link", async ({ page }) => {
  const url = await page.evaluate(() => WEDDING.playlistUrl);
  const link = page.locator("#playlist-link");
  if (/^https:\/\/\S+$/.test(url || "")) {
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", url);
  } else {
    await expect(link).toBeHidden();
  }
});

test("the rehearsal dinner card renders with a working directions link", async ({ page }) => {
  const card = page.locator("#rehearsal-card");
  await expect(card).toBeVisible();
  await expect(page.locator("#rehearsal-title")).not.toBeEmpty();
  await expect(page.locator("#rehearsal-date")).toContainText("October 2");
  await expect(page.locator("#rehearsal-maps-link")).toHaveAttribute(
    "href",
    /^https:\/\/maps\.(google|apple)\.com\/\?q=.+/
  );
});

test("guide renders every category section", async ({ page }) => {
  await page.getByRole("button", { name: "Guide" }).click();
  const headings = page.locator(".group-heading");
  await expect(headings).toHaveCount(3);
  await expect(page.locator(".place-card").first()).toBeVisible();
});

test("filtering narrows the guide to one section", async ({ page }) => {
  await page.getByRole("button", { name: "Guide" }).click();
  await page.locator(".chip", { hasText: "Entertainment" }).click();
  await expect(page.locator(".group-heading")).toHaveCount(1);
  await expect(page.locator(".group-heading")).toContainText("Entertainment");
  await expect(page).toHaveURL(/#guide\/fun$/);
});

test("unfinished details never show a TODO to guests", async ({ page }) => {
  await expect(page.locator("#view-home")).not.toContainText("TODO");
  await page.getByRole("button", { name: "Guide" }).click();
  await expect(page.locator("#view-guide")).not.toContainText("TODO");
});

test("a shared #guide/eat link opens straight to Food & Drink", async ({ page }) => {
  await page.goto("/#guide/eat");
  await expect(page.locator("#view-guide")).toBeVisible();
  await expect(page.locator(".chip.is-active")).toHaveText("Food & Drink");
  await expect(page.locator(".group-heading")).toHaveCount(1);
});

test("the guide can be organized by neighborhood, and the section chips still filter it", async ({ page }) => {
  await page.goto("/#guide");
  await page.getByRole("button", { name: "By neighborhood" }).click();
  await expect(page).toHaveURL(/#guide\/all\/by-area$/);
  await expect(page.locator(".group-heading").first()).toHaveText("Downtown & Old Market");

  const total = await page.locator("#place-list .place-card").count();
  expect(total).toBe(await page.evaluate(() => PLACES.length));

  await page.locator(".chip", { hasText: "Food & Drink" }).click();
  await expect(page).toHaveURL(/#guide\/eat\/by-area$/);
  const food = await page.evaluate(() => PLACES.filter((p) => p.category === "eat").length);
  await expect(page.locator("#place-list .place-card")).toHaveCount(food);

  await page.getByRole("button", { name: "By type" }).click();
  await expect(page).toHaveURL(/#guide\/eat$/);
});

test("home section tiles lead into the guide, and back returns home", async ({ page }) => {
  await page.locator(".section-tile").first().click();
  await expect(page.locator("#view-guide")).toBeVisible();
  await page.goBack();
  await expect(page.locator("#view-home")).toBeVisible();
});

test("your picks are badged and lead their group", async ({ page }) => {
  await page.goto("/#guide");
  await expect(page.locator(".place-card.is-pick .pick-badge").first()).toContainText("pick");

  // Within every group, no pick may appear after a non-pick.
  const orders = await page.locator(".place-list").evaluateAll((lists) =>
    lists.map((ul) => [...ul.children].map((li) => li.classList.contains("is-pick")))
  );
  for (const order of orders) {
    const firstNonPick = order.indexOf(false);
    expect(firstNonPick === -1 || !order.slice(firstNonPick).includes(true)).toBe(true);
  }
});

test("saving a place persists across a reload", async ({ page }) => {
  await page.getByRole("button", { name: "Guide" }).click();

  const firstCard = page.locator(".place-card").first();
  const savedName = await firstCard.locator(".place-name").textContent();
  await firstCard.locator(".save-btn").click();

  await page.getByRole("button", { name: "Saved" }).click();
  await expect(page.locator("#saved-list .place-card")).toHaveCount(1);
  await expect(page.locator("#saved-list")).toContainText(savedName);

  await page.reload();
  await page.getByRole("button", { name: "Saved" }).click();
  await expect(page.locator("#saved-list")).toContainText(savedName);
});

test("unsaving empties the list again", async ({ page }) => {
  await page.getByRole("button", { name: "Guide" }).click();
  await page.locator(".place-card").first().locator(".save-btn").click();

  await page.getByRole("button", { name: "Saved" }).click();
  await page.locator("#saved-list .save-btn").first().click();

  await expect(page.locator("#saved-list .place-card")).toHaveCount(0);
  await expect(page.locator("#saved-empty")).toBeVisible();
});

test("every place links somewhere a maps app can open", async ({ page }) => {
  await page.getByRole("button", { name: "Guide" }).click();
  const hrefs = await page.locator(".place-name").evaluateAll((els) => els.map((e) => e.href));

  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    expect(href).toMatch(/^https:\/\/maps\.(google|apple)\.com\/\?q=.+/);
  }
});

test("no horizontal scroll at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: "Guide" }).click();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
