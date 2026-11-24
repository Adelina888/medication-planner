import { useState } from 'react';
import Auth from './Auth';
import Header from './Header';
import Medicines from './Medicines';
import './App.css';

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
  const [currentTab, setCurrentTab] = useState('medicines');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
  };

  if (!isAuth) {
    return <Auth onLogin={() => setIsAuth(true)} />;
  }

  return (
    <div>
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} onLogout={handleLogout} />
      <div className="container">
        {currentTab === 'medicines' && <Medicines />}
        {currentTab === 'intakes' && <div><h2>Модуль в разработке</h2></div>}
        {currentTab === 'profile' && <div><h2>Профиль пользователя</h2></div>}
      </div>
    </div>
  );
}