import { createSlice } from '@reduxjs/toolkit';

/**
 * Срез состояния «Избранные спикеры», перенесён из ЛР № 22-23.
 *
 * В хранилище лежат только идентификаторы спикеров. Имена для панели
 * избранного компонент Favorites берёт из props страницы, поэтому
 * модуль с данными не попадает в клиентскую сборку целиком.
 */
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { ids: [] },
  reducers: {
    toggleFavorite(state, action) {
      const id = action.payload;
      const index = state.ids.indexOf(id);

      if (index === -1) {
        state.ids.push(id);
      } else {
        state.ids.splice(index, 1);
      }
    },
    clearFavorites(state) {
      state.ids = [];
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;

export const selectFavoriteIds = (state) => state.favorites.ids;
export const selectFavoritesCount = (state) => state.favorites.ids.length;
export const selectIsFavorite = (id) => (state) => state.favorites.ids.includes(id);

export default favoritesSlice.reducer;
