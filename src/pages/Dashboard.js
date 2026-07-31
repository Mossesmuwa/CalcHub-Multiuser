import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import Calculator from '../components/Calculator';
import History from '../components/History';
import UnitConverter from '../components/UnitConverter';
import CurrencyConverter from '../components/CurrencyConverter';

function Dashboard({ user }) {
  const [tab, setTab] = useState('history');
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
      <p className="welcome-row">Welcome back, {firstName}</p>

      <div className="main-grid">
        {/* left column: the calculator, always visible */}
        <Calculator user={user} onSaved={() => setRefreshKey(refreshKey + 1)} />

        {/* right column: stats up top, then history/tools in tabs */}
        <div className="side-column">
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

          <div className="tabs" style={{ marginBottom: 16 }}>
            <button className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>History</button>
            <button className={`tab ${tab === 'tools' ? 'active' : ''}`} onClick={() => setTab('tools')}>Tools</button>
          </div>

          {tab === 'history' && <History user={user} refreshKey={refreshKey} />}
          {tab === 'tools' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <UnitConverter />
              <CurrencyConverter />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
