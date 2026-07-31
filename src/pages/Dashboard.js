import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import Calculator from '../components/Calculator';
import History from '../components/History';
import UnitConverter from '../components/UnitConverter';
import CurrencyConverter from '../components/CurrencyConverter';

function Dashboard({ user }) {
  const [tab, setTab] = useState('calculator');
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({ total: 0, mostUsed: '—' });

  useEffect(() => {
    let cancelled = false;

    supabase
      .from('calculations')
      .select('expression')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (cancelled || !data) return;

        const opCounts = { '+': 0, '-': 0, '*': 0, '/': 0 };
        data.forEach((row) => {
          for (const op of Object.keys(opCounts)) {
            if (row.expression.includes(op)) opCounts[op]++;
          }
        });
        const mostUsed = Object.entries(opCounts).sort((a, b) => b[1] - a[1])[0];

        setStats({
          total: data.length,
          mostUsed: mostUsed && mostUsed[1] > 0 ? mostUsed[0] : '—',
        });
      });

    return () => { cancelled = true; };
  }, [user.id, refreshKey]);

  const firstName = user.email.split('@')[0];

  return (
    <div className="app-shell">
      <Navbar />

      <p style={{ color: 'var(--text-muted)', marginTop: -8, marginBottom: 16 }}>
        Welcome back, {firstName}
      </p>

      <div className="stats-row">
        <div className="card stat-card">
          <div className="value">{stats.total}</div>
          <div className="label">Total calculations</div>
        </div>
        <div className="card stat-card">
          <div className="value">{stats.mostUsed}</div>
          <div className="label">Most used operator</div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'calculator' ? 'active' : ''}`} onClick={() => setTab('calculator')}>Calculator</button>
        <button className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>History</button>
        <button className={`tab ${tab === 'tools' ? 'active' : ''}`} onClick={() => setTab('tools')}>Tools</button>
      </div>

      {tab === 'calculator' && (
        <Calculator user={user} onSaved={() => setRefreshKey(refreshKey + 1)} />
      )}
      {tab === 'history' && <History user={user} refreshKey={refreshKey} />}
      {tab === 'tools' && (
        <>
          <UnitConverter />
          <div style={{ height: 14 }} />
          <CurrencyConverter />
        </>
      )}
    </div>
  );
}

export default Dashboard;
