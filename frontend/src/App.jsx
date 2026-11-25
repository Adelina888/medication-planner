import { useState } from 'react';
import Auth from './Auth';
import Header from './Header';
import Home from './Home';
import Medicines from './Medicines';
import Schedules from './Schedules';
import Intakes from './Intakes';
import './App.css';

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
  const [currentTab, setCurrentTab] = useState('home'); // По умолчанию Главная
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = (email) => {
    setUserEmail(email);
    setIsAuth(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
  };

  if (!isAuth) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div>
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} onLogout={handleLogout} />
      <div className="container">
        {currentTab === 'home' && <Home userName={userEmail.split('@')[0]} />}
        {currentTab === 'medicines' && <Medicines />}
        {currentTab === 'schedules' && <Schedules />}
        {currentTab === 'intakes' && <Intakes />}
        
      </div>
    </div>
  );
}