/*
  Форматирование отметки времени для плашки RenderInfo.

  Вызывается только на сервере, внутри getServerSideProps
  и getStaticProps. Часовой пояс задан явно, чтобы результат
  не зависел от настроек машины, на которой идёт сборка.
*/
const formatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'Europe/Minsk',
});

export function formatTimestamp(date = new Date()) {
  return formatter.format(date);
}
