import { configureStore } from '@reduxjs/toolkit';

import favoritesReducer from './favoritesSlice';

/**
 * Фабрика хранилища.
 *
 * В Vite-проекте хранилище создавалось один раз на уровне модуля.
 * В Next.js так делать нельзя: на сервере модуль загружается один раз
 * на весь процесс, и единственное хранилище стало бы общим для всех
 * пользователей. Поэтому экспортируется функция, а вызывается она
 * в pages/_app.js отдельно для каждого запроса и для каждой вкладки
 * браузера.
 */
export function makeStore() {
  return configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
  });
}
