// @ts-check
const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');
const mockSpeakers = require('./fixtures/speakers.json');

/*
  Автоматизированный аудит доступности движком axe-core, тем же, что
  в расширении Axe DevTools и во вкладке Lighthouse.

  Проверяются правила WCAG 2.0, 2.1 и 2.2 уровней A и AA и рекомендации
  best-practice. Тест падает, если на странице есть хотя бы одно
  нарушение, и выводит его описание.
*/
const PAGES = ['/', '/schedule', '/speakers', '/speakers/kovalev'];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

test.describe('Аудит доступности axe-core', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/speakers', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        json: mockSpeakers,
      })
    );
  });

  for (const url of PAGES) {
    test(`страница ${url} без нарушений WCAG A/AA`, async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      const result = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      const summary = result.violations.map(
        (v) => `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`
      );

      expect(summary, summary.join('\n')).toEqual([]);
    });
  }
});
