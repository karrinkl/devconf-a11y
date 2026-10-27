import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

import Icon from '../Icon/Icon';
import { clearFavorites, selectFavoriteIds, selectFavoritesCount } from '../../store/favoritesSlice';

/**
 * Favorites - счётчик избранных спикеров из ЛР № 22-23.
 *
 * Список спикеров приходит через props со страницы, которая получила
 * его в getStaticProps. Хранилище Redux создаётся в _app.js и живёт
 * всё время работы вкладки, поэтому отмеченные спикеры сохраняются
 * при переходах между страницами через Link.
 *
 * Счётчик - это область role="status": когда пользователь отмечает
 * спикера звёздочкой, экранный диктор сам зачитывает новое значение
 * «В избранном: 1 спикер», не перемещая фокус (WCAG 4.1.3).
 */
function Favorites({ speakers }) {
  const count = useSelector(selectFavoritesCount);
  const favoriteIds = useSelector(selectFavoriteIds);
  const dispatch = useDispatch();

  const names = speakers
    .filter((speaker) => favoriteIds.includes(speaker.id))
    .map((speaker) => speaker.name)
    .join(', ');

  const suffix = count === 1 ? 'спикер' : count >= 2 && count <= 4 ? 'спикера' : 'спикеров';

  return (
    <Stack direction="horizontal" gap={3} className="flex-wrap">
      <Badge
        bg={count ? 'primary' : 'secondary'}
        className="d-inline-flex align-items-center gap-2 fs-6 fw-normal py-2 px-3"
        role="status"
        aria-live="polite"
      >
        <Icon src="/icons/icon-star.svg" size={18} />
        {count === 0 ? 'Избранное пусто' : `В избранном: ${count} ${suffix}`}
      </Badge>

      {count === 0 ? (
        <span className="small text-body-secondary d-none d-xl-inline">
          Отметьте доклады звёздочкой на карточке
        </span>
      ) : (
        <>
          <span className="small text-body-secondary d-none d-xl-inline">{names}</span>
          <Button variant="outline-secondary" size="sm" onClick={() => dispatch(clearFavorites())}>
            Очистить
          </Button>
        </>
      )}
    </Stack>
  );
}

Favorites.propTypes = {
  speakers: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, name: PropTypes.string.isRequired })
  ).isRequired,
};

export default Favorites;
