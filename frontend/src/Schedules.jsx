import { useState, useEffect } from 'react';
import API from './api';

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
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
      if (Array.isArray(data)) setSchedules(data);
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

  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchedules = schedules.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(schedules.length / itemsPerPage);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Расписание приемов</h2>
        <button onClick={() => setIsModalOpen(true)}>+ Добавить расписание</button>
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
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Нет расписаний</td></tr>
          ) : (
            currentSchedules.map(sch => (
              <tr key={sch.id}>
                <td>{sch.medicine?.name || 'Неизвестно'}</td>
                <td>{sch.dosage}</td>
                <td>{sch.frequency}</td>
                <td>{sch.intakeTime?.substring(0, 5)}</td>
                <td>{sch.startDate?.split('T')[0]} - {sch.endDate?.split('T')[0] || '...'}</td>
                <td>
                  <button className="icon-btn" onClick={() => openEditModal(sch)}>✏️</button>
                  <button className="icon-btn text-danger" onClick={() => handleDelete(sch.id)}>🗑️</button>
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingId ? 'Редактировать расписание' : 'Новое расписание'}</h3>
            <form onSubmit={handleSubmit}>
              <select value={formData.medicineId} onChange={e => setFormData({...formData, medicineId: e.target.value})} required>
                <option value="">-- Выберите лекарство --</option>
                {medicines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <input placeholder="Дозировка" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} />
              <input placeholder="Частота" value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})} />
              
              <label>Время приема:</label>
              <input type="time" value={formData.intakeTime} onChange={e => setFormData({...formData, intakeTime: e.target.value})} required />
              
              <label>Дата начала:</label>
              <input type="datetime-local" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
              
              <label>Дата окончания:</label>
              <input type="datetime-local" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              
              <input placeholder="Комментарий" value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit">Сохранить</button>
                <button type="button" className="btn-secondary" onClick={closeModal}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}