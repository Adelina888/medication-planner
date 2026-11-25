import { useState, useEffect } from 'react';
import API from './api';
import { CheckCircle, XCircle, Info } from 'lucide-react';

// Перевод статусов
const STATUS_MAP = {
  PLANNED: 'Запланирован',
  TAKEN: 'Принят',
  SKIPPED: 'Пропущен'
};

export default function Intakes() {
  const [intakes, setIntakes] = useState([]);
  const [selectedIntake, setSelectedIntake] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchIntakes();
  }, []);

  const fetchIntakes = async () => {
    try {
      const { data } = await API.get('/intakes');
      if (Array.isArray(data)) setIntakes(data);
    } catch (e) { console.error(e); }
  };

  const handleGenerate = async () => {
    try {
      await API.post('/intakes/generate');
      fetchIntakes();
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      alert("Ошибка генерации");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.patch(`/intakes/${id}/status`, { status });
      fetchIntakes();
      if (selectedIntake?.id === id) {
        setSelectedIntake({...selectedIntake, status});
        fetchHistory(id);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (e) { alert("Ошибка смены статуса"); }
  };

  const fetchHistory = async (id) => {
    try {
      const { data } = await API.get(`/intakes/${id}/history`);
      if (Array.isArray(data)) setHistory(data);
    } catch (e) { console.error(e); }
  };

  const handleIntakeClick = (intake) => {
    setSelectedIntake(intake);
    fetchHistory(intake.id);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Мои приемы</h2>
        <button onClick={handleGenerate}>Сгенерировать на сегодня</button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Время</th>
            <th>Лекарство</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {intakes.map(int => (
            <tr key={int.id} onClick={() => handleIntakeClick(int)} style={{ cursor: 'pointer', background: selectedIntake?.id === int.id ? '#e0e7ff' : '' }}>
              <td>{int.plannedDatetime?.replace('T', ' ')}</td>
              <td>{int.schedule?.medicine?.name}</td>
              <td>{STATUS_MAP[int.status] || int.status}</td>
              <td>
                <button className="icon-btn" onClick={(e) => { e.stopPropagation(); handleStatusChange(int.id, 'TAKEN'); }}><CheckCircle color="green" /></button>
                <button className="icon-btn" onClick={(e) => { e.stopPropagation(); handleStatusChange(int.id, 'SKIPPED'); }}><XCircle color="red" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Детальная информация и история */}
      {selectedIntake && (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Детали приема <Info size={20} /></h3>
          <p><strong>Лекарство:</strong> {selectedIntake.schedule?.medicine?.name}</p>
          <p><strong>Дозировка:</strong> {selectedIntake.schedule?.dosage}</p>
          <p><strong>Время по расписанию:</strong> {selectedIntake.schedule?.intakeTime?.substring(0,5)}</p>
          <p><strong>Текущий статус:</strong> {STATUS_MAP[selectedIntake.status]}</p>
          
          <h4>История изменений</h4>
          <ul>
            {history.map(h => (
              <li key={h.id}>
                {h.changedAt?.replace('T', ' ')}: {STATUS_MAP[h.oldStatus] || h.oldStatus} ➡️ {STATUS_MAP[h.newStatus] || h.newStatus}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}