import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import Calculator from './components/Calculator';
import History from './components/History';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [historyKey, setHistoryKey] = useState(0);

  useEffect(() => {
    // check if someone's already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setCheckingSession(false);
    });

    // keep listening for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (checkingSession) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="app">
      <header>
        <span className="logo">🧮 Calculator App</span>
        <button onClick={handleLogout}>Log Out</button>
      </header>
      <p className="logged-in-as">Logged in as {user.email}</p>

      <Calculator user={user} onNewCalculation={() => setHistoryKey(historyKey + 1)} />
      <History user={user} refreshKey={historyKey} />
    </div>
  );
}

export default App;
