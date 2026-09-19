import { test, expect } from "@playwright/test";

const PHONE = { width: 375, height: 812 };
const DESKTOP = { width: 1280, height: 900 };

test.describe("responsive navigation", () => {
  test("phone width shows the bottom tab bar, not the header", async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto("/");

    await expect(page.locator(".tabbar")).toBeVisible();
    await expect(page.locator(".site-header")).toBeHidden();
  });

  test("desktop width shows the header, not the bottom tab bar", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    await expect(page.locator(".site-header")).toBeVisible();
    await expect(page.locator(".tabbar")).toBeHidden();
  });

  test("both navs track the same active view", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    await page.locator('.topnav .tab[data-view="saved"]').click();

    // The bottom bar is hidden at this width but still in the DOM — if it drifts
    // out of sync, a guest rotating their phone lands on a nav pointing at the
    // wrong view.
    const active = await page
      .locator(".tab.is-active")
      .evaluateAll((els) => els.map((e) => e.dataset.view));

    expect(new Set(active)).toEqual(new Set(["saved"]));
    expect(active.length).toBe(2);
  });

  test("the guide is usable across a resize", async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto("/");
    await page.locator('.tabbar .tab[data-view="guide"]').click();
    await expect(page.locator(".place-card").first()).toBeVisible();

    await page.setViewportSize(DESKTOP);
    await expect(page.locator(".place-card").first()).toBeVisible();
    await expect(page.locator(".site-header")).toBeVisible();
  });

  test("no horizontal scroll at either width", async ({ page }) => {
    for (const size of [PHONE, DESKTOP]) {
      await page.setViewportSize(size);
      await page.goto("/");
      await page.locator(`.${size === PHONE ? "tabbar" : "topnav"} .tab[data-view="guide"]`).click();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `horizontal overflow at ${size.width}px`).toBeLessThanOrEqual(0);
    }
  });
});
