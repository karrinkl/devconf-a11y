/*
  Поиск спикеров по имени.

  Функция чистая: не обращается к сети и к состоянию React, получает
  массив и строку запроса и возвращает новый массив. Поэтому её удобно
  проверять unit-тестами в отрыве от интерфейса.

  Правила поиска:
  - регистр букв не учитывается;
  - буквы «ё» и «е» считаются одинаковыми: «Ковалев» находит «Ковалёв»;
  - пробелы по краям запроса и повторные пробелы внутри игнорируются;
  - совпадение ищется в любой части имени: «мельн» находит «Дарья Мельник»;
  - пустой запрос возвращает список целиком.
*/

/** Приведение строки к виду, в котором сравниваются имя и запрос. */
export function normalizeName(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Возвращает спикеров, в имени которых встречается запрос.
 * Исходный массив не изменяется.
 */
export function filterSpeakersByName(speakers, query) {
  if (!Array.isArray(speakers)) return [];

  const needle = normalizeName(query);
  if (!needle) return [...speakers];

  return speakers.filter((speaker) => normalizeName(speaker.name).includes(needle));
}
