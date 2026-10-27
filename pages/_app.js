import { useState } from 'react';
import { Provider } from 'react-redux';

import Layout from '../components/Layout/Layout';
import { makeStore } from '../store';

/*
  Глобальные стили в Next.js подключаются только здесь, в _app.js.
  Шрифт Inter берётся из пакета @fontsource/inter и раздаётся
  самим сервером Next.js, внешний CDN не нужен. Дальше порядок
  тот же, что в main.jsx из ЛР № 23: сначала таблица Bootstrap,
  затем собственная тема, которая переопределяет CSS-переменные
  библиотеки.
*/
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/theme.css';

/**
 * Корневой компонент приложения, аналог main.jsx в Vite-проекте.
 *
 * Next.js оборачивает в него каждую страницу. Component - компонент
 * текущей страницы, pageProps - объект props, который вернули
 * getServerSideProps или getStaticProps этой страницы.
 *
 * Хранилище создаётся через useState с функцией-инициализатором:
 * на сервере это свежий объект для каждого запроса, в браузере -
 * один объект на всю жизнь вкладки, который не пересоздаётся
 * при клиентских переходах между страницами.
 */
export default function App({ Component, pageProps }) {
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
