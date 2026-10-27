import Head from 'next/head';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';

/** Собственная страница 404. Next.js собирает её статически. */
export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Страница не найдена - DEVCONF 2026</title>
      </Head>
      <section className="py-5">
        <Container>
          <h1 className="fw-bold">404</h1>
          <p className="lead">Такой страницы нет.</p>
          <Link href="/">На главную</Link>
        </Container>
      </section>
    </>
  );
}
