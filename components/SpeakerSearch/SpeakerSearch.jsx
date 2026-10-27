import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

/**
 * SpeakerSearch - поле поиска спикера по имени.
 *
 * Компонент управляемый: значение и обработчик приходят со страницы,
 * а сама фильтрация выполняется функцией filterSpeakersByName.
 */
function SpeakerSearch({ value, onChange, resultCount }) {
  return (
    <Form.Group controlId="speaker-search" className="mb-4" style={{ maxWidth: '28rem' }}>
      <Form.Label>Поиск по имени</Form.Label>
      <Form.Control
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Например, Ковалёв"
        autoComplete="off"
      />
      <Form.Text data-testid="search-result" aria-live="polite">
        Найдено: {resultCount}
      </Form.Text>
    </Form.Group>
  );
}

SpeakerSearch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  resultCount: PropTypes.number.isRequired,
};

export default SpeakerSearch;
