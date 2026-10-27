import { fetchSpeakers, mergeWithLocal, PLACEHOLDER_PHOTO } from '../../lib/api';

/*
  Клиент API из ЛР № 28. Настоящий сервер в unit-тестах не нужен:
  функция fetch подменяется mock-функцией Jest, которая возвращает
  заранее заданный ответ.
*/

const local = [
  {
    id: 'kovalev',
    name: 'Алексей Ковалёв',
    role: 'Staff Engineer',
    company: 'EPAM',
    photo: '/images/speaker-01-1x.webp',
    photoRetina: '/images/speaker-01-2x.webp',
    date: '18 мая, 14:00',
    hall: 'Зал A',
  },
];

describe('fetchSpeakers', () => {
  it('запрашивает /api/speakers и возвращает поле data', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ count: 1, data: [{ _id: '1', name: 'Алексей Ковалёв', topic: 'YOLO' }] }),
    });

    const result = await fetchSpeakers(fetchMock);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/speakers$/);
    expect(result).toEqual([{ _id: '1', name: 'Алексей Ковалёв', topic: 'YOLO' }]);
  });

  it('выбрасывает ошибку, если API ответило кодом 500', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });

    await expect(fetchSpeakers(fetchMock)).rejects.toThrow('API ответило кодом 500');
  });
});

describe('mergeWithLocal', () => {
  it('дополняет спикера из API данными сборки и ссылкой на его страницу', () => {
    const [speaker] = mergeWithLocal(
      [{ _id: 'abc', name: 'Алексей Ковалев', topic: 'Новая тема', photoUrl: '' }],
      local
    );

    expect(speaker).toMatchObject({
      id: 'kovalev',
      name: 'Алексей Ковалев',
      topic: 'Новая тема',
      role: 'Staff Engineer',
      hall: 'Зал A',
      href: '/speakers/kovalev',
    });
  });

  it('спикеру только из API ставит заглушку фото и не даёт ссылку', () => {
    const [speaker] = mergeWithLocal([{ _id: 'xyz', name: 'Екатерина Сидорук', topic: 'Express' }], local);

    expect(speaker.id).toBe('xyz');
    expect(speaker.photo).toBe(PLACEHOLDER_PHOTO);
    expect(speaker.href).toBeNull();
  });
});
