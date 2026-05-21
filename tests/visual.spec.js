// Targeted visual checks for the changed slides.
const { test } = require('@playwright/test');
const BASE = 'http://localhost:8123';

async function gotoSlide(page, mode, index) {
  await page.goto(`${BASE}/deck.html?mode=${mode}`);
  await page.waitForTimeout(400);
  for (let i = 0; i < index; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(400);
}

test('slide 1 — title (no presenter names)', async ({ page }) => {
  await gotoSlide(page, 'self', 0);
  await page.screenshot({ path: 'temp/v-01-title-self.png', fullPage: true });
});

test('slide 2 — stages side-by-side after Production selected', async ({ page }) => {
  await gotoSlide(page, 'self', 1);
  await page.screenshot({ path: 'temp/v-02-stages-empty.png', fullPage: true });
  // Click the "Production" stage button
  await page.locator('.stage').nth(1).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'temp/v-02-stages-selected.png', fullPage: true });
});

test('slide 5 — poll with per-choice probe after picking B', async ({ page }) => {
  await gotoSlide(page, 'self', 4);
  await page.screenshot({ path: 'temp/v-05-poll-empty.png', fullPage: true });
  await page.locator('.choice').nth(1).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'temp/v-05-poll-B.png', fullPage: true });
});

test('slide 6 — maturity self-paced shows guess flow', async ({ page }) => {
  await gotoSlide(page, 'self', 5);
  await page.screenshot({ path: 'temp/v-06-maturity-initial.png', fullPage: true });
});

test('slide 8 — patterns with per-pattern probe after picking p3', async ({ page }) => {
  await gotoSlide(page, 'self', 7);
  await page.screenshot({ path: 'temp/v-08-patterns-empty.png', fullPage: true });
  await page.locator('.pattern').nth(2).click(); // p3 = Workplace & IT Services
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'temp/v-08-patterns-p3.png', fullPage: true });
});

test('presenter slide 6 keeps presenter subtitle', async ({ page }) => {
  await gotoSlide(page, 'present', 5);
  await page.screenshot({ path: 'temp/v-06-maturity-presenter.png', fullPage: true });
});
