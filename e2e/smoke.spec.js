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
  await expect(headings).toHaveCount(4);
  await expect(page.locator(".place-card").first()).toBeVisible();
});

test("filtering narrows the guide to one section", async ({ page }) => {
  await page.getByRole("button", { name: "Guide" }).click();
  await page.locator(".chip", { hasText: "Outdoors" }).click();
  await expect(page.locator(".group-heading")).toHaveCount(1);
  await expect(page.locator(".group-heading")).toContainText("Outdoors");
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
