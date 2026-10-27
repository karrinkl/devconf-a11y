import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import SpeakersPage from '../../pages/speakers/index';
import { fetchSpeakers } from '../../lib/api';
import { makeStore } from '../../store';

/*
  Страница «Спикеры» целиком: поле поиска, список карточек и загрузка
  данных из API. Модуль lib/api подменяется через jest.mock(): функция
  fetchSpeakers становится mock-функцией, и тест сам решает, что
  «ответил сервер». Функция mergeWithLocal остаётся настоящей.
*/
jest.mock('../../lib/api', () => ({
  ...jest.requireActual('../../lib/api'),
  fetchSpeakers: jest.fn(),
}));

const buildSpeakers = [
  {
    id: 'kovalev',
    name: 'Алексей Ковалёв',
    role: 'Staff Engineer',
    company: 'EPAM',
    topic: 'Трекинг объектов в реальном времени',
    photo: '/images/speaker-01-1x.webp',
    photoRetina: '/images/speaker-01-2x.webp',
    date: '18 мая, 14:00',
    hall: 'Зал A',
    href: '/speakers/kovalev',
  },
  {
    id: 'melnik',
    name: 'Дарья Мельник',
    role: 'Head of Design',
    company: 'Wargaming',
    topic: 'Дизайн-система без боли',
    photo: '/images/speaker-02-1x.webp',
    photoRetina: '/images/speaker-02-2x.webp',
    date: '18 мая, 15:30',
    hall: 'Зал B',
    href: '/speakers/melnik',
  },
];

const apiSpeakers = [
  { _id: 'a1', name: 'Алексей Ковалёв', topic: 'Трекинг объектов в реальном времени' },
  { _id: 'a2', name: 'Дарья Мельник', topic: 'Дизайн-система без боли' },
  { _id: 'a3', name: 'Екатерина Сидорук', topic: 'Бэкенд на Express' },
];

function renderPage() {
  return render(
    <Provider store={makeStore()}>
      <SpeakersPage speakers={buildSpeakers} builtAt="27.10.2026, 12:00:00" />
    </Provider>
  );
}

const cardNames = () =>
  screen.getAllByTestId('speaker-card').map((card) => within(card).getByRole('heading').textContent);

afterEach(() => {
  jest.clearAllMocks();
});

describe('SpeakersPage', () => {
  it('показывает список из API, когда сервер ответил', async () => {
    fetchSpeakers.mockResolvedValue(apiSpeakers);
    renderPage();

    expect(await screen.findByText('Данные: API /api/speakers')).toBeInTheDocument();
    expect(fetchSpeakers).toHaveBeenCalledTimes(1);
    expect(cardNames()).toEqual(['Алексей Ковалёв', 'Дарья Мельник', 'Екатерина Сидорук']);
  });

  it('при вводе имени оставляет только искомого спикера', async () => {
    const user = userEvent.setup();
    fetchSpeakers.mockResolvedValue(apiSpeakers);
    renderPage();
    await screen.findByText('Данные: API /api/speakers');

    await user.type(screen.getByLabelText('Поиск по имени'), 'сидорук');

    expect(cardNames()).toEqual(['Екатерина Сидорук']);
    expect(screen.getByTestId('search-result')).toHaveTextContent('Найдено: 1');
  });

  it('сообщает, что спикер не найден', async () => {
    const user = userEvent.setup();
    fetchSpeakers.mockResolvedValue(apiSpeakers);
    renderPage();
    await screen.findByText('Данные: API /api/speakers');

    await user.type(screen.getByLabelText('Поиск по имени'), 'Петров');

    expect(screen.queryAllByTestId('speaker-card')).toHaveLength(0);
    expect(screen.getByTestId('search-empty')).toBeInTheDocument();
  });

  it('оставляет данные сборки и предупреждает, если API недоступно', async () => {
    fetchSpeakers.mockRejectedValue(new Error('Network error'));
    renderPage();

    expect(await screen.findByText(/Сервер API недоступен/)).toBeInTheDocument();
    expect(cardNames()).toEqual(['Алексей Ковалёв', 'Дарья Мельник']);
  });
});
