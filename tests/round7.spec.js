const { test } = require('@playwright/test');

async function go(page, idx) {
  await page.goto('http://localhost:8123/deck.html?mode=self');
  await page.waitForSelector('.title-hero-wrap');
  for (let i = 0; i < idx; i++) {
    await page.locator('button', { hasText: /Next/i }).click();
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(350);
}

test('slide 10 overlay bars', async ({ page }) => {
  await go(page, 9);
  await page.screenshot({ path: 'temp/r7-10-gaps.png', fullPage: true });
});
test('slide 11 real-language', async ({ page }) => {
  await go(page, 10);
  await page.screenshot({ path: 'temp/r7-11-opmodel.png', fullPage: true });
});
test('slide 12 static', async ({ page }) => {
  await go(page, 11);
  await page.screenshot({ path: 'temp/r7-12-mirror.png', fullPage: true });
});
