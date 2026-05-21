// Playwright config for local smoke testing.
module.exports = {
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  use: {
    headless: true,
    viewport: { width: 1440, height: 900 },
    actionTimeout: 5000,
  },
  reporter: [['list']],
};
