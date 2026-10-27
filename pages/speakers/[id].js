import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';

import Icon from '../../components/Icon/Icon';
import RenderInfo from '../../components/RenderInfo/RenderInfo';
import { getSpeakerById, speakers } from '../../data/speakers';
import { formatTimestamp } from '../../lib/formatDate';

/**
 * Страница спикера (/speakers/[id]). Стратегия: SSG с динамическим маршрутом.
 *
 * Квадратные скобки в имени файла объявляют параметр маршрута id.
 * Чтобы сгенерировать такие страницы заранее, Next.js должен знать
 * все допустимые значения параметра. Их сообщает getStaticPaths:
 * по одному объекту { params: { id } } на каждого спикера.
 *
 * fallback: false означает, что других страниц нет: запрос
 * /speakers/unknown получит ответ 404 без обращения к функциям.
 */
export async function getStaticPaths() {
  return {
    paths: speakers.map((speaker) => ({ params: { id: speaker.id } })),
    fallback: false,
  };
}

/**
 * Для каждого пути из getStaticPaths Next.js вызывает getStaticProps
 * и передаёт значение параметра в context.params. В итоге при сборке
 * появляется восемь готовых HTML-файлов: kovalev.html, melnik.html и т. д.
 */
export async function getStaticProps({ params }) {
  const speaker = getSpeakerById(params.id);

  if (!speaker) {
    return { notFound: true };
  }

  return {
    props: {
      speaker,
      builtAt: formatTimestamp(),
    },
  };
}

export default function SpeakerPage({ speaker, builtAt }) {
  return (
    <>
      <Head>
        <title>{`${speaker.name} - DEVCONF 2026`}</title>
        <meta name="description" content={`${speaker.name}: «${speaker.topic}»`} />
      </Head>

      <section className="py-5">
        <Container>
          <Link href="/speakers" className="d-inline-block mb-4">
            <span aria-hidden="true">←</span> Все спикеры
          </Link>

          <RenderInfo
            strategy="SSG"
            method="getStaticPaths + getStaticProps"
            label="Страница собрана"
            timestamp={builtAt}
          />

          <Row className="g-5 align-items-start">
            <Col xs={12} md={4}>
              <img
                className="img-fluid rounded-4 shadow-sm w-100"
                src={speaker.photo}
                srcSet={`${speaker.photo} 1x, ${speaker.photoRetina} 2x`}
                alt={`Портрет спикера: ${speaker.name}, ${speaker.role}, ${speaker.company}`}
              />
            </Col>

            <Col xs={12} md={8}>
              <h1 className="fw-bold mb-1">{speaker.name}</h1>
              <p className="text-body-secondary mb-4">
                {speaker.role} · {speaker.company}
              </p>

              <h2 className="h4 fw-semibold">«{speaker.topic}»</h2>

              <Stack direction="horizontal" gap={4} className="flex-wrap text-body-secondary my-3">
                <span className="d-inline-flex align-items-center gap-2">
                  <Icon src="/icons/icon-calendar.svg" size={18} />
                  {speaker.date}
                </span>
                <span className="d-inline-flex align-items-center gap-2">
                  <Icon src="/icons/icon-location.svg" size={18} />
                  {speaker.hall}
                </span>
              </Stack>

              <p className="lead">{speaker.bio}</p>

              <Stack direction="horizontal" gap={2} className="flex-wrap">
                {speaker.tags.map((tag) => (
                  <Badge key={tag} bg="light" text="dark" className="border fw-normal px-3 py-2">
                    {tag}
                  </Badge>
                ))}
              </Stack>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

SpeakerPage.propTypes = {
  speaker: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    photoRetina: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    hall: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  builtAt: PropTypes.string.isRequired,
};
