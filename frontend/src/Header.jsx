import { Pill, Calendar, ClipboardList, User, LogOut } from 'lucide-react';


export default function Header({ currentTab, setCurrentTab, onLogout }) {
  return (
    <>
      <header style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'white' }}>Medication Planner</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={onLogout} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <LogOut size={20} /> Выйти
          </button>
        </div>
      </header>
      
      <nav className="navbar" style={{ padding: '0 30px', backgroundColor: '#2563eb' }}>
        <button className={currentTab === 'home' ? 'active' : ''} onClick={() => setCurrentTab('home')}>Главная</button>
        <button className={currentTab === 'medicines' ? 'active' : ''} onClick={() => setCurrentTab('medicines')}><Pill size={16}/> Лекарства</button>
        <button className={currentTab === 'schedules' ? 'active' : ''} onClick={() => setCurrentTab('schedules')}><Calendar size={16}/> Расписание</button>
        <button className={currentTab === 'intakes' ? 'active' : ''} onClick={() => setCurrentTab('intakes')}><ClipboardList size={16}/> Прием</button>
        <button className={currentTab === 'profile' ? 'active' : ''} onClick={() => setCurrentTab('profile')}><User size={16}/> Профиль</button>
      </nav>
    </>
  );
}