import { filterSpeakersByName, normalizeName } from '../../lib/filterSpeakers';

/*
  Задача 1 варианта 2: функция поиска спикеров по имени.
  Функция чистая, поэтому тестам не нужны ни DOM, ни моки.
*/

const speakers = [
  { id: 'kovalev', name: 'Алексей Ковалёв' },
  { id: 'melnik', name: 'Дарья Мельник' },
  { id: 'savchuk', name: 'Игорь Савчук' },
  { id: 'yarosh', name: 'Марина Ярош' },
];

const ids = (list) => list.map((item) => item.id);

describe('normalizeName', () => {
  it('приводит к нижнему регистру, заменяет ё на е и сжимает пробелы', () => {
    expect(normalizeName('  Алексей   КОВАЛЁВ ')).toBe('алексей ковалев');
  });

  it('безопасно обрабатывает null и undefined', () => {
    expect(normalizeName(null)).toBe('');
    expect(normalizeName(undefined)).toBe('');
  });
});

describe('filterSpeakersByName', () => {
  it('находит спикера по полному имени', () => {
    expect(ids(filterSpeakersByName(speakers, 'Дарья Мельник'))).toEqual(['melnik']);
  });

  it('находит по части имени или фамилии', () => {
    expect(ids(filterSpeakersByName(speakers, 'савч'))).toEqual(['savchuk']);
    expect(ids(filterSpeakersByName(speakers, 'Марина'))).toEqual(['yarosh']);
  });

  it('не учитывает регистр букв', () => {
    expect(ids(filterSpeakersByName(speakers, 'ЯРОШ'))).toEqual(['yarosh']);
  });

  it('считает буквы «е» и «ё» одинаковыми', () => {
    expect(ids(filterSpeakersByName(speakers, 'Ковалев'))).toEqual(['kovalev']);
    expect(ids(filterSpeakersByName(speakers, 'Ковалёв'))).toEqual(['kovalev']);
  });

  it('игнорирует пробелы по краям запроса', () => {
    expect(ids(filterSpeakersByName(speakers, '   мельник  '))).toEqual(['melnik']);
  });

  it('возвращает всех спикеров при пустом запросе', () => {
    expect(filterSpeakersByName(speakers, '')).toHaveLength(4);
    expect(filterSpeakersByName(speakers, '   ')).toHaveLength(4);
  });

  it('возвращает пустой массив, если совпадений нет', () => {
    expect(filterSpeakersByName(speakers, 'Петров')).toEqual([]);
  });

  it('может вернуть несколько спикеров', () => {
    // буква «и» есть в именах Дарьи, Игоря и Марины
    expect(ids(filterSpeakersByName(speakers, 'и'))).toEqual(['melnik', 'savchuk', 'yarosh']);
  });

  it('не изменяет исходный массив', () => {
    const copy = [...speakers];
    const result = filterSpeakersByName(speakers, 'Ковалёв');
    expect(speakers).toEqual(copy);
    expect(result).not.toBe(speakers);
  });

  it('возвращает пустой массив, если вместо списка передано не то', () => {
    expect(filterSpeakersByName(null, 'Ковалёв')).toEqual([]);
  });
});
