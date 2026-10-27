import Head from 'next/head';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';

import RenderInfo from '../components/RenderInfo/RenderInfo';
import ScheduleTable from '../components/ScheduleTable/ScheduleTable';
import { buildSchedule } from '../data/schedule';
import { formatTimestamp } from '../lib/formatDate';

/**
 * Страница «Расписание» (/schedule). Стратегия: SSR.
 *
 * getServerSideProps выполняется на сервере при каждом запросе к странице.
 * Next.js ждёт её результата, отрисовывает компонент с полученными props
 * в HTML и отправляет готовую разметку браузеру. Поэтому статусы докладов
 * и отметка времени всегда соответствуют моменту запроса.
 *
 * Код этой функции и импортированный ею модуль data/schedule.js
 * в клиентскую сборку не попадают.
 */
export async function getServerSideProps({ res }) {
  const now = Date.now();

  // Имитация обращения к источнику данных: расписание на момент запроса
  const schedule = buildSchedule(now);

  // Ответ нельзя кешировать: следующий запрос должен получить свежие статусы
  res.setHeader('Cache-Control', 'no-store');

  return {
    props: {
      schedule,
      renderedAt: formatTimestamp(new Date(now)),
      liveCount: schedule.filter((item) => item.status === 'live').length,
    },
  };
}

export default function SchedulePage({ schedule, renderedAt, liveCount }) {
  return (
    <>
      <Head>
        <title>Расписание - DEVCONF 2026</title>
        <meta name="description" content="Актуальное расписание докладов DEVCONF 2026 со статусами." />
      </Head>

      <section className="py-5">
        <Container>
          <h1 className="fw-bold mb-2">Расписание</h1>
          <p className="text-body-secondary mb-4">
            Сейчас идёт докладов: {liveCount}. Статусы пересчитываются сервером
            при каждом обновлении страницы.
          </p>

          <RenderInfo
            strategy="SSR"
            method="getServerSideProps"
            label="Страница сформирована сервером"
            timestamp={renderedAt}
          />

          <ScheduleTable items={schedule} />
        </Container>
      </section>
    </>
  );
}

SchedulePage.propTypes = {
  schedule: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderedAt: PropTypes.string.isRequired,
  liveCount: PropTypes.number.isRequired,
};
