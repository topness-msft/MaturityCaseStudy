const { test, expect } = require('@playwright/test');

test('slide 2 in present mode: percentages are hidden from the display', async ({ page }) => {
  await page.goto('http://localhost:8123/deck.html?mode=present&session=sc-pcthidden');
  await page.waitForTimeout(400);

  // Navigate to slide 2
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(400);

  // Reveal all four stages
  const stages = page.locator('.stage');
  const n = await stages.count();
  expect(n).toBe(4);
  for (let i = 0; i < n; i++) {
    await stages.nth(i).click();
    await page.waitForTimeout(120);
  }

  const visibleText = await page.locator('.stages').innerText();
  console.log('rendered stages text:\n' + visibleText);

  // No specific percentages should leak onto the audience display
  expect(visibleText).not.toMatch(/80%|40%|15%|5%/);

  // Revealed marker should be present
  const counts = await page.locator('.stage-count').allInnerTexts();
  console.log('stage-count cells:', counts);
  expect(counts.every(c => c.trim() === '✓')).toBe(true);
});
