import { useState, useEffect } from 'react';
import API from './api';
import { CheckCircle2, XCircle, Info, Clock, ArrowRight, X } from 'lucide-react';

const STATUS_MAP = {
  PLANNED: 'Запланирован',
  TAKEN: 'Принят',
  SKIPPED: 'Пропущен'
};

const STATUS_COLORS = {
  PLANNED: { bg: '#fef3c7', color: '#d97706' },
  TAKEN: { bg: '#dcfce7', color: '#16a34a' },
  SKIPPED: { bg: '#fee2e2', color: '#dc2626' }
};

export default function Intakes() {
  const [intakes, setIntakes] = useState([]);
  const [selectedIntake, setSelectedIntake] = useState(null);
  const [history, setHistory] = useState([]);


  const [statusFilter, setStatusFilter] = useState('ALL');

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchIntakes();
  }, []);

  const fetchIntakes = async () => {
    try {
      const { data } = await API.get('/intakes');
      if (Array.isArray(data)) {
        const sortedData = [...data].sort((a, b) => {
          return new Date(a.plannedDatetime) - new Date(b.plannedDatetime);
        });
        setIntakes(sortedData);
      }
    } catch (e) {
      console.error("Ошибка при загрузке приемов:", e);
    }
  };

  const handleGenerate = async () => {
    try {
      await API.post('/intakes/generate');
      fetchIntakes();
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      alert("Ошибка генерации. Проверьте, есть ли активные расписания.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.patch(`/intakes/${id}/status`, { status: newStatus });
      fetchIntakes();
      if (selectedIntake?.id === id) {
        setSelectedIntake({ ...selectedIntake, status: newStatus });
        fetchHistory(id);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      alert("Ошибка смены статуса");
    }
  };

  const fetchHistory = async (id) => {
    try {
      const { data } = await API.get(`/intakes/${id}/history`);
      if (Array.isArray(data)) setHistory(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleIntakeClick = (intake) => {
    setSelectedIntake(intake);
    fetchHistory(intake.id);
  };


  const filteredIntakes = statusFilter === 'ALL' 
    ? intakes 
    : intakes.filter(int => int.status === statusFilter);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIntakes = filteredIntakes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIntakes.length / itemsPerPage);
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Мои приемы</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            value={statusFilter} 
            onChange={(e) => { 
              setStatusFilter(e.target.value); 
              setCurrentPage(1);
            }}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          >
            <option value="ALL">Все статусы</option>
            <option value="PLANNED">Запланирован</option>
            <option value="TAKEN">Принят</option>
            <option value="SKIPPED">Пропущен</option>
          </select>
          <button onClick={handleGenerate}>Сгенерировать на сегодня</button>
        </div>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Время</th>
            <th>Лекарство</th>
            <th>Дозировка</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {currentIntakes.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Нет приемов по выбранному фильтру.</td></tr>
          ) : (
            currentIntakes.map(int => (
              <tr
                key={int.id}
                onClick={() => handleIntakeClick(int)}
                style={{ cursor: 'pointer', backgroundColor: selectedIntake?.id === int.id ? '#e0e7ff' : '' }}
              >
                <td>{int.plannedDatetime?.replace('T', ' ')}</td>
                <td>{int.schedule?.medicine?.name}</td>
                <td>{int.schedule?.dosage} ({int.schedule?.medicine?.unit})</td>
                <td>
                  <span style={{
                    backgroundColor: STATUS_COLORS[int.status]?.bg,
                    color: STATUS_COLORS[int.status]?.color,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    {STATUS_MAP[int.status] || int.status}
                  </span>
                </td>
                <td>
                  <button className="icon-btn" onClick={(e) => { e.stopPropagation(); handleStatusChange(int.id, 'TAKEN'); }} title="Отметить как принято">
                    <CheckCircle2 size={20} color="green" />
                  </button>
                  <button className="icon-btn" onClick={(e) => { e.stopPropagation(); handleStatusChange(int.id, 'SKIPPED'); }} title="Отметить как пропущено">
                    <XCircle size={20} color="red" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px', gap: '10px', alignItems: 'center' }}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Назад</button>
          <span>Страница {currentPage} из {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Вперед</button>
        </div>
      )}

      {/* Детали приема и история  */}
      {selectedIntake && (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#f8fafc', position: 'relative' }}>
          <button 
            onClick={() => setSelectedIntake(null)} 
            style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', cursor: 'pointer' }}
            title="Закрыть"
          >
            <X size={24} color="#64748b" />
          </button>

          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb' }}>
            <Info size={24} /> Детали приема
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <p><strong>Лекарство:</strong> {selectedIntake.schedule?.medicine?.name}</p>
            <p><strong>Дозировка:</strong> {selectedIntake.schedule?.dosage} ({selectedIntake.schedule?.medicine?.unit})</p>
            <p><strong>Форма выпуска:</strong> {selectedIntake.schedule?.medicine?.form}</p>
            <p><strong>Время по расписанию:</strong> {selectedIntake.schedule?.intakeTime?.substring(0, 5)}</p>
          </div>
          
          <h4>История изменений</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {history.map(h => (
              <li key={h.id} style={{ padding: '10px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color="#64748b" />
                <span>{h.changedAt?.replace('T', ' ')}: </span>
                <span style={{ color: 'gray' }}>{STATUS_MAP[h.oldStatus] || 'Создан'}</span>
                <ArrowRight size={16} color="#64748b" /> 
                <span style={{ fontWeight: 'bold' }}>{STATUS_MAP[h.newStatus] || h.newStatus}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}