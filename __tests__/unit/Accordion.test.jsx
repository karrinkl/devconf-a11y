import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Accordion from '../../components/Accordion/Accordion';

/*
  Задача 2 варианта 2: компонент Accordion. Проверяется, что по клику
  на заголовок меняется состояние пункта (открыт или закрыт).

  Состояние читается так же, как его видит пользователь экранного
  диктора: атрибут aria-expanded у кнопки и видимость панели с ответом.
*/

const items = [
  { id: 'stream', question: 'Нужен ли билет на трансляцию?', answer: 'Нет, трансляция бесплатная.' },
  { id: 'refund', question: 'Можно ли вернуть билет?', answer: 'Да, до 1 мая.' },
  { id: 'records', question: 'Будут ли записи?', answer: 'Да, через две недели.' },
];

const header = (name) => screen.getByRole('button', { name });

describe('Accordion', () => {
  it('отрисовывает заголовки всех пунктов', () => {
    render(<Accordion items={items} />);

    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(header('Можно ли вернуть билет?')).toBeInTheDocument();
  });

  it('по умолчанию все пункты закрыты', () => {
    render(<Accordion items={items} />);

    screen.getAllByRole('button').forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
    expect(screen.queryByText('Да, до 1 мая.')).not.toBeVisible();
  });

  it('открывает пункт, заданный в defaultOpenId', () => {
    render(<Accordion items={items} defaultOpenId="stream" />);

    expect(header('Нужен ли билет на трансляцию?')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Нет, трансляция бесплатная.')).toBeVisible();
  });

  it('открывает пункт по клику на заголовок и закрывает по повторному клику', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const button = header('Можно ли вернуть билет?');

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).not.toHaveClass('collapsed');
    expect(screen.getByText('Да, до 1 мая.')).toBeVisible();

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveClass('collapsed');
    expect(screen.getByText('Да, до 1 мая.')).not.toBeVisible();
  });

  it('при открытии другого пункта закрывает предыдущий', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} defaultOpenId="stream" />);

    await user.click(header('Будут ли записи?'));

    expect(header('Будут ли записи?')).toHaveAttribute('aria-expanded', 'true');
    expect(header('Нужен ли билет на трансляцию?')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Нет, трансляция бесплатная.')).not.toBeVisible();
  });

  it('открывается с клавиатуры клавишей Enter', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);

    await user.tab();
    expect(header('Нужен ли билет на трансляцию?')).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(header('Нужен ли билет на трансляцию?')).toHaveAttribute('aria-expanded', 'true');
  });

  it('сообщает о переключении через onToggle', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(<Accordion items={items} onToggle={onToggle} />);

    await user.click(header('Можно ли вернуть билет?'));
    await user.click(header('Можно ли вернуть билет?'));

    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onToggle).toHaveBeenNthCalledWith(1, 'refund', true);
    expect(onToggle).toHaveBeenNthCalledWith(2, 'refund', false);
  });

  it('связывает заголовок и панель атрибутами доступности', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const button = header('Будут ли записи?');

    await user.click(button);
    const panel = screen.getByRole('region', { name: 'Будут ли записи?' });

    expect(button).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveTextContent('Да, через две недели.');
  });

  describe('клавиатура (WAI-ARIA Accordion, ЛР № 30)', () => {
    it('стрелка вниз переводит фокус на следующий заголовок, с последнего - на первый', async () => {
      const user = userEvent.setup();
      render(<Accordion items={items} />);

      header('Нужен ли билет на трансляцию?').focus();
      await user.keyboard('{ArrowDown}');
      expect(header('Можно ли вернуть билет?')).toHaveFocus();

      await user.keyboard('{ArrowDown}{ArrowDown}');
      expect(header('Нужен ли билет на трансляцию?')).toHaveFocus();
    });

    it('стрелка вверх с первого заголовка переводит фокус на последний', async () => {
      const user = userEvent.setup();
      render(<Accordion items={items} />);

      header('Нужен ли билет на трансляцию?').focus();
      await user.keyboard('{ArrowUp}');

      expect(header('Будут ли записи?')).toHaveFocus();
    });

    it('Home и End переводят фокус на первый и последний заголовок', async () => {
      const user = userEvent.setup();
      render(<Accordion items={items} />);

      header('Можно ли вернуть билет?').focus();
      await user.keyboard('{End}');
      expect(header('Будут ли записи?')).toHaveFocus();
      await user.keyboard('{Home}');
      expect(header('Нужен ли билет на трансляцию?')).toHaveFocus();
    });

    it('стрелки только перемещают фокус и не меняют состояние пунктов', async () => {
      const user = userEvent.setup();
      render(<Accordion items={items} defaultOpenId="stream" />);

      header('Нужен ли билет на трансляцию?').focus();
      await user.keyboard('{ArrowDown}');

      expect(header('Нужен ли билет на трансляцию?')).toHaveAttribute('aria-expanded', 'true');
      expect(header('Можно ли вернуть билет?')).toHaveAttribute('aria-expanded', 'false');
    });

    it('пробел открывает пункт, на котором стоит фокус', async () => {
      const user = userEvent.setup();
      render(<Accordion items={items} />);

      header('Будут ли записи?').focus();
      await user.keyboard(' ');

      expect(header('Будут ли записи?')).toHaveAttribute('aria-expanded', 'true');
    });

    it('заголовок пункта имеет уровень из headingLevel', () => {
      render(<Accordion items={items} headingLevel={4} />);

      expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(3);
    });
  });
});
