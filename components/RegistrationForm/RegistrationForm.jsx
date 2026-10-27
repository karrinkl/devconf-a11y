import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import Icon from '../Icon/Icon';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * RegistrationForm - форма регистрации из ЛР № 23, перенесена
 * без изменений логики. На сервере форма отрисовывается в исходном
 * состоянии, обработчики событий подключаются в браузере при гидратации.
 *
 * Доступность (ЛР № 30): при ошибке поле получает aria-invalid="true",
 * aria-describedby указывает на текст ошибки, сама ошибка - role="alert",
 * а фокус возвращается в поле. До исправления aria-describedby ссылался
 * на подсказку, которая при ошибке исчезала из разметки, и диктор
 * не сообщал, что поле заполнено неверно.
 */
function RegistrationForm({ helperText = 'Билет придёт на эту почту', onRegister = () => {} }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (event) => {
    setEmail(event.target.value);
    if (error) setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Введите корректный e-mail, например ivan@example.com');
      // фокус возвращается в поле, и диктор сразу зачитывает ошибку
      inputRef.current?.focus();
      return;
    }

    setError('');
    setIsRegistered(true);
    onRegister(email.trim());
  };

  if (isRegistered) {
    return (
      <Alert variant="success" className="mb-0" role="status">
        <Alert.Heading as="h3" className="h5">
          Заявка принята
        </Alert.Heading>
        Билет отправлен на {email.trim()}
      </Alert>
    );
  }

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Form.Group className="mb-4" controlId="registration-email">
        <Form.Label>E-mail</Form.Label>
        <Form.Control
          ref={inputRef}
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="ivan@example.com"
          autoComplete="email"
          required
          isInvalid={Boolean(error)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'registration-email-error' : 'registration-email-helper'}
        />
        <Form.Control.Feedback type="invalid" id="registration-email-error" role="alert">
          {error}
        </Form.Control.Feedback>
        {!error && <Form.Text id="registration-email-helper">{helperText}</Form.Text>}
      </Form.Group>

      <Button type="submit" variant="primary" className="d-inline-flex align-items-center gap-2">
        Зарегистрироваться
        <Icon src="/icons/icon-arrow-right.svg" size={20} />
      </Button>
    </Form>
  );
}

RegistrationForm.propTypes = {
  helperText: PropTypes.string,
  onRegister: PropTypes.func,
};

export default RegistrationForm;
