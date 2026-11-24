import { useState, useEffect } from 'react';
import API from './api';

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Если null - создаем, иначе - редактируем
  
  const [formData, setFormData] = useState({ name: '', description: '', form: '', unit: '' });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const { data } = await API.get('/medicines');
      console.log("Данные от бэкенда:", data);
      if (Array.isArray(data)) {
        setMedicines(data);
      } else {
        setMedicines([]);
      }
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
      setMedicines([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/medicines/${editingId}`, formData);
      } else {
        await API.post('/medicines', formData);
      }
      closeModal();
      fetchMedicines(); // Остаемся на этой же странице, просто обновляем список
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Ошибка сохранения");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Удалить лекарство?")) {
      await API.delete(`/medicines/${id}`);
      fetchMedicines();
    }
  };

  const openEditModal = (med) => {
    setEditingId(med.id);
    setFormData({ name: med.name, description: med.description || '', form: med.form || '', unit: med.unit || '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', description: '', form: '', unit: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Моя аптечка</h2>
        <button onClick={() => setIsModalOpen(true)}>+ Создать лекарство</button>
      </div>

      {/* ТАБЛИЦА ЛЕКАРСТВ */}
      <table className="styled-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Форма</th>
            <th>Дозировка (ед.)</th>
            <th>Описание</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {medicines.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Нет добавленных лекарств</td></tr>
          ) : (
            medicines.map(med => (
              <tr key={med.id}>
                <td>{med.name}</td>
                <td>{med.form}</td>
                <td>{med.unit}</td>
                <td>{med.description}</td>
                <td>
                  <button className="icon-btn" onClick={() => openEditModal(med)} title="Редактировать">✏️</button>
                  <button className="icon-btn text-danger" onClick={() => handleDelete(med.id)} title="Удалить">🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* МОДАЛЬНОЕ ОКНО ДЛЯ СОЗДАНИЯ/РЕДАКТИРОВАНИЯ */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingId ? 'Редактировать лекарство' : 'Новое лекарство'}</h3>
            <form onSubmit={handleSubmit}>
              <input placeholder="Название" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input placeholder="Форма (таблетки)" value={formData.form} onChange={e => setFormData({...formData, form: e.target.value})} />
              <input placeholder="Единица (мг)" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
              <input placeholder="Описание" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              
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