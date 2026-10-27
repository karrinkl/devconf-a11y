/*
  Данные спикеров DEVCONF 2026.

  Набор тот же, что в лабораторных работах № 19-23. В Vite-проекте
  изображения импортировались как модули, в Next.js они лежат
  в каталоге public и доступны по прямому адресу /images/...,
  поэтому здесь хранятся обычные строки с путями.

  Модуль используется только внутри getStaticProps и getStaticPaths,
  то есть читается во время сборки. В браузер попадают лишь те поля,
  которые функция вернула в props конкретной страницы.
*/

export const speakers = [
  {
    id: 'kovalev',
    name: 'Алексей Ковалёв',
    role: 'Staff Engineer',
    company: 'EPAM',
    topic: 'Трекинг объектов в реальном времени: от YOLO до DeepSORT',
    photo: '/images/speaker-01-1x.webp',
    photoRetina: '/images/speaker-01-2x.webp',
    date: '18 мая, 14:00',
    hall: 'Зал A',
    bio:
      'Десять лет в компьютерном зрении. Руководил внедрением систем ' +
      'видеоаналитики на производственных площадках, отвечал за трекинг ' +
      'людей и техники в потоке с десятков камер.',
    tags: ['Computer Vision', 'YOLO', 'DeepSORT'],
  },
  {
    id: 'melnik',
    name: 'Дарья Мельник',
    role: 'Head of Design',
    company: 'Wargaming',
    topic: 'Дизайн-система без боли: что ломается на втором году',
    photo: '/images/speaker-02-1x.webp',
    photoRetina: '/images/speaker-02-2x.webp',
    date: '18 мая, 15:30',
    hall: 'Зал B',
    bio:
      'Строит дизайн-системы для игровых сервисов с аудиторией в миллионы ' +
      'пользователей. Отвечает за связку Figma-библиотек и компонентов в коде.',
    tags: ['Design System', 'Figma', 'UI'],
  },
  {
    id: 'savchuk',
    name: 'Игорь Савчук',
    role: 'SRE',
    company: 'iTechArt',
    topic: 'Наблюдаемость сервисов: метрики, которые правда нужны',
    photo: '/images/speaker-03-1x.webp',
    photoRetina: '/images/speaker-03-2x.webp',
    date: '19 мая, 11:00',
    hall: 'Зал A',
    bio:
      'Поддерживает высоконагруженные сервисы, внедрял мониторинг ' +
      'на базе Prometheus и Grafana в десятке продуктовых команд.',
    tags: ['SRE', 'Observability', 'Prometheus'],
  },
  {
    id: 'yarosh',
    name: 'Марина Ярош',
    role: 'Frontend Lead',
    company: 'Godel',
    topic: 'Компонентные библиотеки: когда брать готовую, а когда свою',
    photo: '/images/speaker-04-1x.webp',
    photoRetina: '/images/speaker-04-2x.webp',
    date: '18 мая, 12:00',
    hall: 'Зал C',
    bio:
      'Ведёт фронтенд-команду из двенадцати человек. Переводила крупный ' +
      'проект с самописных компонентов на готовую UI-библиотеку и обратно.',
    tags: ['React', 'UI Kit', 'Frontend'],
  },
  {
    id: 'bortnik',
    name: 'Павел Бортник',
    role: 'Data Engineer',
    company: 'Яндекс',
    topic: 'Потоковая обработка видео: архитектура без лишних копий',
    photo: '/images/speaker-05-1x.webp',
    photoRetina: '/images/speaker-05-2x.webp',
    date: '18 мая, 17:00',
    hall: 'Зал B',
    bio:
      'Проектирует конвейеры обработки видеопотоков. Специализируется ' +
      'на передаче кадров между сервисами без лишнего копирования памяти.',
    tags: ['Streaming', 'Kafka', 'Video'],
  },
  {
    id: 'lagun',
    name: 'Ольга Лагун',
    role: 'QA Architect',
    company: 'Intetics',
    topic: 'Тестирование интерфейсов: визуальные регрессии в CI',
    photo: '/images/speaker-06-1x.webp',
    photoRetina: '/images/speaker-06-2x.webp',
    date: '19 мая, 10:00',
    hall: 'Зал C',
    bio:
      'Выстраивает автоматизированное тестирование веб-интерфейсов, ' +
      'в том числе сравнение скриншотов в конвейере непрерывной интеграции.',
    tags: ['QA', 'Playwright', 'CI'],
  },
  {
    id: 'demchuk',
    name: 'Антон Демчук',
    role: 'Security Engineer',
    company: 'Viber',
    topic: 'Защита фронтенда: CSP, зависимости и чужой код в сборке',
    photo: '/images/speaker-07-1x.webp',
    photoRetina: '/images/speaker-07-2x.webp',
    date: '19 мая, 13:30',
    hall: 'Зал A',
    bio:
      'Занимается безопасностью клиентских приложений: политики CSP, ' +
      'аудит зависимостей и контроль стороннего кода в сборке.',
    tags: ['Security', 'CSP', 'npm'],
  },
  {
    id: 'rudenko',
    name: 'Вероника Руденко',
    role: 'Engineering Manager',
    company: 'Flo',
    topic: 'Рефакторинг легаси-интерфейса без остановки продукта',
    photo: '/images/speaker-08-1x.webp',
    photoRetina: '/images/speaker-08-2x.webp',
    date: '19 мая, 16:00',
    hall: 'Зал B',
    bio:
      'Руководит командами мобильной и веб-разработки. Провела поэтапную ' +
      'миграцию интерфейса, которым ежедневно пользуются миллионы людей.',
    tags: ['Management', 'Refactoring', 'Legacy'],
  },
];

/** Поиск спикера по идентификатору, используется в getStaticProps. */
export function getSpeakerById(id) {
  return speakers.find((speaker) => speaker.id === id) || null;
}
