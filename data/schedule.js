import { speakers } from './speakers';

/*
  Имитация источника данных для страницы «Расписание».

  В настоящем проекте расписание пришло бы из базы или из API
  (например, из сервиса ЛР № 28). Здесь время начала каждого доклада
  задано смещением в минутах от момента запроса: offset -90 означает
  «начался полтора часа назад», offset 45 - «начнётся через 45 минут».

  Благодаря этому статусы докладов («Завершён», «Идёт сейчас»,
  «Скоро», «Запланирован») зависят от того, когда пришёл запрос.
  Страница с серверным рендерингом пересчитывает их при каждом
  обновлении, и это видно в исходном коде HTML.
*/

const PLAN = [
  { speakerId: 'lagun', offset: -150, duration: 45 },
  { speakerId: 'yarosh', offset: -95, duration: 45 },
  { speakerId: 'kovalev', offset: -30, duration: 60 },
  { speakerId: 'melnik', offset: -10, duration: 40 },
  { speakerId: 'savchuk', offset: 25, duration: 45 },
  { speakerId: 'demchuk', offset: 50, duration: 40 },
  { speakerId: 'bortnik', offset: 120, duration: 45 },
  { speakerId: 'rudenko', offset: 180, duration: 45 },
];

const MINUTE = 60 * 1000;
const SOON_WINDOW = 30; // минут: в этом окне доклад получает статус «Скоро»

/** Статус доклада относительно момента now. */
export function getStatus(startMs, endMs, now) {
  if (now >= endMs) return { code: 'finished', label: 'Завершён' };
  if (now >= startMs) return { code: 'live', label: 'Идёт сейчас' };
  if (startMs - now <= SOON_WINDOW * MINUTE) return { code: 'soon', label: 'Скоро' };
  return { code: 'planned', label: 'Запланирован' };
}

const timeFormat = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Minsk',
});

/**
 * Формирует расписание на момент now.
 * Возвращает только сериализуемые значения (строки и числа):
 * getServerSideProps передаёт props в браузер в виде JSON.
 */
export function buildSchedule(now = Date.now()) {
  return PLAN.map((slot) => {
    const speaker = speakers.find((item) => item.id === slot.speakerId);
    const startMs = now + slot.offset * MINUTE;
    const endMs = startMs + slot.duration * MINUTE;
    const status = getStatus(startMs, endMs, now);

    return {
      id: slot.speakerId,
      start: timeFormat.format(startMs),
      end: timeFormat.format(endMs),
      speakerName: speaker.name,
      topic: speaker.topic,
      hall: speaker.hall,
      status: status.code,
      statusLabel: status.label,
    };
  });
}
