const { test } = require('@playwright/test');

async function go(page, idx) {
  await page.goto('http://localhost:8123/deck.html?mode=self');
  await page.waitForSelector('.slide-stage, .mirror, .title-hero-wrap');
  for (let i = 0; i < idx; i++) {
    await page.locator('button', { hasText: /Next/i }).click();
    await page.waitForTimeout(120);
  }
}

test('slide 12 mirror walkthrough', async ({ page }) => {
  await go(page, 11);
  await page.screenshot({ path: 'temp/r6-12-initial.png', fullPage: true });
  // wait for the forced pause
  await page.waitForTimeout(2200);
  // r2
  await page.locator('.mirror button.btn-primary').click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'temp/r6-12-r2.png', fullPage: true });
  // r3
  await page.locator('.mirror button.btn-primary').click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'temp/r6-12-r3.png', fullPage: true });
  // r4..r6
  for (let i = 0; i < 3; i++) {
    await page.locator('.mirror button.btn-primary').click();
    await page.waitForTimeout(700);
  }
  await page.screenshot({ path: 'temp/r6-12-final.png', fullPage: true });
});

test('slide 14 has no closing line', async ({ page }) => {
  await go(page, 13);
  const text = await page.textContent('main');
  if (text && text.includes('Will you run this diagnostic')) {
    throw new Error('closing line still present');
  }
  await page.screenshot({ path: 'temp/r6-14.png', fullPage: true });
});

test('slide 10 click expands gap', async ({ page }) => {
  await go(page, 9);
  await page.locator('.gap-row').nth(1).click();
  await page.waitForTimeout(300);
  const expanded = await page.locator('.gap-row.expanded').count();
  if (expanded < 1) throw new Error('gap row did not expand');
  await page.screenshot({ path: 'temp/r6-10-expanded.png', fullPage: true });
});

test('slide 9 click-to-reveal columns', async ({ page }) => {
  await go(page, 8);
  await page.screenshot({ path: 'temp/r6-09-initial.png', fullPage: true });
  await page.locator('button.quad.clickable').first().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'temp/r6-09-one-revealed.png', fullPage: true });
});
