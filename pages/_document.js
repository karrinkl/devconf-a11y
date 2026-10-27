import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Шаблон HTML-документа, аналог index.html в Vite-проекте.
 * Отрисовывается только на сервере. Здесь задаётся язык страницы
 * и иконка вкладки. Шрифт Inter подключён
 * в _app.js из пакета @fontsource/inter, поэтому сайт открывается
 * с правильной типографикой и без доступа к Google Fonts.
 */
export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
