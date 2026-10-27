// @ts-check
const { test, expect } = require('@playwright/test');
const mockSpeakers = require('./fixtures/speakers.json');

/*
  Клавиатурная навигация (ЛР № 30): весь сценарий выполняется без мыши,
  только клавишами Tab, Enter, пробел, стрелками и Home/End.
*/

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

const focused = (page) => page.evaluate(() => document.activeElement?.textContent?.trim());

test('первый Tab открывает ссылку пропуска меню, Enter переводит фокус в main', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Перейти к основному содержимому' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();

  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.keyboard.press('Tab');
  expect(await focused(page)).toBe('Спикеры конференции');
});

test('все ссылки меню доступны с клавиатуры и ведут на свои страницы', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Основное меню' });
  await expect(nav.getByRole('link', { name: 'Главная' })).toHaveAttribute('aria-current', 'page');

  // Tab: ссылка пропуска, логотип, «Главная», «Расписание»
  for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
  await expect(nav.getByRole('link', { name: 'Расписание' })).toBeFocused();

  // видимый контур фокуса
  const outline = await nav
    .getByRole('link', { name: 'Расписание' })
    .evaluate((el) => getComputedStyle(el).outlineStyle + ' ' + getComputedStyle(el).outlineWidth);
  expect(outline).toBe('solid 3px');

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/schedule$/);
  await expect(nav.getByRole('link', { name: 'Расписание' })).toHaveAttribute('aria-current', 'page');

  await nav.getByRole('link', { name: 'Спикеры' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/speakers$/);
  await expect(nav.getByRole('link', { name: 'Спикеры' })).toHaveAttribute('aria-current', 'page');
});

test('аккордеон FAQ управляется стрелками, Home/End, Enter и пробелом', async ({ page }) => {
  await page.goto('/');
  const first = page.getByRole('button', { name: /Нужен ли билет/ });
  const second = page.getByRole('button', { name: /Можно ли вернуть/ });
  const third = page.getByRole('button', { name: /Будут ли записи/ });

  await first.focus();
  await expect(first).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('ArrowDown');
  await expect(second).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('region', { name: /Можно ли вернуть/ })).toBeVisible();

  await page.keyboard.press('End');
  await expect(third).toBeFocused();
  await page.keyboard.press('Space');
  await expect(third).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Home');
  await expect(first).toBeFocused();
});
