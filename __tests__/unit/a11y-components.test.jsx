import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import RegistrationForm from '../../components/RegistrationForm/RegistrationForm';
import SpeakerCard from '../../components/SpeakerCard/SpeakerCard';
import RenderInfo from '../../components/RenderInfo/RenderInfo';
import { makeStore } from '../../store';

/*
  Проверки доступности, добавленные в ЛР № 30: связь ошибки с полем
  формы, кнопка-переключатель «В избранное», декоративное фото
  в карточке и отсутствие ложного role="alert" у статичной плашки.
*/

describe('RegistrationForm: ошибки связаны с полем', () => {
  it('при неверном e-mail поле получает aria-invalid, описание ошибки и фокус', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);
    const input = screen.getByLabelText('E-mail');

    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).toHaveAccessibleDescription('Билет придёт на эту почту');

    await user.type(input, 'ivan@');
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(/Введите корректный e-mail/);
    expect(screen.getByRole('alert')).toHaveTextContent('Введите корректный e-mail');
    expect(input).toHaveFocus();
  });
});

describe('SpeakerCard: кнопка «В избранное»', () => {
  const props = {
    id: 'kovalev',
    name: 'Алексей Ковалёв',
    role: 'Staff Engineer',
    company: 'EPAM',
    topic: 'Трекинг объектов',
    photo: '/images/speaker-01-1x.webp',
    date: '18 мая, 14:00',
    hall: 'Зал A',
    href: '/speakers/kovalev',
  };

  const renderCard = (extra = {}) =>
    render(
      <Provider store={makeStore()}>
        <SpeakerCard {...props} {...extra} />
      </Provider>
    );

  it('имеет постоянную подпись, а состояние передаёт aria-pressed', async () => {
    const user = userEvent.setup();
    renderCard();
    const star = screen.getByRole('button', { name: 'В избранное: Алексей Ковалёв' });

    expect(star).toHaveAttribute('aria-pressed', 'false');
    await user.click(star);
    expect(screen.getByRole('button', { name: 'В избранное: Алексей Ковалёв' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('при обходе с Tab фокус сначала попадает на имя, затем на звёздочку', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.tab();
    expect(screen.getByRole('link', { name: 'Алексей Ковалёв' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'В избранное: Алексей Ковалёв' })).toHaveFocus();
  });

  it('фото декоративное: alt пустой, имя читается из заголовка нужного уровня', () => {
    const { container } = renderCard({ headingLevel: 2 });

    expect(container.querySelector('img')).toHaveAttribute('alt', '');
    expect(screen.getByRole('heading', { level: 2, name: 'Алексей Ковалёв' })).toBeInTheDocument();
  });

  it('дата и зал подписаны для экранного диктора', () => {
    renderCard();

    expect(screen.getByText('Время доклада:')).toHaveClass('visually-hidden');
    expect(screen.getByText('Место:')).toHaveClass('visually-hidden');
  });
});

describe('RenderInfo', () => {
  it('статичная плашка не объявляется как срочное сообщение', () => {
    render(<RenderInfo strategy="SSG" method="getStaticProps" label="Страница собрана" timestamp="27.10.2026" />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('note')).toHaveTextContent('Страница собрана: 27.10.2026');
  });
});
