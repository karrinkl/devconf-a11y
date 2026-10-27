import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Favorites from '../../components/Favorites/Favorites';
import RenderInfo from '../../components/RenderInfo/RenderInfo';
import SpeakerCard from '../../components/SpeakerCard/SpeakerCard';
import SpeakerSearch from '../../components/SpeakerSearch/SpeakerSearch';
import { speakers } from '../../data/speakers';
import { fetchSpeakers, mergeWithLocal } from '../../lib/api';
import { filterSpeakersByName } from '../../lib/filterSpeakers';
import { formatTimestamp } from '../../lib/formatDate';

/**
 * Страница «Спикеры» (/speakers).
 *
 * HTML страницы по-прежнему генерируется при сборке (SSG, ЛР № 25):
 * getStaticProps отдаёт список из data/speakers.js, и поисковик видит
 * всех спикеров без выполнения JavaScript.
 *
 * В ЛР № 29 после загрузки в браузере страница запрашивает актуальный
 * список у REST API из ЛР № 28 (GET /api/speakers) и заменяет им данные
 * сборки. Если API недоступно, остаются данные сборки, а пользователь
 * видит предупреждение. Над списком добавлено поле поиска по имени.
 */
export async function getStaticProps() {
  const list = speakers.map(({ bio, tags, ...card }) => ({ ...card, href: `/speakers/${card.id}` }));

  return {
    props: {
      speakers: list,
      builtAt: formatTimestamp(),
    },
  };
}

export default function SpeakersPage({ speakers: initialSpeakers, builtAt }) {
  const [list, setList] = useState(initialSpeakers);
  const [source, setSource] = useState('build');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;

    fetchSpeakers()
      .then((data) => {
        if (cancelled) return;
        setList(mergeWithLocal(data, initialSpeakers));
        setSource('api');
      })
      .catch(() => {
        if (!cancelled) setSource('fallback');
      });

    return () => {
      cancelled = true;
    };
  }, [initialSpeakers]);

  const visible = useMemo(() => filterSpeakersByName(list, query), [list, query]);

  return (
    <>
      <Head>
        <title>Спикеры - DEVCONF 2026</title>
        <meta name="description" content="Спикеры конференции DEVCONF 2026 и темы их докладов." />
      </Head>

      <section className="py-5">
        <Container>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <h1 className="fw-bold mb-0">Спикеры</h1>
            <Favorites speakers={list} />
          </div>

          <RenderInfo strategy="SSG" method="getStaticProps" label="Страница собрана" timestamp={builtAt} />

          <div className="d-flex flex-wrap align-items-end justify-content-between gap-3">
            <SpeakerSearch value={query} onChange={setQuery} resultCount={visible.length} />

            <Badge
              bg={source === 'api' ? 'success' : 'secondary'}
              className="mb-4 fw-normal px-3 py-2"
              data-testid="data-source"
            >
              {source === 'api' ? 'Данные: API /api/speakers' : 'Данные: сборка сайта'}
            </Badge>
          </div>

          {source === 'fallback' && (
            <Alert variant="warning" className="small">
              Сервер API недоступен, показан список на момент сборки сайта.
            </Alert>
          )}

          {visible.length === 0 ? (
            <Alert variant="light" className="border" data-testid="search-empty">
              Спикер с таким именем не найден.
            </Alert>
          ) : (
            <Row as="ul" className="g-4 list-unstyled" aria-label="Список спикеров">
              {visible.map((speaker) => (
                <Col as="li" key={speaker.id} xs={12} md={6} xl={3}>
                  <SpeakerCard {...speaker} headingLevel={2} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </>
  );
}

SpeakersPage.propTypes = {
  speakers: PropTypes.arrayOf(PropTypes.object).isRequired,
  builtAt: PropTypes.string.isRequired,
};
