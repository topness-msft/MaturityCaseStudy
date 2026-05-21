// Smoke test: load each route, walk all slides in self-paced mode,
// exercise key interactions, capture screenshots to temp/.
// Fails the run on any console error or unhandled page error.

const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8123';
const SCREENSHOT_DIR = 'temp';

function attachConsoleWatcher(page, label) {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`[${label}] console.error: ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => {
    errors.push(`[${label}] pageerror: ${err.message}`);
  });
  return errors;
}

test.describe('Sarah Chen interactive deck', () => {
  test('landing page renders and offers both modes', async ({ page }) => {
    const errors = attachConsoleWatcher(page, 'landing');
    await page.goto(`${BASE}/index.html`);
    await expect(page.locator('h1')).toBeVisible();
    // mode chooser buttons
    const buttons = page.locator('button, a').filter({ hasText: /self|present|paced|live/i });
    await expect(buttons.first()).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01-landing.png`, fullPage: true });
    expect(errors, errors.join('\n')).toHaveLength(0);
  });

  test('self-paced deck loads and renders slide 1', async ({ page }) => {
    const errors = attachConsoleWatcher(page, 'deck-self');
    await page.goto(`${BASE}/deck.html?mode=self`);
    await page.waitForSelector('main, .stage, [data-slide-id], .slide', { timeout: 5000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02-deck-slide1.png`, fullPage: true });
    expect(errors, errors.join('\n')).toHaveLength(0);
  });

  test('walk all 14 slides via keyboard right-arrow', async ({ page }) => {
    const errors = attachConsoleWatcher(page, 'walk');
    await page.goto(`${BASE}/deck.html?mode=self`);
    await page.waitForTimeout(500);
    for (let i = 1; i <= 14; i++) {
      await page.screenshot({ path: `${SCREENSHOT_DIR}/walk-${String(i).padStart(2, '0')}.png`, fullPage: true });
      if (i < 14) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(300);
      }
    }
    expect(errors, errors.join('\n')).toHaveLength(0);
  });

  test('presenter window loads and renders facilitation panel', async ({ page }) => {
    const errors = attachConsoleWatcher(page, 'presenter');
    await page.goto(`${BASE}/presenter.html?session=sc-test01`);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/03-presenter-slide1.png`, fullPage: true });
    expect(errors, errors.join('\n')).toHaveLength(0);
  });

  test('present mode + presenter window sync via BroadcastChannel', async ({ browser }) => {
    const ctx = await browser.newContext();
    const sessionId = 'sc-sync01';
    const display = await ctx.newPage();
    const presenter = await ctx.newPage();
    const dErrors = attachConsoleWatcher(display, 'display');
    const pErrors = attachConsoleWatcher(presenter, 'presenter');
    await display.goto(`${BASE}/deck.html?mode=present&session=${sessionId}`);
    await presenter.goto(`${BASE}/presenter.html?session=${sessionId}`);
    await display.waitForTimeout(600);
    await presenter.waitForTimeout(600);

    // Advance presenter -> display should follow
    await presenter.keyboard.press('ArrowRight');
    await display.waitForTimeout(500);
    await display.screenshot({ path: `${SCREENSHOT_DIR}/04-sync-display.png`, fullPage: true });
    await presenter.screenshot({ path: `${SCREENSHOT_DIR}/04-sync-presenter.png`, fullPage: true });

    // Slide counter on display should not be slide 1 anymore
    const counterText = await display.locator('body').innerText();
    expect(counterText).toMatch(/2|02/);

    expect(dErrors.concat(pErrors), dErrors.concat(pErrors).join('\n')).toHaveLength(0);
    await ctx.close();
  });
});
