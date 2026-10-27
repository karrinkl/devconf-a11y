import { useId, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Accordion - раскрывающийся список вопросов и ответов.
 *
 * Компонент написан в ЛР № 29, в ЛР № 30 доведён до шаблона Accordion
 * из WAI-ARIA Authoring Practices.
 *
 * Разметка:
 * - заголовок каждого пункта - элемент h2-h6 (уровень задаётся свойством
 *   headingLevel), внутри него настоящая кнопка <button>;
 * - у кнопки aria-expanded (открыт или закрыт пункт) и aria-controls
 *   (какую панель она открывает);
 * - панель - role="region" с aria-labelledby на заголовок, закрытая
 *   панель скрыта атрибутом hidden и не попадает ни в порядок фокуса,
 *   ни в дерево доступности.
 *
 * Клавиатура:
 * - Tab и Shift+Tab переходят между заголовками и содержимым панелей;
 * - Enter и Пробел открывают и закрывают пункт (поведение <button>);
 * - стрелки вниз и вверх переводят фокус на следующий и предыдущий
 *   заголовок по кругу, Home и End - на первый и последний.
 *
 * Одновременно открыт не больше одного пункта. Повторный клик
 * по заголовку открытого пункта закрывает его.
 */
function Accordion({ items, defaultOpenId = null, headingLevel = 3, onToggle = () => {} }) {
  const [openId, setOpenId] = useState(defaultOpenId);
  const baseId = useId();
  const buttons = useRef([]);
  const Heading = `h${headingLevel}`;

  const toggle = (id) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    onToggle(id, next === id);
  };

  const focusButton = (index) => {
    const count = items.length;
    buttons.current[(index + count) % count]?.focus();
  };

  const handleKeyDown = (event, index) => {
    switch (event.key) {
      case 'ArrowDown':
        focusButton(index + 1);
        break;
      case 'ArrowUp':
        focusButton(index - 1);
        break;
      case 'Home':
        focusButton(0);
        break;
      case 'End':
        focusButton(items.length - 1);
        break;
      default:
        return;
    }
    // стрелки и Home/End не должны прокручивать страницу
    event.preventDefault();
  };

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        const headerId = `${baseId}-header-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div className="accordion-item" key={item.id}>
            <Heading className="accordion-header">
              <button
                ref={(node) => {
                  buttons.current[index] = node;
                }}
                id={headerId}
                type="button"
                className={isOpen ? 'accordion-button' : 'accordion-button collapsed'}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                {item.question}
              </button>
            </Heading>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={isOpen ? 'accordion-collapse collapse show' : 'accordion-collapse collapse'}
              hidden={!isOpen}
            >
              <div className="accordion-body">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

Accordion.propTypes = {
  /** Пункты списка: идентификатор, заголовок и содержимое */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      question: PropTypes.node.isRequired,
      answer: PropTypes.node.isRequired,
    })
  ).isRequired,
  /** Идентификатор пункта, открытого при первой отрисовке */
  defaultOpenId: PropTypes.string,
  /** Уровень заголовков пунктов, по умолчанию h3 (секция страницы - h2) */
  headingLevel: PropTypes.oneOf([2, 3, 4, 5, 6]),
  /** Вызывается после клика: id пункта и признак «теперь открыт» */
  onToggle: PropTypes.func,
};

export default Accordion;
