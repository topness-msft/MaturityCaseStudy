const { test, expect } = require('@playwright/test');

test('slide 14: QR code visible and links to Copilot Summit', async ({ page }) => {
  await page.goto('http://localhost:8123/deck.html?session=sc-qr01');
  await page.waitForTimeout(300);
  // Jump straight to slide 14 (index 13)
  await page.evaluate(() => {
    const u = new URL(location.href);
    // Use outline drawer click instead
  });
  // Simpler: press End/right repeatedly. Or click outline if available.
  for (let i = 0; i < 13; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(400);
  const block = page.locator('.resources-qr');
  await expect(block).toBeVisible();
  const href = await block.getAttribute('href');
  expect(href).toBe('https://microsoft.github.io/cat/copilot-summit/index.html');
  const caption = page.locator('.resources-qr-caption');
  await expect(caption).toHaveCount(0);
  // Should be in the top-right corner (positioned absolute)
  const box = await block.boundingBox();
  const slide = await page.locator('#slide-stage').boundingBox();
  // Pinned to the right side
  expect(box.x + box.width).toBeGreaterThan(slide.x + slide.width - 80);
  // Does not overlap the first row of cards (mode-card)
  const firstCard = await page.locator('.mode-card').first().boundingBox();
  expect(box.y + box.height).toBeLessThanOrEqual(firstCard.y + 2);
  await block.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'temp/slide14-qr.png', fullPage: true });
});
