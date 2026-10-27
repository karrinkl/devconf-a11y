import { normalizeName } from './filterSpeakers';

/*
  Клиент REST API из лабораторной работы № 28 (репозиторий devconf-api).

  Адрес сервера задаётся переменной окружения NEXT_PUBLIC_API_URL.
  Префикс NEXT_PUBLIC_ означает, что значение подставляется в клиентский
  бандл при сборке. Если переменная не задана, используется адрес,
  на котором API запускается командой npm run local.
*/
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const PLACEHOLDER_PHOTO = '/images/speaker-placeholder.svg';

/**
 * GET /api/speakers. Возвращает массив документов из поля data.
 * При ответе с кодом не из диапазона 2xx выбрасывает ошибку.
 */
export async function fetchSpeakers(fetchImpl = globalThis.fetch) {
  const response = await fetchImpl(`${API_URL}/api/speakers`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`API ответило кодом ${response.status}`);
  }

  const body = await response.json();
  return Array.isArray(body.data) ? body.data : [];
}

/**
 * Приводит документы API к виду, который ожидает карточка спикера.
 *
 * В базе ЛР № 28 у спикера только имя, тема и фотография. Должность,
 * зал и время доклада берутся из данных сборки, если спикер с таким
 * именем там есть. Спикер, добавленный только через API, получает
 * заглушку вместо фото и карточку без ссылки на отдельную страницу:
 * для него страница при сборке не генерировалась.
 */
export function mergeWithLocal(apiSpeakers, localSpeakers = []) {
  const byName = new Map(localSpeakers.map((item) => [normalizeName(item.name), item]));

  return apiSpeakers.map((item) => {
    const local = byName.get(normalizeName(item.name));

    return {
      id: local ? local.id : String(item._id),
      name: item.name,
      topic: item.topic,
      photo: local ? local.photo : item.photoUrl || PLACEHOLDER_PHOTO,
      photoRetina: local ? local.photoRetina : null,
      role: local ? local.role : 'Спикер',
      company: local ? local.company : 'DEVCONF 2026',
      date: local ? local.date : 'Время уточняется',
      hall: local ? local.hall : 'Зал уточняется',
      href: local ? `/speakers/${local.id}` : null,
    };
  });
}
