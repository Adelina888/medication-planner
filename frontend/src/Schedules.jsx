import { useState, useEffect } from 'react';
import API from './api';
import { Pencil, Trash2,  XCircle } from 'lucide-react';

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterTime, setFilterTime] = useState('');
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    medicineId: '',
    dosage: '',
    frequency: '',
    intakeTime: '12:00', 
    startDate: '',
    endDate: '',
    comment: ''
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchSchedules();
    // eslint-disable-next-line react-hooks/immutability
    fetchMedicines();
  }, []);

  const fetchSchedules = async () => {
    try {
      const { data } = await API.get('/schedules');
      if (Array.isArray(data)) {
        const sortedData = [...data].sort((a, b) => {
          return new Date(a.startDate) - new Date(b.startDate);
        });
        setSchedules(sortedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMedicines = async () => {
    try {
      const { data } = await API.get('/medicines');
      if (Array.isArray(data)) setMedicines(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.medicineId) {
      alert("Выберите лекарство!");
      return;
    }

    const formatDateTime = (dateStr) => dateStr ? `${dateStr}:00` : null;
    const formatTime = (timeStr) => timeStr ? `${timeStr}:00` : null;

    const payload = {
      medicineId: Number(formData.medicineId),
      schedule: {
        dosage: formData.dosage,
        frequency: formData.frequency,
        intakeTime: formatTime(formData.intakeTime),
        startDate: formatDateTime(formData.startDate),
        endDate: formatDateTime(formData.endDate),
        comment: formData.comment,
        status: "ACTIVE"
      }
    };

    try {
      if (editingId) {
        await API.put(`/schedules/${editingId}`, payload);
      } else {
        await API.post('/schedules', payload);
      }
      closeModal();
      fetchSchedules();
    } catch (error) {
      alert("Ошибка при сохранении расписания: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Удалить запись расписания?")) {
      try {
        await API.delete(`/schedules/${id}`);
        fetchSchedules();
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        alert("Ошибка удаления");
      }
    }
  };

  const openEditModal = (sch) => {
    setEditingId(sch.id);
    setFormData({
      medicineId: sch.medicine?.id || '',
      dosage: sch.dosage || '',
      frequency: sch.frequency || '',
      intakeTime: sch.intakeTime ? sch.intakeTime.substring(0, 5) : '12:00', 
      startDate: sch.startDate ? sch.startDate.substring(0, 16) : '', 
      endDate: sch.endDate ? sch.endDate.substring(0, 16) : '',
      comment: sch.comment || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ medicineId: '', dosage: '', frequency: '', intakeTime: '12:00', startDate: '', endDate: '', comment: '' });
  };

  const filteredSchedules = schedules.filter(sch => {

    const schStart = new Date(sch.startDate);
    const schEnd = sch.endDate ? new Date(sch.endDate) : new Date('9999-12-31'); 
    
    let matchPeriod = true;
    if (filterStartDate || filterEndDate) {
      const fStart = filterStartDate ? new Date(filterStartDate) : new Date('1900-01-01');
      const fEnd = filterEndDate ? new Date(filterEndDate) : new Date('9999-12-31');
      
      matchPeriod = schStart <= fEnd && schEnd >= fStart;
    }

    let matchTime = true;
    if (filterTime) {
      const schTime = sch.intakeTime ? sch.intakeTime.substring(0, 5) : '';
      matchTime = schTime === filterTime;
    }

    return matchPeriod && matchTime;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchedules = filteredSchedules.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);

  const resetFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterTime('');
    setCurrentPage(1);
  };


  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1); 
  };

  const isFiltered = filterStartDate || filterEndDate || filterTime;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Расписание приемов</h2>
        <button onClick={() => setIsModalOpen(true)}>+ Добавить расписание</button>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        alignItems: 'flex-end', 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#f8fafc', 
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>Дата начала (от)</label>
          <input 
            type="date" 
            value={filterStartDate} 
            onChange={handleFilterChange(setFilterStartDate)} 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>Дата окончания (до)</label>
          <input 
            type="date" 
            value={filterEndDate} 
            onChange={handleFilterChange(setFilterEndDate)} 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label htmlFor="filter-time" style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>Время приема</label>
          <input id="filter-time" type="time" value={filterTime} onChange={handleFilterChange(setFilterTime)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        </div>
        
        {isFiltered && (
          <button 
            onClick={resetFilters} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px', 
              padding: '8px 12px', 
              backgroundColor: '#fee2e2', 
              color: '#dc2626', 
              border: '1px solid #fecaca', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              height: '38px'
            }}
          >
            <XCircle size={16} /> Сбросить
          </button>
        )}
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Лекарство</th>
            <th>Дозировка</th>
            <th>Частота</th>
            <th>Время</th>
            <th>Период</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {currentSchedules.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                {isFiltered ? 'Нет расписаний, соответствующих фильтрам' : 'Нет расписаний'}
              </td>
            </tr>
          ) : (
            currentSchedules.map(sch => (
              <tr key={sch.id}>
                <td>{sch.medicine?.name || 'Неизвестно'}</td>
                <td>{sch.dosage}</td>
                <td>{sch.frequency}</td>
                <td>{sch.intakeTime?.substring(0, 5)}</td>
                <td>{sch.startDate?.split('T')[0]} — {sch.endDate ? sch.endDate.split('T')[0] : 'бессрочно'}</td>
                <td>
                  <button className="icon-btn" onClick={() => openEditModal(sch)} title="Редактировать">
                    <Pencil size={18} color="#2563eb" />
                  </button>
                  <button className="icon-btn" onClick={() => handleDelete(sch.id)} title="Удалить">
                    <Trash2 size={18} color="#ef4444" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px', gap: '10px' }}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Назад</button>
          <span style={{ padding: '10px' }}>Страница {currentPage} из {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Вперед</button>
        </div>
      )}

      {/* Модальное окно  */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingId ? 'Редактировать расписание' : 'Новое расписание'}</h3>
            <form onSubmit={handleSubmit}>
              <select value={formData.medicineId} onChange={e => setFormData({...formData, medicineId: e.target.value})} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }}>
                <option value="">-- Выберите лекарство --</option>
                {medicines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <input placeholder="Дозировка" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              <input placeholder="Частота" value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              
              <label style={{ display: 'block', marginBottom: '5px' }}>Время приема:</label>
              <input type="time" value={formData.intakeTime} onChange={e => setFormData({...formData, intakeTime: e.target.value})} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              
              <label htmlFor="start-date" style={{ display: 'block', marginBottom: '5px' }}>Дата начала:</label>
              <input 
                id="start-date"
                type="datetime-local" 
                value={formData.startDate} 
                onChange={e => setFormData({...formData, startDate: e.target.value})} 
                required 
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }} 
              />
              
              <label htmlFor="end-date" style={{ display: 'block', marginBottom: '5px' }}>Дата окончания:</label>
              <input 
                id="end-date"
                type="datetime-local" 
                value={formData.endDate} 
                onChange={e => setFormData({...formData, endDate: e.target.value})} 
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }} 
              />
              <input placeholder="Комментарий" value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Сохранить</button>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '10px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}