import { useState, useEffect } from 'react';
import { User, Mail, Activity, CheckCircle } from 'lucide-react';
import API from './api';

export default function Profile({ userEmail, userName }) {
  const [stats, setStats] = useState({ total: 0, taken: 0, skipped: 0 });

  useEffect(() => {
    API.get('/intakes').then(res => {
      const intakes = res.data;
      setStats({
        total: intakes.length,
        taken: intakes.filter(i => i.status === 'TAKEN').length,
        skipped: intakes.filter(i => i.status === 'SKIPPED').length
      });
    });
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <User size={28} /> Профиль пользователя
      </h2>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#2563eb', color: 'white', padding: '25px', borderRadius: '50%' }}>
          <User size={40} />
        </div>
        <div>
          <h3 style={{ margin: 0 }}>{userName}</h3>
          <p style={{ margin: '5px 0', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Mail size={16} /> {userEmail}
          </p>
        </div>
      </div>

      <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Activity size={20} /> Статистика приемов
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h4 style={{ color: '#64748b', margin: '0 0 10px 0' }}>Всего</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.total}</p>
        </div>
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h4 style={{ color: 'green', margin: '0 0 10px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}><CheckCircle size={16} /> Принято</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'green', margin: 0 }}>{stats.taken}</p>
        </div>
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h4 style={{ color: 'red', margin: '0 0 10px 0' }}>Пропущено</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'red', margin: 0 }}>{stats.skipped}</p>
        </div>
      </div>
    </div>
  );
}