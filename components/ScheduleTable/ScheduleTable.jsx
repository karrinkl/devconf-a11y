import Link from 'next/link';
import PropTypes from 'prop-types';
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';

const STATUS_VARIANT = {
  finished: 'secondary',
  live: 'danger',
  soon: 'warning',
  planned: 'primary',
};

/**
 * ScheduleTable - таблица докладов со статусами.
 * Используется на странице /schedule с серверным рендерингом.
 */
function ScheduleTable({ items }) {
  return (
    <Table responsive hover className="align-middle bg-white shadow-sm rounded-4 overflow-hidden">
      <caption className="visually-hidden">
        Расписание докладов DEVCONF 2026: время, тема, спикер, зал и статус
      </caption>
      <thead className="table-light">
        <tr>
          <th scope="col">Время</th>
          <th scope="col">Доклад</th>
          <th scope="col">Зал</th>
          <th scope="col">Статус</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} data-status={item.status}>
            <td className="text-nowrap fw-semibold">
              {item.start}–{item.end}
            </td>
            <td>
              <div className="fw-semibold">{item.topic}</div>
              <Link href={`/speakers/${item.id}`} className="small">
                {item.speakerName}
              </Link>
            </td>
            <td className="text-nowrap">{item.hall}</td>
            <td>
              <Badge bg={STATUS_VARIANT[item.status]} text={item.status === 'soon' ? 'dark' : undefined}>
                {item.statusLabel}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

ScheduleTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      speakerName: PropTypes.string.isRequired,
      topic: PropTypes.string.isRequired,
      hall: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      statusLabel: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ScheduleTable;
