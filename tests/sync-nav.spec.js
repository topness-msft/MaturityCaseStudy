const { test, expect } = require('@playwright/test');

test('presenter Next button advances display', async ({ browser }) => {
  const ctx = await browser.newContext();
  const sessionId = 'sc-btn01';
  const display = await ctx.newPage();
  const presenter = await ctx.newPage();
  display.on('console', m => { if (m.type() === 'error') console.log('[display]', m.text()); });
  presenter.on('console', m => { if (m.type() === 'error') console.log('[presenter]', m.text()); });

  await display.goto(`http://localhost:8123/deck.html?mode=present&session=${sessionId}`);
  await presenter.goto(`http://localhost:8123/presenter.html?session=${sessionId}`);
  await display.waitForTimeout(700);
  await presenter.waitForTimeout(700);

  const before = await display.locator('#slide-counter').textContent();
  console.log('display counter before:', before);

  // Click Next on presenter
  await presenter.locator('#nav-next').click();
  await display.waitForTimeout(800);

  const after = await display.locator('#slide-counter').textContent();
  console.log('display counter after:', after);
  expect(after).not.toBe(before);

  await ctx.close();
});

test('display Next button advances presenter', async ({ browser }) => {
  const ctx = await browser.newContext();
  const sessionId = 'sc-btn02';
  const display = await ctx.newPage();
  const presenter = await ctx.newPage();
  await display.goto(`http://localhost:8123/deck.html?mode=present&session=${sessionId}`);
  await presenter.goto(`http://localhost:8123/presenter.html?session=${sessionId}`);
  await display.waitForTimeout(700);
  await presenter.waitForTimeout(700);

  // Click Next on display
  await display.locator('#nav-next').click();
  await display.waitForTimeout(800);

  const presenterIdx = await presenter.evaluate(() => {
    return document.querySelector('.presenter-slide-num')?.textContent ||
           document.querySelector('#slide-counter')?.textContent ||
           document.body.innerText.match(/Slide\s*\d+/)?.[0] || 'unknown';
  });
  console.log('presenter shows:', presenterIdx);
  expect(presenterIdx).not.toMatch(/1\s*\/\s*14|Slide 1\b/);

  await ctx.close();
});
