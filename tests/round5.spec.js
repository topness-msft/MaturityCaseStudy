const { test } = require('@playwright/test');

async function go(page, idx) {
  await page.goto('http://localhost:8123/deck.html?mode=self');
  await page.waitForSelector('.slide-stage, .mirror, .title-hero-wrap');
  for (let i = 0; i < idx; i++) {
    await page.locator('button', { hasText: /Next/i }).click();
    await page.waitForTimeout(120);
  }
}

test('snapshot slide 12', async ({ page }) => {
  await go(page, 11);
  await page.screenshot({ path: 'temp/r5-12-mirror.png', fullPage: true });
});
test('snapshot slide 14', async ({ page }) => {
  await go(page, 13);
  await page.screenshot({ path: 'temp/r5-14-resources.png', fullPage: true });
});
test('snapshot slide 10', async ({ page }) => {
  await go(page, 9);
  await page.screenshot({ path: 'temp/r5-10-gaps.png', fullPage: true });
  // try clicking a gap-row
  const row = page.locator('.gap-row').first();
  await row.click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'temp/r5-10b-gaps-open.png', fullPage: true });
});
