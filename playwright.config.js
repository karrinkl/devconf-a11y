// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/*
  Настройка E2E-тестов Playwright.

  Перед тестами Playwright сам собирает сайт и запускает его в
  production-режиме на порту 3100 (блок webServer). Если сервер на этом
  порту уже запущен вручную, он используется повторно.

  Сервер API из ЛР № 28 для тестов не нужен: все запросы к нему
  перехватываются в тесте функцией page.route() и получают заранее
  заготовленный ответ.

  На Arch Linux браузер, скачанный командой npx playwright install,
  обычно работает. Если нет, можно указать системный Chromium:
  CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e
*/
const PORT = 3100;

module.exports = defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'ru-RU',
    trace: 'on',
    screenshot: 'on',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
      },
    },
  ],

  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
