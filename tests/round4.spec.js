const { test, expect } = require('@playwright/test');

test('slide 1 hero is faded behind title', async ({ page }) => {
  await page.goto('http://localhost:8123/deck.html?mode=self&i=0');
  await page.waitForSelector('.title-hero-wrap');
  // Hero image should exist as absolute backdrop
  const bg = page.locator('.title-hero-bg');
  await expect(bg).toBeVisible();
  // Title text should be on top and visible
  await expect(page.locator('.mirror-line1')).toBeVisible();
  await page.screenshot({ path: 'temp/r4-01-title-hero.png', fullPage: true });
});

test('slide 6 marks guesses after reveal', async ({ page }) => {
  await page.goto('http://localhost:8123/deck.html?mode=self&i=5');
  await page.waitForSelector('.guess-panel');
  await page.screenshot({ path: 'temp/r4-06a-before.png', fullPage: true });
  // Pick guesses: ais=300 (correct? actual value?), bp=400, culture=200
  await page.locator('.predict-row').nth(0).locator('.predict-btn', { hasText: '300' }).click();
  await page.locator('.predict-row').nth(1).locator('.predict-btn', { hasText: '400' }).click();
  await page.locator('.predict-row').nth(2).locator('.predict-btn', { hasText: '200' }).click();
  // Reveal
  await page.locator('button', { hasText: /Reveal the answers/i }).click();
  await page.waitForSelector('.maturity-guess-marker');
  const markers = await page.locator('.maturity-guess-marker').count();
  expect(markers).toBe(3);
  await page.screenshot({ path: 'temp/r4-06b-revealed.png', fullPage: true });
});
