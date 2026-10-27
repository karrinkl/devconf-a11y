/*
  Настройка Jest для проекта на Next.js.

  Функция nextJest из пакета next/jest подключает компилятор SWC
  для JSX, заглушки для импортов CSS и CSS-модулей и переменные
  окружения из .env, поэтому отдельный Babel не нужен.
*/
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
  // DOM в памяти вместо браузера: нужен для тестов компонентов
  testEnvironment: 'jsdom',
  // матчеры toBeInTheDocument, toBeVisible, toHaveAttribute и другие
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // unit-тесты лежат в __tests__, E2E-тесты Playwright Jest не трогает
  testMatch: ['<rootDir>/__tests__/**/*.test.{js,jsx}'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/e2e/'],
  collectCoverageFrom: [
    'lib/filterSpeakers.js',
    'lib/api.js',
    'components/Accordion/Accordion.jsx',
    'components/SpeakerSearch/SpeakerSearch.jsx',
    'pages/speakers/index.js',
  ],
};

module.exports = createJestConfig(config);
