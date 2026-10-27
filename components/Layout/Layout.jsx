import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const NAV_ITEMS = [
  { href: '/', label: 'Главная' },
  { href: '/schedule', label: 'Расписание' },
  { href: '/speakers', label: 'Спикеры' },
];

/**
 * Layout - общий каркас всех страниц: навигация и подвал.
 *
 * Доступность (ЛР № 30): ссылка пропуска меню в начале страницы,
 * меню в ориентире header > nav с подписью «Основное меню», текущий
 * пункт отмечен aria-current="page", фокус пунктов меню виден на тёмном
 * фоне (стили .site-nav в theme.css).
 *
 * Пункты меню - это Nav.Link, отрисованные как Link из next/link
 * (свойство as). Так ссылки сохраняют оформление Bootstrap, а переход
 * между страницами выполняется на клиенте без полной перезагрузки.
 */
function Layout({ children }) {
  const { pathname } = useRouter();

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Ссылка для пропуска меню: видна только при фокусе с клавиатуры (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-link visually-hidden-focusable">
        Перейти к основному содержимому
      </a>

      <header>
        <Navbar
          expand="md"
          bg="dark"
          data-bs-theme="dark"
          className="site-nav py-3"
          as="nav"
          aria-label="Основное меню"
        >
          <Container>
            <Navbar.Brand as={Link} href="/">
              <img src="/icons/logo-devconf-full-inverse.svg" alt="DEVCONF 2026, на главную" height="32" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="main-nav" aria-label="Открыть меню" />
            <Navbar.Collapse id="main-nav">
              <Nav className="ms-auto gap-md-2">
                {NAV_ITEMS.map((item) => (
                  <Nav.Link
                    key={item.href}
                    as={Link}
                    href={item.href}
                    active={isActive(item.href)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Nav.Link>
                ))}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      {/* tabIndex={-1} позволяет перевести фокус на main по ссылке пропуска */}
      <main id="main-content" className="flex-grow-1" tabIndex={-1}>
        {children}
      </main>

      <footer className="py-4 border-top">
        <Container>
          <p className="mb-0 small text-body-secondary">
            DEVCONF 2026 · Лабораторная работа № 30 · доступность по WCAG 2.2 AA
          </p>
        </Container>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
