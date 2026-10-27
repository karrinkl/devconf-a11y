import PropTypes from 'prop-types';
import styles from './Icon.module.css';

/**
 * Icon - служебный презентационный компонент из ЛР № 19.
 *
 * В Next.js CSS-модули компонентов поддерживаются без настройки,
 * поэтому файл перенесён без изменений. Путь к иконке теперь
 * указывает на каталог public: /icons/icon-star.svg.
 */
function Icon({ src, size = 24, className = '' }) {
  return (
    <span
      className={className ? `${styles.icon} ${className}` : styles.icon}
      style={{ '--icon-source': `url(${src})`, '--icon-size': `${size}px` }}
      aria-hidden="true"
    />
  );
}

Icon.propTypes = {
  /** Путь к SVG-файлу в каталоге public/icons */
  src: PropTypes.string.isRequired,
  /** Размер стороны иконки в пикселях */
  size: PropTypes.number,
  /** Дополнительный CSS-класс от родительского компонента */
  className: PropTypes.string,
};

export default Icon;
