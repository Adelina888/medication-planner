export default function Header({ currentTab, setCurrentTab, onLogout }) {
  return (
    <>
      <header style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'white' }}>Medication Planner</h2>
        <button onClick={onLogout} style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white' }}>Выйти</button>
      </header>
      
      <nav className="navbar" style={{ padding: '0 30px', backgroundColor: '#2563eb' }}>
        <button className={currentTab === 'medicines' ? 'active' : ''} onClick={() => setCurrentTab('medicines')}>Лекарства</button>
        <button className={currentTab === 'schedules' ? 'active' : ''} onClick={() => setCurrentTab('schedules')}>Расписание</button>
        <button className={currentTab === 'intakes' ? 'active' : ''} onClick={() => setCurrentTab('intakes')}>Прием</button>
        <button className={currentTab === 'profile' ? 'active' : ''} onClick={() => setCurrentTab('profile')}>Профиль</button>
      </nav>
    </>
  );
}