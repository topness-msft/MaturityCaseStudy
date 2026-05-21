// One-off visual checks for this round of changes.
const { test } = require('@playwright/test');
const BASE = 'http://localhost:8123';

async function goto(page, mode, index) {
  await page.goto(`${BASE}/deck.html?mode=${mode}`);
  await page.waitForTimeout(400);
  for (let i = 0; i < index; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(500);
}

test('slide 1 with hero still', async ({ page }) => {
  await goto(page, 'self', 0);
  await page.screenshot({ path: 'temp/r3-01-title-hero.png', fullPage: true });
});

test('slide 5 side-by-side empty + after pick', async ({ page }) => {
  await goto(page, 'self', 4);
  await page.screenshot({ path: 'temp/r3-05-poll-empty.png', fullPage: true });
  await page.locator('.choice').nth(1).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'temp/r3-05-poll-B.png', fullPage: true });
});

test('slide 6 new side-by-side guess panel', async ({ page }) => {
  await goto(page, 'self', 5);
  await page.screenshot({ path: 'temp/r3-06-mat-empty.png', fullPage: true });
  // Guess 200 for each of the 3 hidden pillars
  await page.locator('.predict-btn', { hasText: '200' }).nth(0).click();
  await page.waitForTimeout(150);
  await page.locator('.predict-btn', { hasText: '200' }).nth(1).click();
  await page.waitForTimeout(150);
  await page.locator('.predict-btn', { hasText: '200' }).nth(2).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'temp/r3-06-mat-guessed.png', fullPage: true });
  await page.locator('button', { hasText: 'Reveal the answers' }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'temp/r3-06-mat-revealed.png', fullPage: true });
});

test('slide 7 click rows to reveal', async ({ page }) => {
  await goto(page, 'self', 6);
  await page.screenshot({ path: 'temp/r3-07-bridge-initial.png', fullPage: true });
  await page.locator('button.map-row').first().click();
  await page.waitForTimeout(200);
  await page.locator('button.map-row').first().click();
  await page.waitForTimeout(200);
  await page.locator('button.map-row').first().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'temp/r3-07-bridge-all.png', fullPage: true });
});
