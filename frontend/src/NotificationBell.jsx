import { useState, useEffect } from 'react';
import { Bell, CheckCircle, X } from 'lucide-react';
import API from './api';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications');
      if (Array.isArray(data)) setNotifications(data);
    } catch (e) { console.error(e); }
  };

  const handleRead = async (id, e) => {
    e.stopPropagation(); // Чтобы клик не закрывал окно
    try {
      await API.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error("Ошибка при прочтении", error);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}
      >
        <Bell size={24} />
        {notifications.length > 0 && (
          <span style={{ 
            position: 'absolute', top: '-4px', right: '-4px', 
            background: '#ef4444', color: 'white', borderRadius: '50%', 
            padding: '2px 6px', fontSize: '12px', fontWeight: 'bold',
            boxShadow: '0 0 0 2px #1e3a8a'
          }}>
            {notifications.length}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div style={{ 
          position: 'absolute', right: 0, top: '45px', 
          background: 'white', color: 'black', width: '320px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)', borderRadius: '12px', 
          overflow: 'hidden', zIndex: 1000, border: '1px solid #e2e8f0'
        }}>
          <div style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
            <h4 style={{ margin: 0, color: '#1e293b' }}>Уведомления</h4>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} color="#64748b" /></button>
          </div>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                Нет новых уведомлений
              </div>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  onClick={(e) => handleRead(n.id, e)} 
                  style={{ padding: '15px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'flex-start', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <CheckCircle size={18} color="#2563eb" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>{n.message}</p>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Нажмите, чтобы отметить прочитанным</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}