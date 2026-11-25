export default function Home({ userName }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Добро пожаловать, {userName || 'Пользователь'}! </h1>
      <p>Ваше здоровье под контролем.</p>
    </div>
  );
}