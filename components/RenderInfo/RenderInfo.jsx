import PropTypes from 'prop-types';

/**
 * RenderInfo - плашка со стратегией рендеринга страницы.
 *
 * Отметка времени формируется не в браузере, а в функции получения
 * данных и приходит в props. Для SSR-страницы это момент запроса,
 * для SSG-страницы - момент сборки. Поэтому по исходному коду
 * HTML (Ctrl+U) видно, когда именно была сгенерирована разметка.
 *
 * В ЛР № 25-29 плашка была компонентом Alert с role="alert", и экранный
 * диктор зачитывал её как срочное сообщение при каждой загрузке страницы.
 * Текст статичный, поэтому в ЛР № 30 это абзац с role="note".
 */
function RenderInfo({ strategy, method, label, timestamp }) {
  const isSsr = strategy === 'SSR';

  return (
    <p
      role="note"
      className={`alert ${isSsr ? 'alert-info' : 'alert-success'} d-flex flex-wrap align-items-center gap-2 small mb-4`}
      data-render-strategy={strategy}
    >
      <strong>{strategy}</strong>
      <span>· {method} ·</span>
      <span>
        {label}: <time data-rendered-at={timestamp}>{timestamp}</time>
      </span>
    </p>
  );
}

RenderInfo.propTypes = {
  /** Аббревиатура стратегии: SSR или SSG */
  strategy: PropTypes.oneOf(['SSR', 'SSG']).isRequired,
  /** Имя функции получения данных */
  method: PropTypes.string.isRequired,
  /** Подпись перед отметкой времени */
  label: PropTypes.string.isRequired,
  /** Отметка времени, отформатированная на сервере */
  timestamp: PropTypes.string.isRequired,
};

export default RenderInfo;
