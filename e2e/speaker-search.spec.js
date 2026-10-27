// @ts-check
const { test, expect } = require('@playwright/test');
const mockSpeakers = require('./fixtures/speakers.json');

/*
  Сценарий «Поиск спикера» (вариант 2).

  Пользователь открывает главную страницу, переходит в раздел
  «Спикеры» через меню, вводит имя в поле поиска и видит в списке
  только искомого спикера.

  Запрос страницы к API из ЛР № 28 перехватывается через page.route()
  и получает ответ из файла fixtures/speakers.json. В нём девять
  спикеров: восемь из данных сборки и Екатерина Сидорук, которой
  в сборке нет. Если её карточка появилась, значит, список на странице
  действительно пришёл из перехваченного ответа, а не из HTML сборки.
*/

test.describe('Поиск спикера', () => {
  /** @type {string[]} */
  let apiRequests;

  test.beforeEach(async ({ page }) => {
    apiRequests = [];

    await page.route('**/api/speakers', async (route) => {
      apiRequests.push(`${route.request().method()} ${route.request().url()}`);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        json: mockSpeakers,
      });
    });
  });

  test('пользователь находит спикера по имени', async ({ page }) => {
    // 1. Главная страница
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Конференция инженеров');

    // 2. Переход на страницу спикеров через меню (клиентская навигация Link)
    await page.getByRole('navigation').getByRole('link', { name: 'Спикеры' }).click();
    await expect(page).toHaveURL(/\/speakers$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Спикеры' })).toBeVisible();

    // 3. Список загружен из замокированного API: девять карточек вместо восьми
    await expect(page.getByTestId('data-source')).toHaveText('Данные: API /api/speakers');
    const cards = page.getByTestId('speaker-card');
    await expect(cards).toHaveCount(mockSpeakers.data.length);
    await expect(cards.filter({ hasText: 'Екатерина Сидорук' })).toHaveCount(1);
    expect(apiRequests).toEqual(['GET http://localhost:5000/api/speakers']);

    // 4. Ввод имени в поле поиска
    const search = page.getByLabel('Поиск по имени');
    await search.fill('Ковалёв');

    // 5. В списке остался только искомый спикер
    await expect(cards).toHaveCount(1);
    await expect(cards.first().getByRole('heading')).toHaveText('Алексей Ковалёв');
    await expect(page.getByTestId('search-result')).toHaveText('Найдено: 1');

    // 6. Карточка ведёт на страницу спикера
    await cards.first().getByRole('link', { name: 'Алексей Ковалёв' }).click();
    await expect(page).toHaveURL(/\/speakers\/kovalev$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Алексей Ковалёв');
  });

  test('при отсутствии совпадений показывается сообщение', async ({ page }) => {
    await page.goto('/speakers');
    await expect(page.getByTestId('data-source')).toHaveText('Данные: API /api/speakers');

    await page.getByLabel('Поиск по имени').fill('Петров');

    await expect(page.getByTestId('speaker-card')).toHaveCount(0);
    await expect(page.getByTestId('search-empty')).toHaveText('Спикер с таким именем не найден.');
  });
});
