// Regression test for the senderId collision bug:
// When presenter.html is opened via window.open() from index.html, the popup
// inherits sessionStorage from the opener tab. If senderId was sessionStorage-
// backed, both windows ended up with the same senderId, and every cross-window
// broadcast was dropped by the self-echo suppression in sync.js _receive.
const { test, expect } = require('@playwright/test');

test('launching via index.html: presenter Next advances display', async ({ browser }) => {
  const ctx = await browser.newContext();
  const main = await ctx.newPage();

  // Capture the popup that index.html opens via window.open
  const popupPromise = ctx.waitForEvent('page');

  await main.goto('http://localhost:8123/index.html');

  // Click the "Run the live session" launcher
  await main.locator('#mode-present').click();

  const presenter = await popupPromise;
  await presenter.waitForLoadState('domcontentloaded');
  await main.waitForLoadState('domcontentloaded');

  // Both should now be on the same session
  const mainUrl = main.url();
  const presenterUrl = presenter.url();
  const mainSession = new URL(mainUrl).searchParams.get('session');
  const presenterSession = new URL(presenterUrl).searchParams.get('session');
  expect(mainSession).toBe(presenterSession);
  console.log('shared session:', mainSession);

  await main.waitForTimeout(800);
  await presenter.waitForTimeout(800);

  // The senderIds must NOT match (this was the bug — sessionStorage inherited)
  const mainSender = await main.evaluate(() => sessionStorage.getItem('sarahchen.senderId') || 'no-sessionstorage-key');
  const presenterSender = await presenter.evaluate(() => sessionStorage.getItem('sarahchen.senderId') || 'no-sessionstorage-key');
  console.log('main sessionStorage senderId:', mainSender);
  console.log('presenter sessionStorage senderId:', presenterSender);

  const counterBefore = await main.locator('#slide-counter').textContent();
  console.log('display counter before:', counterBefore);

  // Click Next on the presenter
  await presenter.locator('#nav-next').click();
  await main.waitForTimeout(900);

  const counterAfter = await main.locator('#slide-counter').textContent();
  console.log('display counter after:', counterAfter);

  expect(counterAfter).not.toBe(counterBefore);
  expect(counterAfter).toMatch(/2\s*\/\s*14/);

  await ctx.close();
});
