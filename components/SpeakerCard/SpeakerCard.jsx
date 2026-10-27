import Link from 'next/link';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import Icon from '../Icon/Icon';
import { selectIsFavorite, toggleFavorite } from '../../store/favoritesSlice';

/**
 * SpeakerCard - карточка спикера на компоненте Card из React Bootstrap.
 *
 * По сравнению с ЛР № 23 добавлена ссылка на страницу спикера
 * /speakers/[id], она передаётся свойством href. Для спикеров,
 * которые есть только в базе API, страницы нет, и имя выводится
 * без ссылки. Ссылка сделана компонентом Link из next/link:
 * переход выполняется на клиенте без перезагрузки страницы,
 * а HTML и данные целевой страницы Next.js подгружает заранее,
 * когда ссылка появляется в области видимости.
 */
function SpeakerCard({
  id,
  name,
  role,
  company,
  topic,
  photo,
  photoRetina = null,
  date,
  hall,
  href = null,
  headingLevel = 3,
}) {
  const isFavorite = useSelector(selectIsFavorite(id));
  const dispatch = useDispatch();

  return (
    <Card className="h-100 shadow-sm" data-testid="speaker-card">
      {/*
        Имя спикера стоит в заголовке сразу под фото, поэтому изображение
        декоративное: alt="" и экранный диктор не повторяет имя дважды.
        Подробное описание портрета есть на странице спикера.
      */}
      <Card.Img
        variant="top"
        src={photo}
        srcSet={photoRetina ? `${photo} 1x, ${photoRetina} 2x` : undefined}
        alt=""
        loading="lazy"
      />

      <Card.Body className="d-flex flex-column">
        <Card.Title as={`h${headingLevel}`} className="h5 mb-1">
          {href ? (
            <Link href={href} className="stretched-link text-reset text-decoration-none">
              {name}
            </Link>
          ) : (
            name
          )}
        </Card.Title>

        <Card.Subtitle as="p" className="small text-body-secondary fw-normal mb-3">
          {role} · {company}
        </Card.Subtitle>

        <Card.Text className="mb-0">{topic}</Card.Text>
      </Card.Body>

      <Card.Footer className="bg-transparent d-flex flex-wrap gap-3 small text-body-secondary">
        <span className="d-inline-flex align-items-center gap-2">
          <Icon src="/icons/icon-calendar.svg" size={16} />
          <span className="visually-hidden">Время доклада:</span>
          {date}
        </span>
        <span className="d-inline-flex align-items-center gap-2">
          <Icon src="/icons/icon-location.svg" size={16} />
          <span className="visually-hidden">Место:</span>
          {hall}
        </span>
      </Card.Footer>

      {/*
        Кнопка стоит в разметке после текста карточки: при обходе с Tab
        фокус сначала попадает на имя спикера, потом на звёздочку.
        Визуально она по-прежнему в правом верхнем углу фотографии.
        Подпись постоянная, а состояние передаёт aria-pressed: диктор
        читает «В избранное: имя, кнопка, нажата» или «не нажата».
      */}
      <Button
        variant={isFavorite ? 'warning' : 'light'}
        size="sm"
        className="speaker-star position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
        onClick={() => dispatch(toggleFavorite(id))}
        aria-pressed={isFavorite}
        aria-label={`В избранное: ${name}`}
      >
        <Icon src="/icons/icon-star.svg" size={18} />
      </Button>
    </Card>
  );
}

SpeakerCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  photoRetina: PropTypes.string,
  date: PropTypes.string.isRequired,
  hall: PropTypes.string.isRequired,
  /** Адрес страницы спикера; у спикеров только из API её нет */
  href: PropTypes.string,
  /** Уровень заголовка с именем: h2 в списке под h1 страницы */
  headingLevel: PropTypes.oneOf([2, 3, 4]),
};

export default SpeakerCard;
