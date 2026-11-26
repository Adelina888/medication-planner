import { useState } from 'react';
import API from './api';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      
      const { data } = await API.post(endpoint, payload);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userName', data.name);
      
      onLogin(); 
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data || 'Ошибка авторизации');
    }
  };

  const styles = {
    container: {
      maxWidth: '380px',         
      margin: '50px auto',        
      padding: '30px',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      backgroundColor: '#ffffff',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    appName: {
      textAlign: 'center',
      marginBottom: '8px',
      color: '#2563eb',        
      fontSize: '26px',
      fontWeight: '800',
      letterSpacing: '-0.5px'
    },
    heading: {
      textAlign: 'center',
      marginBottom: '24px',
      color: '#64748b',          
      fontSize: '16px',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      marginBottom: '16px',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontSize: '15px',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    },
    submitButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '16px',
      transition: 'background-color 0.2s'
    },
    toggleButton: {
      width: '100%',
      padding: '8px',
      backgroundColor: 'transparent',
      color: '#2563eb',
      border: 'none',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'color 0.2s'
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      {/* Название приложения */}
      <div style={styles.appName}> Medication Planner</div>
      
      {/* Подзаголовок */}
      <h2 style={styles.heading}>
        {isLogin ? 'Вход в вашу учетную запись' : 'Создание новой учетной записи'}
      </h2>
      
      {!isLogin && (
        <input 
          type="text" 
          placeholder="Ваше имя" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
          style={styles.input}
        />
      )}
      
      <input 
        type="email" 
        placeholder="Email адрес" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        required 
        style={styles.input}
      />
      
      <input 
        type="password" 
        placeholder="Пароль" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        required 
        style={styles.input}
      />
      
      <button 
        type="submit" 
        style={styles.submitButton}
        onMouseOver={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
        onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563eb'}
      >
        {isLogin ? 'Войти' : 'Зарегистрироваться'}
      </button>
      
      <button 
        type="button" 
        style={styles.toggleButton} 
        onClick={() => setIsLogin(!isLogin)}
        onMouseOver={e => e.currentTarget.style.color = '#1d4ed8'}
        onMouseOut={e => e.currentTarget.style.color = '#2563eb'}
      >
        {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
      </button>
    </form>
  );
}