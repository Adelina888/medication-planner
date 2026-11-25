import { useState } from 'react';
import Auth from './Auth';
import Header from './Header';
import Home from './Home';
import Medicines from './Medicines';
import Schedules from './Schedules';
import Intakes from './Intakes';
import Profile from './Profile';
import './App.css';

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
  const [currentTab, setCurrentTab] = useState('home');
  
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Пользователь');

  const handleLogin = () => {
    setUserEmail(localStorage.getItem('userEmail') || '');
    setUserName(localStorage.getItem('userName') || 'Пользователь');
    setIsAuth(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuth(false);
  };

  if (!isAuth) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div>
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} onLogout={handleLogout} />
      <div className="container">
        {currentTab === 'home' && <Home userName={userName} />}
        {currentTab === 'medicines' && <Medicines />}
        {currentTab === 'schedules' && <Schedules />}
        {currentTab === 'intakes' && <Intakes />}
        {currentTab === 'profile' && <Profile userEmail={userEmail} userName={userName} />}
      </div>
    </div>
  );
}